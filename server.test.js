const app = require("./backend/index.js");
const supertest = require("supertest");
const request = supertest(app);
const fs = require("fs");
const bins = [];
fs.readdir(`backend/bins/`, "utf8", (err, files) => {
  files.forEach((file) => {
    bins.push(file);
  });
});

it("gets a list of all the bins", async (done) => {
  const response = await request.get("/all");
  expect(response.status).toBe(200);

  console.log(response.body);
  console.log(bins);
  expect(response.body).toStrictEqual(bins);
  done();
});
