const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/to-do-list-app",
  {
    useNewUrlParser: true
  }
);

const Task = mongoose.model("Task", {
  name: {
    type: String
  }
});
// **Create**
app.post("/create", async (req, res) => {
  try {
    const newTask = new Task({
      name: req.body.name
    });
    await newTask.save();
    res.json({ message: "Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **Read**
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log(tasks);
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **Update**
app.post("/update", async (req, res) => {
  try {
    if (req.body.id && req.body.name) {
      const task = await Task.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      task.name = req.body.name;
      await task.save();
      res.json({ message: "Updated" });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **Delete**
app.post("/delete", async (req, res) => {
  try {
    if (req.body.id) {
      const task = await Task.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      await task.remove();
      res.json({ message: "Removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
