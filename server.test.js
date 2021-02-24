const app = require("./backend/index.js");
const supertest = require("supertest");
const request = supertest(app);
const fs = require("fs");
const uuid = require("uuid");
const bins = [];
let originalAmountofBins;
let currentAmountofBins;
const generateID = () => {
  return uuid.v4();
};
const countBins = () => {
  const updatedBinDir = fs.readdirSync(`backend/bins/`);
  bins.length = 0;
  updatedBinDir.forEach((file) => {
    bins.push(file);
  });
};

describe("JSONBIN MOCK", () => {
  afterAll(() => {
    countBins();
    let binID = bins[0];
    let obj = {
      record: [
        {
          "my-todo": [
            {
              date: ", added at: 2021-02-24T8:19:3.758 Priority ",
              text: "Cyber 4s FOR THE WIN (i came from the test suite)",
              priority: "1",
            },
            {
              amount: 0,
              index: [],
            },
          ],
        },
      ],
    };
    let json = JSON.stringify(obj, null, 2);
    if (binID === "default.json") {
      binID = bins[1];
    }
    fs.unlink(`backend/bins/${binID}`, (err) => {
      return;
    });
    fs.writeFile(`backend/bins/cyber4s.json`, `${json}`, "utf8", (err) => {
      return;
    });
  });

  it("gets a list of all the bins", async (done) => {
    fs.readdir(`backend/bins/`, "utf8", (err, files) => {
      files.forEach((file) => {
        bins.push(file);
      });
      originalAmountofBins = bins.length;
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
    let binID = generateID();
    if (bins.includes(binID)) {
      return (binID = generateID());
    }
    const response = await request.get(`/b/${binID}`);
    expect(response.status).toBe(400);
    expect(response.body).toBe(`No bin found by the id of ${binID}`);
    done();
  });

  it("Can add a new bin", async (done) => {
    const response = await request.post("/");
    countBins();
    currentAmountofBins = bins.length;
    expect(currentAmountofBins).toBeGreaterThan(originalAmountofBins);
    done();
  });

  // it("BONUS can not add a bin with illegal body", async (done) => {
  //   const response = await request.post("/").send({ lucky: " Seven " });
  //   expect(response.status).toBe(200);
  //   expect(response.body).toBe(
  //     `Error: NEW BIN REQUESTS MUST BE OF EMPTY BINS ONLY. REMOVING DATA AND CREATING AN EMPTY BIN.`
  //   );
  //   done();
  // });

  it("can update a bin by id", async (done) => {
    const binID = bins[1].slice(0, -5);
    const toDoList = [
      {
        date: ", added at: 2021-02-24T8:19:3.758 Priority ",
        text: "Cyber 4s FOR THE WIN (i came from the test suite :))",
        priority: "1",
      },
      {
        amount: 0,
        index: [],
      },
    ];
    const reqBodyObj = { "my-todo": toDoList };
    const response = await request.put(`/b/${binID}`).send(reqBodyObj);
    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(reqBodyObj);
    allBins = fs.readdirSync(`backend/bins/`);
    bins.length = 0;
    allBins.forEach((bin) => {
      bins.push(bin);
    });
    originalAmountofBins = bins.length;
    done();
  });
  it("no new bin is created on update.", async (done) => {
    countBins();
    currentAmountofBins = bins.length;
    expect(currentAmountofBins).toStrictEqual(originalAmountofBins);
    done();
  });
  it("if an illegal id is requested an appropriate response is sent.", async (done) => {
    const binID = bins[0].slice(0, -5);
    const taskObject = {
      text: " Seven ",
      priority: "1",
      date: `"${new Date()}"`,
    };
    const response = await request.put(`/b/${binID}.One`).send(taskObject);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual(
      `This ID "${binID}.One" is not a legal bin-ID.`
    );
    done();
  });
  it("if a bin is not found an appropriate response is sent.", async (done) => {
    const taskObject = {
      text: " Seven ",
      priority: "1",
      date: `"${new Date()}"`,
    };
    let binID = generateID();
    if (bins.includes(binID)) {
      return (binID = generateID());
    }
    const response = await request.put(`/b/${binID}`).send(taskObject);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual(`File ${binID} not found`);
    done();
  });
  it("can delete a bin.", async (done) => {
    const allBins = fs.readdirSync(`backend/bins/`);
    bins.length = 0;
    allBins.forEach((bin) => {
      bins.push(bin);
    });
    originalAmountofBins = bins.length;
    let binID = bins[bins.indexOf("cyber4s.json")].slice(0, -5);
    const response = await request.delete(`/b/${binID}`);
    const updateBinList = fs.readdirSync(`backend/bins/`);
    bins.length = 0;
    updateBinList.forEach((file) => {
      bins.push(file);
    });
    currentAmountofBins = bins.length;
    expect(response.status).toBe(204);
    expect(currentAmountofBins).toBeLessThan(originalAmountofBins);
    done();
  });
  it("if an illegal id is requested an appropriate response is sent.", async (done) => {
    const binID = bins[1].slice(0, -5);
    const response = await request.delete(`/b/${binID}.One`);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual(
      `This ID "${binID}.One" is not a legal bin-ID.`
    );
    done();
  });
  it("if a bin is not found an appropriate response is sent.", async (done) => {
    const binID = bins[0].slice(0, -5);
    if (bins.includes(binID)) {
      return (binID = generateID());
    }
    const response = await request.delete(`/b/${binID}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual(`File ${binID} not found`);
    done();
  });
});
