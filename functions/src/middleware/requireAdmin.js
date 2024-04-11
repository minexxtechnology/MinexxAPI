const requireAdmin = (req, res, next)=> {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).send({
      message: `You are missing valid session credentials to process your request.`,
      status: `error`,
    });
  }

  if (user.type != `minexx`) {
    return res.status(401).send({
      message: `You don't have permission to access the specified route.`,
      status: `error`,
    });
  }

  return next();
};

module.exports = {requireAdmin};
