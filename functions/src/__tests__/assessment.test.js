const request = require("supertest");
const {app} = require("../..");
const {signJwt} = require("../utils/jwt");
const {accessTokenTtl, refreshTokenTtl} = require("../config/default");

jest.mock("googleapis");

const adminPayload = {
  name: "Beda",
  email: "beda@minexx.co",
  type: "minexx",
  id: 1,
};

const userPayload = {
  name: "Sharpe",
  email: "sharpe@gmail.co",
  type: "buyer",
  id: 2,
  minerals: [
    "Tin",
  ],
};

describe("assessments routes", () => {
  it("should return assessments when accessing /assessments", async () => {
    const accessToken = signJwt({...userPayload, sessionId: 123}, {expiresIn: accessTokenTtl});
    const refreshToken = signJwt({...userPayload, sessionId: 123}, {expiresIn: refreshTokenTtl});

    // Mock the getAssessmentsHandler function to return some assessments
    const mockAssessments = [{id: 1, name: "Assessment 1"}, {id: 2, name: "Assessment 2"}];
    getAssessmentsHandler = jest.fn(() => Promise.resolve({assessments: mockAssessments}));

    // Make the request
    const response = await request(app).get("/assessments").set("authorization", `Bearer ${accessToken}`).set("x-refresh", refreshToken);

    // Assert the response
    expect(response.body.message).toBe("Assessments fetched successfully.");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.assessments).toEqual(mockAssessments);
  });

  it("should return assessments for a specific mine when accessing /assessments/mine/:id", async () => {
    // Mock the requireUser middleware to allow access
    app.use((req, res, next) => {
      req.locals = {user: {id: 1}};
      next();
    });

    // Mock the getMineAssessmentHandler function to return some assessments for a specific mine
    const mockAssessments = [{id: 1, name: "Assessment 1"}, {id: 2, name: "Assessment 2"}];
    getMineAssessmentHandler = jest.fn(() => Promise.resolve({assessments: mockAssessments}));

    // Make the request
    const response = await request(app).get("/assessments/mine/1");

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.assessments).toEqual(mockAssessments);
  });
});
