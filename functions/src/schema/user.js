const {object, string} = require("zod");

const createUserSchema = object({
  body: object({
    name: string({
      required_error: `Please provide your first name to proceed.`,
    }),
    surname: string({
      required_error: `Please provide your last name to proceed.`,
    }),
    email: string({
      required_error: `Please provide an email to proceed.`,
    }).email(`The email address provided is invalid`),
    password: string({
      required_error: `Please provide your password to proceed.`,
    }).min(8, `The password provided is too short. Password should be 8 or more characters`),
    type: string().optional(),
    companies: string().array().optional(),
  }),
});

const createUsersSchema = object({
  body: object({
    users: object({
      name: string({
        required_error: `Please provide your first name to proceed.`,
      }),
      surname: string({
        required_error: `Please provide your last name to proceed.`,
      }),
      email: string({
        required_error: `Please provide an email to proceed.`,
      }).email(`The email address provided is invalid`),
      password: string({
        required_error: `Please provide your password to proceed.`,
      }).min(8, `The password provided is too short. Password should be 8 or more characters`),
      type: string().optional(),
      companies: string().array().optional(),
    }).array(),
  }),
});

const findUserSchema = object({
  params: object({
    uid: string({
      required_error: `Please provide the user's unique identity.`,
    }),
  }),
});

const findUsersSchema = object({
  params: object({
    status: string({
      required_error: `Please provide the query status for users request.`,
    }),
  }),
});

const updateUserSchema = object({
  params: object({
    uid: string({
      required_error: `Please provide the user's unique identity.`,
    }),
  }),
  body: object({
    email: string().email(`The email address provided is invalid`).optional(),
    phone: string().optional(),
    photoURL: string().optional(),
  }),
});

const updateUserPasswordSchema = object({
  params: object({
    uid: string({
      required_error: `Please provide the user's unique identity.`,
    }),
  }),
  body: object({
    password: string({
      required_error: `Please confirm password change by providing your current password.`,
    }).min(8, `The password provided is too short. Password should be 8 or more characters`),
    newPassword: string({
      required_error: `Please provide the password you would like to use. Password should be 8 or more characters.`,
    }).min(8, `The password provided is too short. Password should be 8 or more characters`),
  }),
});

module.exports = {
  createUserSchema,
  createUsersSchema,
  findUserSchema,
  findUsersSchema,
  updateUserSchema,
  updateUserPasswordSchema,
};
