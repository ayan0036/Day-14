 const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student"); // Adjust path as needed
const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/studentDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// PUT /student/:id
app.put("/student/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, course } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, course },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student updated", student: updatedStudent });
  } catch (err) {
    res.status(500).json({ message: "Error updating student", error: err.message });
  }
});

// DELETE /student/:id
app.delete("/student/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted", student: deletedStudent });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student", error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

// GET route to fetch all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
});
