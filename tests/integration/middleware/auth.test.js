const request = require("supertest");
const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");
const mongoose = require('mongoose');

describe("auth middleware", () => {
  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres/")
      .set("x-auth-token", token)
      .send({ name: "genre 1" });
  };

  beforeEach(() => {
    server = require("../../../index");
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    if (server && server.listening) await server.close();
    await Genre.deleteMany({}); // clean up db
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
