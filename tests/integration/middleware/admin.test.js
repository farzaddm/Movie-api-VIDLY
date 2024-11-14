const request = require("supertest");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const auth = require("../../../middleware/auth");
jest.mock("../../../middleware/auth");

describe("admin middleware", () => {
  let server;
  let token;

  beforeEach(() => {
    server = require("../../../index");
    auth.mockImplementation((req, res, neat) => {
      req.user = { isAdmin: true };
      next();
    });

    token = new User({
      name: "name",
      email: "email@gmail.com",
      password: "password",
      isAdmin: true,
    }).generateAuthToken();
  });

  afterEach(async () => {
    if (server && server.listening) await server.close();
  });

  const exec = async() => {
    const id = mongoose.Types.ObjectId().toHexString();
    const res = await request(server)
      .delete("/api/movies/" + id)
      .set("x-auth-token", token);
    return res;
  };

  it("should return 403 user is not admin", async () => {
    auth.mockImplementation((req, res, next) => {
      req.user = { isAdmin: false };
      next();
    });
    const res = await exec();
    expect(res.status).toBe(403);
  });
});
