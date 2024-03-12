const {requestResetPassword, changePassword} = require("../services/user");

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
  app.post(`/forgot`, resetPasswordHandler);
  app.post(`/password`, changePasswordHandler);
};
