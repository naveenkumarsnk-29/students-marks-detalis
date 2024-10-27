const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Students-Details', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  rollNo: { type: String, required: true, unique: true },
  mathMarks: { type: Number, required: true },
  computerMarks: { type: Number, required: true },
  chemistryMarks: { type: Number, required: true }
});

const Student = mongoose.model('Student', studentSchema);

app.post('/add-student', async (req, res) => {
  const { name, age, email, rollNo, mathMarks, computerMarks, chemistryMarks } = req.body;
  const newStudent = new Student({ name, age, email, rollNo, mathMarks, computerMarks, chemistryMarks });
  
  try {
    const savedStudent = await newStudent.save();
    res.status(201).send(savedStudent);
  } catch (error) {
    res.status(500).send({ message: 'Error saving student information', error: error.message });
  }
});

app.post('/send-email', async (req, res) => {
  const { email } = req.body;
  
  try {
    const students = await Student.find();
    const totalMarks = students.reduce((acc, student) => acc + (student.mathMarks + student.computerMarks + student.chemistryMarks), 0);
    const avgMarks = totalMarks / (students.length * 3);
    const mathCutoff = Math.max(...students.map(student => student.mathMarks));
    const computerCutoff = Math.max(...students.map(student => student.computerMarks));
    const chemistryCutoff = Math.max(...students.map(student => student.chemistryMarks));
    const cutOffMarks = {
      math: mathCutoff,
      computer: computerCutoff,
      chemistry: chemistryCutoff
    };

    const studentInfo = students.map(student => `Name: ${student.name}, Roll No: ${student.rollNo}, Math: ${student.mathMarks}, Computer: ${student.computerMarks}, Chemistry: ${student.chemistryMarks}`).join('\n');
    const emailContent = `Average Marks: ${avgMarks.toFixed(2)}\nMath Cut-Off: ${cutOffMarks.math}\nComputer Cut-Off: ${cutOffMarks.computer}\nChemistry Cut-Off: ${cutOffMarks.chemistry}\n\nStudent Info:\n${studentInfo}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'naveenkumarsnk333@gmail.com',
        pass: 'tbxoqsapozyrgpay'
      }
    });

    const mailOptions = {
      from: 'naveenkumarsnk333@gmail.com',
      to: email,
      subject: 'Student Marks Details',
      text: emailContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send({ message: 'Error sending email', error: error.message });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).send({ message: 'Email sent successfully' });
      }
    });
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving students from database', error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
