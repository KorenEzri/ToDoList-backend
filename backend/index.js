//BASE PREP
const express = require("express");
const uuid = require("uuid");
const fs = require("fs");
const app = express();
const listofTasks = [];

app.use(function (req, res, next) {
  setTimeout(next, 1000);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//BASE END

//ROUTES

//////////////////////////////////////////////////
//BIN-SPECIFIC ROUTES
//////////////////////////////////////////////////

//on GET request: show all bin IDs
app.get("/all", (req, res) => {
  fs.readdir(`backend/bins/`, "utf8", (err, files) => {
    files.forEach((file) => {
      listofTasks.push(file);
    });
    if (listofTasks.length < 1) {
      return res.status(404).json({
        msg: `No bins found`,
      });
    } else {
      res.status(200).send(listofTasks);
    }
  });
});

//on GET request: if the specified ID exists, show appropriate bin (show ToDoList basically)
app.get("/b/:id", (req, res) => {
  fs.readFile(`backend/bins/${req.params.id}.json`, "utf8", (err, data) => {
    if (!data) {
      res.status(400).json(`No bin found by the id of ${req.params.id}`);
    } else {
      res.status(200).send(JSON.stringify(JSON.parse(data), null, 2));
    }
  });
});

//on a POST request, CREATE a new bin, assign an ID to it, and show it
app.post("/", (req, res) => {
  const binID = uuid.v4();
  let obj = { record: [] };
  let json = JSON.stringify(obj, null, 2);
  try {
    fs.writeFile(`backend/bins/${binID}.json`, `${json}`, "utf8", () => {
      res.json(`${binID}`);
    });
  } catch {
    res.status(400).send(`ERROR!, ${err}`);
  }
});

//on PUT request: update the bin according to it's id
app.put("/b/:id", (req, res, next) => {
  try {
    const BIN_ID = req.params.id;
    let obj = { record: [] };
    obj.record.push(req.body);
    let json = JSON.stringify(obj, null, 2);
    fs.writeFile(`backend/bins/${BIN_ID}.json`, json, "utf8", (data) => {
      res.status(201).send(req.body);
    });
  } catch {
    res.status(404).json({
      statusCode: 404,
      error: true,
      msg: `File ${BIN_ID} not found`,
    });
  }
});

//on DELETE request: delete the specified bin
app.delete("/b/:id", (req, res) => {
  const id = req.params.id;
  const path = `backend/bins/${req.params.id}.json`;
  try {
    fs.unlinkSync(path);
    res.send(`Deleted ${id}`);
  } catch (err) {
    console.log(err);
  }
});

//ROUTES END

const PORT = process.env.PORT || 3001;

module.exports = app;
