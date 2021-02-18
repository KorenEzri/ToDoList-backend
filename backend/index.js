//BASE PREP
const express = require("express");
const uuid = require("uuid");
const path = require("path");
const binDir = path.join(__dirname, "bins/");
const binDirPath = path.resolve(
  "C:UserskorenDocumentsGitHubpre-course-2021-final-boilerplate\backend\bins"
);
let tasks = require("./Tasks");
const fs = require("fs");
const { error } = require("console");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "../src")));
//BASE END

//ROUTES

//////////////////////////////////////////////////
//BIN-SPECIFIC ROUTES
//////////////////////////////////////////////////

//on GET request: show all bin IDs
app.get("/all", (req, res) => {
  fs.readdir(`backend/bins/`, "utf8", (err, files) => {
    listofTasks = [];
    files.forEach((file) => {
      listofTasks.push(file);
    });
    if (listofTasks.length < 1) {
      return res.status(400).json({
        msg: `No bins found`,
      });
    } else {
      res.send(`Bins available: \n${listofTasks.join("\n")}`);
    }
  });
});

//on GET request: if the specified ID exists, show appropriate bin (show ToDoList basically)
app.get("/b/:id", (req, res) => {
  fs.readFile(`backend/bins/${req.params.id}.json`, "utf8", (err, data) => {
    if (!data) {
      res.status(400).json(`No bin found by the id of ${req.params.id}`);
    } else {
      res.send(JSON.stringify(JSON.parse(data), null, 2));
    }
  });
});

//on a POST request, CREATE a new bin, assign an ID to it, and show it
app.post("/", (req, res) => {
  const binID = uuid.v4();
  let obj = { record: [] };
  let json = JSON.stringify(obj, null, 2);
  fs.writeFile(`backend/bins/${binID}.json`, `${json}`, "utf8", () => {
    res.json(`${binID}`);
  });
});

//on PUT request: update the bin according to it's id
app.put("/b/:id", (req, res) => {
  const BIN_ID = req.params.id;
  let obj = { record: [] };
  obj.record.push(req.body);
  let json = JSON.stringify(obj, null, 2);
  fs.writeFile(`backend/bins/${BIN_ID}.json`, json, "utf8", (data) => {
    res.send(`bin updated. ${json}`);
  });
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

//////////////////////////////////////////////////
//TASK-SPECIFIC ROUTES (After sign-in) (can be used for things other than "Todolist")
//////////////////////////////////////////////////

//on GET request: if the specified ID exists, show appropriate task

//on DELETE request: delete the specified task
// app.delete("/b/:id", (req, res) => {
//   const found = userBin.some((task) => task.id == req.params.id);
//   if (found) {
//     const index = userBin.findIndex(
//       (task) => task.id === parseInt(req.params.id)
//     );
//     userBin.splice(index, 1);
//     res.json({ msg: "task deleted", userBin });
//   } else {
//     res.status(400).json({ msg: `No task with the id of ${req.params.id}` });
//   }
// });

//ROUTES END

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
