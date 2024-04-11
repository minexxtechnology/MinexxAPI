const validate = (schema) => (req, res, next)=>{
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    return res.status(400).send({
      status: `error`,
      message: e.errors[0].message,
    });
  }
};

module.exports = {validate};
