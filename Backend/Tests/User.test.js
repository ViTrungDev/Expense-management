// Tests/User.test.js
import request from "supertest";
import app from "../app.js";

test("GET / should return backend status", async () => {
  const res = await request(app).get("/");
  expect(res.statusCode).toBe(200);
  expect(res.text).toBe("Backend is running!");
});
