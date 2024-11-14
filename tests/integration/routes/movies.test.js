const request = require("supertest");
const { Movie } = require("../../../models/movie");
const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");

const mongoose = require("mongoose");
let server;

describe("/api/movies", () => {
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    if (server && server.listening) await server.close();
    await Movie.deleteMany({});
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all movies", async () => {
      const res = await request(server).get("/api/movies/");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("should return a movie with given id", async () => {
      const movie = new Movie({
        title: "mad max",
        genre: {
          _id: "673515aadea4f945c4023105",
          name: "action",
        },
        numberInStock: 12,
        dailyRentalRate: 4,
      });
      await movie.save();

      const res = await request(server).get("/api/movies/" + movie._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", movie.title);
    });

    it("should return 404 if no movie with given id exists", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get("/api/movies/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let movie;

    const exec = () => {
      return request(server)
        .post("/api/movies/")
        .set("x-auth-token", token)
        .send(movie);
    };

    beforeEach(async () => {
      const genre = new Genre({
        _id: mongoose.Types.ObjectId("673515aadea4f945c4023105"),
        name: "action",
      });
      await genre.save();

      token = new User().generateAuthToken();
      movie = {
        title: "mad max",
        genreId: genre._id,
        numberInStock: 12,
        dailyRentalRate: 4,
      };
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if title is less than 3 characters", async () => {
      movie.title = "it";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if numberInStock is less than 0", async () => {
      movie.numberInStock = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if dailyRentalRate is less than 0", async () => {
      movie.dailyRentalRate = -1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre id is not valid", async () => {
      movie.genreId = mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return save movie if it is valid", async () => {
      await exec();
      const newMovie = await Movie.find({ title: movie.title });
      expect(newMovie).not.toBeNull();
    });

    it("should return movie if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("title", movie.title);
      expect(res.body).toHaveProperty("_id");
    });
  });

  describe("DELETE /", () => {
    let token;
    let movieId;

    beforeEach(async () => {
      const genre = new Genre({
        _id: mongoose.Types.ObjectId("673515aadea4f945c4023105"),
        name: "action",
      });
      await genre.save();

      token = new User({
        name: "admin",
        email: "admin@gmail.com",
        password: "password",
        isAdmin: true,
      }).generateAuthToken();

      const movie = new Movie({
        title: "mad max",
        genre: genre,
        numberInStock: 12,
        dailyRentalRate: 4,
      });
      await movie.save();
      movieId = movie._id;
    });

    it("should return 404 if id is not valid", async () => {
      const res = await request(server)
        .delete("/api/movies/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should return 404 if movie not found", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server)
        .delete("/api/movies/" + id)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should delete the movie if input is valid", async () => {
      const res = await request(server)
        .delete("/api/movies/" + movieId)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);

      const deletedMovie = await Movie.findById(movieId);
      expect(deletedMovie).toBeNull();
    });
  });

  describe("PUT /", () => {
    let token;
    let movieId;
    let genreId;

    beforeEach(async () => {
      const genre = new Genre({
        _id: mongoose.Types.ObjectId("673515aadea4f945c4023105"),
        name: "action",
      });
      await genre.save();
      genreId = genre._id;

      token = new User({
        name: "admin",
        email: "admin@example.com",
        password: "password",
        isAdmin: true,
      }).generateAuthToken();

      const movie = new Movie({
        title: "mad max",
        genre: genre,
        numberInStock: 12,
        dailyRentalRate: 4,
      });

      const savedMovie = await movie.save();
      movieId = savedMovie._id;
    });

    it("should return 404 if movie not found", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server)
        .put("/api/movies/" + id)
        .set("x-auth-token", token)
        .send({
          title: "new title",
          genreId: genreId,
          numberInStock: 10,
          dailyRentalRate: 5,
        });
      expect(res.status).toBe(404);
    });

    it("should return 400 if input is invalid", async () => {
      const res = await request(server)
        .put("/api/movies/" + movieId)
        .set("x-auth-token", token)
        .send({
          title: "aa",
          genreId: genreId,
          numberInStock: 10,
          dailyRentalRate: 5,
        });
      expect(res.status).toBe(400);
    });

    it("should update the movie if input is valid", async () => {
      const updatedData = {
        title: "new mad max",
        genreId: genreId,
        numberInStock: 20,
        dailyRentalRate: 6,
      };

      const res = await request(server)
        .put("/api/movies/" + movieId)
        .set("x-auth-token", token)
        .send(updatedData);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", updatedData.title);
      expect(res.body).toHaveProperty(
        "numberInStock",
        updatedData.numberInStock
      );
      expect(res.body).toHaveProperty(
        "dailyRentalRate",
        updatedData.dailyRentalRate
      );
    });

    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await request(server)
        .put("/api/movies/" + movieId)
        .set("x-auth-token", token)
        .send({
          title: "updated title",
          genreId: genreId,
          numberInStock: 15,
          dailyRentalRate: 5,
        });
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is invalid", async () => {
      const invalidGenreId = mongoose.Types.ObjectId().toHexString();
      const res = await request(server)
        .put("/api/movies/" + movieId)
        .set("x-auth-token", token)
        .send({
          title: "new title",
          genreId: invalidGenreId,
          numberInStock: 10,
          dailyRentalRate: 4,
        });
      expect(res.status).toBe(400);
    });
  });
});
