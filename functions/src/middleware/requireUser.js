const requireUser = (req, res, next)=> {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).send({
      message: `You are missing valid session credentials to process your request.`,
      status: `error`,
    });
  }

  return next();
};

module.exports = {requireUser};
