const app = require("./backend/index.js");
const supertest = require("supertest");
const request = supertest(app);
const fs = require("fs");
const listofTasks = [];

it("gets a list of all the bins", async (done) => {
  const response = await request.get("/all");
  expect(response.status).toBe(200);
  fs.readdir(`backend/bins/`, "utf8", (err, files) => {
    files.forEach((file) => {
      listofTasks.push(file);
      // listofTasks.shift();
    });
  });
  expect(JSON.stringify(response.text)).toBe(listofTasks);
  done();
});
