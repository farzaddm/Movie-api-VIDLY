const request = require("supertest");
const { Customer } = require("../../../models/customer");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("/api/customers/", () => {
  let server;
  beforeEach(async () => {
    server = require("../../../index");
  });
  afterEach(async () => {
    if (server && server.listening) await server.close();
    await Customer.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all customers", async () => {
      const res = await request(server).get("/api/customers/");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    let customerId;
    let customer;
    beforeEach(async () => {
      customer = new Customer({
        name: "customer",
        isGold: true,
        phone: "1234567890",
      });
      await customer.save();
      customerId = customer._id;
    });

    it("should return 404 if customer is not exists", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get("/api/customers/" + id);
      expect(res.status).toBe(404);
    });

    it("should return the custmer with given id", async () => {
      const res = await request(server).get("/api/customers/" + customerId);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", customer.name);
    });
  });

  describe("POST /", () => {
    let customer;
    let token;
    beforeEach(async () => {
      token = new User().generateAuthToken();
      customer = {
        name: "customer",
        isGold: true,
        phone: "12345678900",
      };
    });
    const exec = () => {
      return request(server)
        .post("/api/customers/")
        .set("x-auth-token", token)
        .send(customer);
    };

    it("should return 400 if name is less than 3 characters", async () => {
      customer.name = "12";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if phone is less than 11 characters", async () => {
      customer.phone = "1234567";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 and customer if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("name", customer.name);
      expect(res.status).toBe(200);
    });

    it("should save customer if it is valid", async () => {
      await exec();
      const savedCustomer = await Customer.find({ name: customer.name });
      expect(savedCustomer).not.toBeNull();
    });
  });
});
