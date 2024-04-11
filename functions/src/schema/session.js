const {object, string} = require("zod");

const createSessionSchema = object({
  body: object({
    email: string({
      required_error: `Please provide an email to proceed.`,
    }).email(`The email address provided is invalid`),
    password: string({
      required_error: `Please provide your password to proceed.`,
    }).min(8, `The password provided is too short. Password should be 8 or more characters`),
  }),
});

module.exports = {
  createSessionSchema,
};
