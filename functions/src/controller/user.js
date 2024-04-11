const {requestResetPassword, changePassword, validatePassword} = require("../services/user");
const Session = require("../model/session");
const {createSession} = require("../services/session");
const {signJwt} = require("../utils/jwt");
const config = require("../config/default");

const createSessionHandler = async (req, res) => {
  try {
    const user = await validatePassword(req.body);

    if (!user) {
      return res.status(400).send({
        status: `error`,
        message: `The email/password combination does not match any account.`,
      });
    }

    const session = await createSession(new Session({user: user.uid, userAgent: req.get(`user-agent`) || ``, ipAddress: req.header("x-forwarded-for") || req.socket.remoteAddress}));

    const accessToken = signJwt(
        {
          ...user,
          session: session.id,
        },
        {
          expiresIn: config.accessTokenTtl,
        },
    );

    const refreshToken = signJwt({
      ...user,
      session: session.id,
    },
    {
      expiresIn: config.refreshTokenTtl,
    });

    return res.send({
      accessToken, refreshToken, user,
    });
  } catch (e) {
    // logger.info(e);
    console.log(e);
    return res.status(400).send({
      message: `The email/password combination did not match any of our records.`,
      status: `error`,
    });
  }
};

const resetPasswordHandler = async (req, res)=> {
  try {
    const reset = await requestResetPassword(req.body.email);
    res.send({
      success: reset,
      message: "Any email with instructions to reset your password, has been sent to your email address if you have an account with us.",
    });
  } catch (err) {
    res.send(409).send({
      success: false,
      message: "There was an error requesting your password reset.",
    });
  }
};

const changePasswordHandler = async (req, res) => {
  try {
    const {email, password, cpassword} = req.body;
    const user = await changePassword(email, password, cpassword);
    res.send({
      success: true,
      user,
      message: "Your password has been updated successfully!",
    });
  } catch (err) {
    res.send(409).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = (app)=>{
  app.post(`/login`, createSessionHandler);
  app.post(`/forgot`, resetPasswordHandler);
  app.post(`/password`, changePasswordHandler);
};
