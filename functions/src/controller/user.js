const {requestResetPassword, changePassword, validatePassword, fetchUsers, createUser, deleteUser, updateUserStatus, updateUser} = require("../services/user");
const Session = require("../model/session");
const {createSession, terminateSession, terminateAll} = require("../services/session");
const {signJwt} = require("../utils/jwt");
const config = require("../config/default");
const {requireAdmin} = require("../middleware/requireAdmin");
const {get} = require("lodash");

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
    return res.status(400).send({
      message: `The email/password combination did not match any of our records.`,
      status: `error`,
    });
  }
};

const createUserHandler = async (req, res) => {
  try {
    const user = await createUser(req.body);
    return res.send({
      success: true,
      user,
    });
  } catch (err) {
    res.send(409).send({
      success: false,
      message: err.message,
    });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const {uid} = req.params;
    const deleted = await deleteUser(uid);
    return res.send({
      success: true,
      deleted,
    });
  } catch (err) {
    res.send(409).send({
      success: false,
      message: err.message,
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

const terminateSessionHandler = async (req, res) => {
  try {
    const terminated = await terminateSession(req.params.id);
    return res.send({
      terminated,
      success: true,
    });
  } catch (err) {
    res.send(409).send({
      success: false,
      message: err.message,
    });
  }
};

const terminateAllSessionHandler = async (req, res) => {
  try {
    const terminated = await terminateAll();
    return res.send({
      terminated,
      success: true,
    });
  } catch (err) {
    res.send(409).send({
      success: false,
      message: err.message,
    });
  }
};

const getUsersHandler = async (req, res) => {
  try {
    const {platform} = req.params;
    const dashboard = get(req, `headers.x-platform`) || "3ts";
    const users = await fetchUsers(platform, dashboard);
    return res.send({
      users,
      success: true,
    });
  } catch (err) {
    res.send(409).send({
      success: false,
      message: err.message,
    });
  }
};

const updateUserStatusHandler = async (req, res) => {
  try {
    const {uid} = req.params;
    const updated = await updateUserStatus(uid);
    return res.send({
      updated,
      success: true,
    });
  } catch (err) {
    res.send(409).send({
      success: false,
      message: err.message,
    });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    const {uid} = req.params;
    const {name, surname, email, access} = req.body;
    const updated = await updateUser(uid, name, surname, email, access);
    return res.send({
      updated,
      success: true,
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
  app.post(`/users`, requireAdmin, createUserHandler);
  app.delete(`/users/:uid`, requireAdmin, deleteUserHandler);
  app.put(`/users/:uid`, requireAdmin, updateUserHandler);
  app.put(`/users/status/:uid`, requireAdmin, updateUserStatusHandler);
  app.post(`/forgot`, resetPasswordHandler);
  app.post(`/password`, changePasswordHandler);
  app.delete(`/sessions/:id`, requireAdmin, terminateSessionHandler);
  app.delete(`/sessions`, requireAdmin, terminateAllSessionHandler);
  app.get(`/users/:platform`, getUsersHandler);
};
