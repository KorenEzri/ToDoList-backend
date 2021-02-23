const app = require("./backend/index.js");
const supertest = require("supertest");
const request = supertest(app);
const fs = require("fs");
const uuid = require("uuid");
const bins = [];
const originalAmountofBins = [];
const currentAmountofBins = [];

describe("GET REQUESTS", () => {
  it("gets a list of all the bins", async (done) => {
    fs.readdir(`backend/bins/`, "utf8", (err, files) => {
      files.forEach((file) => {
        bins.push(file);
      });
      originalAmountofBins.push(bins.length);
      return bins;
    });
    const response = await request.get("/all");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(bins);
    done();
  });

  it("can get a bin by id", async (done) => {
    const binID = bins[0].slice(0, -5);
    const response = await request.get(`/b/${binID}`);
    const bin = fs.readFile(`backend/bins/${binID}`, "utf8", (err, data) => {
      return data;
    });
    expect(response.status).toBe(200);
    expect(response.body.text).toStrictEqual(bin);
    done();
  });

  it("if an illegal id is requested an appropriate response is sent (status + message)", async (done) => {
    const response = await request.get(`/b/${bins[0]}`);
    const bin = fs.readFile(`backend/bins/${bins[0]}`, "utf8", (err, data) => {
      return data;
    });
    expect(response.status).toBe(404);
    expect(response.body.text).toStrictEqual(bin);
    done();
  });

  it("if a bin is not found an appropriate response is sent (status + message)", async (done) => {
    const generateID = () => {
      return uuid.v4();
    };
    let binID = generateID();
    if (bins.includes(binID)) {
      return (binID = generateID());
    }
    const response = await request.get(`/b/${binID}`);
    expect(response.status).toBe(400);
    expect(response.body).toBe(`No bin found by the id of ${binID}`);
    done();
  });
});

describe("POST REQUESTS", () => {
  it("Can add a new bin", async (done) => {
    const res = await request.post("/");
    fs.readdir(`backend/bins/`, "utf8", (err, files) => {
      bins.length = 0;
      files.forEach((file) => {
        bins.push(file);
      });
      return bins;
    });
    currentAmountofBins.push(bins.length);
    expect(currentAmountofBins[0]).toBeGreaterThan(originalAmountofBins[0]);
    done();
  });
});
