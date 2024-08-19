const {method} = require("lodash");

const documentation = (req, res)=>{
  res.send({
    "success": true,
    "requiredHeaders": {
      "authorization": "The 'Bearer' access token received at login.",
      "x-refresh": "The refresh token received at login to refresh access token if expired.",
      "x-platform": "The dashboard to access. Should either be 'gold' or '3ts'. Default value: '3ts'",
    },
    "endpoints": {
      "assessments": {
        "/asssessments": {
          description: "Get all assessments.",
          method: "GET",
        },
        "/asssessments/mine/{id}": {
          description: "Get specific assessment details. Where id is the unique identifier for the assessment.",
          method: "GET",
        },
      },
      "companies": {
        "/companies": {
          description: "Get all companies for the requesting dashboard.",
          method: "GET",
        },
        "/companies/all": {
          description: "Get all companies from gold and 3ts.",
          method: "GET",
        },
        "/companies/{id}": {
          description: "Get specific company details. Where id is the unique identifier for the company.",
          method: "GET",
        },
        "/owners/{id}": {
          description: "Get owners details for specific company. Where id is the unique identifier for the company.",
          method: "GET",
        },
        "/shareholders/{id}": {
          description: "Get shareholders details for specific company. Where id is the unique identifier for the company.",
          method: "GET",
        },
        "/documents/{id}": {
          description: "Get documents for specific company. Where id is the unique identifier for the company.",
          method: "GET",
        },
      },
      "exports": {
        "/exports": {
          description: "Get all exports.",
          method: "GET",
        },
        "/exports/{id}": {
          description: "Get specific export details. Where id is the unique identifier for the export.",
          method: "GET",
        },
      },
      "incidents": {
        "/incidents": {
          description: "Get all incidents.",
          method: "GET",
        },
        "/incidents/{id}": {
          description: "Get specific incident details. Where id is the unique identifier for the incident.",
          method: "GET",
        },
      },
      "integrations": {
        "/metails_api": {
          description: "Get TIN rates from MetalsAPI.",
          method: "GET",
        },
      },
      "mines": {
        "/mines": {
          description: "Get all mines.",
          method: "GET",
        },
        "/miners/{mine}": {
          description: "Get all miners for a specific mine. Where mine is the unique identifier for the mine.",
          method: "GET",
        },
        "/mines/{id}": {
          description: "Get specific mine details. Where id is the unique identifier for the mine.",
          method: "GET",
        },
        "/miners/images/{id}": {
          description: "Get images for a specific mine. Where id is the unique identifier for the mine.",
          method: "GET",
        },
        "/miners/videos/{id}": {
          description: "Get videos for a specific mine. Where id is the unique identifier for the mine.",
          method: "GET",
        },
        "/miners/company/{id}": {
          description: "Get mines for a specific company. Where id is the unique identifier for the company.",
          method: "GET",
        },
      },
      "overview": {
        "/overview/assessments": {
          description: "Get assessments counts for the past 6 months for overview reporting.",
          method: "GET",
        },
        "/overview/incidents": {
          description: "Get incidents counts for the past 6 months for overview reporting.",
          method: "GET",
        },
        "/overview/exports": {
          description: "Get exports counts for the past 6 months for overview reporting.",
          method: "GET",
        },
        "/overview/risks": {
          description: "Get incidents risks counts for overview reporting.",
          method: "GET",
        },
      },
      "reporting": {
        "/logs": {
          description: "Get all system logs. Requires user to be admin",
          method: "GET",
        },
        "/admin/{selection}": {
          description: "Get specific admin overview report. Where selection is the database to report on. Values can be 'production', 'blending' or 'processing' for 3Ts and 'production' or 'purchase' for Gold",
          method: "GET",
        },
      },
      "users": {
        "/login": {
          description: "Authenticate user and create valid session credentials.",
          method: "POST",
          body: {
            email: "<string> has to be a vaid email address",
            password: "<string> has to be at least 8 characters long",
          },
        },
        "/users": {
          description: "Create a dashboard user account.",
          method: "POST",
          body: {
            name: "<string>",
            surname: "<string>",
            email: "<string> has to be a valid email address",
            password: "<string> has to be at least 8 characters long",
            company: "<string>",
            type: "<string>",
          },
        },
      },
    },
    "lastUpdated": "Aug 15, 2024",
  });
};
module.exports = (app)=>{
  app.get(`/documentation`, documentation);
};
