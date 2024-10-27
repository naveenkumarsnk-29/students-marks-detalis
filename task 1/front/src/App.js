import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [studentData, setStudentData] = useState({
    name: '',
    age: '',
    email: '',
    rollNo: '',
    mathMarks: '',
    computerMarks: '',
    chemistryMarks: ''
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prevState => ({
      ...prevState,
      [name]: name.includes('Marks') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    try {
      //const studentResponse = await axios.post('http://localhost:5000/add-student', studentData);
      //console.log('Student data saved:', studentResponse.data);

      const emailResponse = await axios.post('http://localhost:5000/send-email', { email: studentData.email });
      console.log('Email sent response:', emailResponse.data);

      setResponseMessage('Student registered and email sent successfully!');
      
   
      setStudentData({
        name: '',
        age: '',
        email: '',
        rollNo: '',
        marks:{
        mathMarks: '',
        computerMarks: '',
        chemistryMarks: ''
        }
      });
    } catch (error) {
      console.error('There was an error!', error);
      setResponseMessage('Error registering the student or sending email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Student Registration</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={studentData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={studentData.age}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={studentData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="rollNo"
          placeholder="Roll No"
          value={studentData.rollNo}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="mathMarks"
          placeholder="Math Marks"
          value={studentData.mathMarks}
          onChange={handleChange}
          required
          min="0" max="100"
        />
        <input
          type="number"
          name="computerMarks"
          placeholder="Computer Marks"
          value={studentData.computerMarks}
          onChange={handleChange}
          required
          min="0" max="100"
        />
        <input
          type="number"
          name="chemistryMarks"
          placeholder="Chemistry Marks"
          value={studentData.chemistryMarks}
          onChange={handleChange}
          required
          min="0" max="100"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default App;