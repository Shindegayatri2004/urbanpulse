// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory students "DB"
let students = [
  { id: 1, name: 'Alice', age: 20, major: 'CS' },
  { id: 2, name: 'Bob', age: 21, major: 'ECE' }
];
let nextId = students.length + 1;

// GET  -> list all students
app.get('/api/students', (req, res) => {
  res.json(students);
});

// GET -> get single student by id
app.get('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// POST -> create a new student
app.post('/api/students', (req, res) => {
  const { name, age, major } = req.body;
  if (!name || age === undefined || !major) {
    return res.status(400).json({ error: 'Missing required fields: name, age, major' });
  }
  const newStudent = { id: nextId++, name, age: Number(age), major };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT -> replace an existing student (all fields required)
app.put('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Student not found' });

  const { name, age, major } = req.body;
  if (!name || age === undefined || !major) {
    return res.status(400).json({ error: 'Missing required fields: name, age, major' });
  }

  const updated = { id, name, age: Number(age), major };
  students[index] = updated;
  res.json(updated);
});

// PATCH -> partial update (one or more fields)
app.patch('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find(s => s.id === id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const { name, age, major } = req.body;
  if (name !== undefined) student.name = name;
  if (age !== undefined) student.age = Number(age);
  if (major !== undefined) student.major = major;

  res.json(student);
});

// DELETE -> remove a student
app.delete('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Student not found' });

  const [removed] = students.splice(index, 1);
  res.json({ message: 'Student deleted', student: removed });
});

// fallback for unknown API routes
// fallback for unknown API routes (recommended)
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));


// start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
