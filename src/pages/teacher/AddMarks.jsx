
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Alert, Row, Col, Card } from 'react-bootstrap';
import { getCollection, addToCollection, updateInCollection } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

const AddMarks = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState(['Math', 'Science', 'English', 'History']); 
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examType, setExamType] = useState('Midterm');
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({}); // { studentId: mark }
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const classesData = await getCollection('classes');
    setClasses(classesData || []);
  };

  useEffect(() => {
    if (selectedClass) {
       loadStudentsAndMarks();
    }
  }, [selectedClass, selectedSubject, examType]);

  const loadStudentsAndMarks = async () => {
      const allStudents = await getCollection('students');
      const filtered = allStudents.filter(s => s.classIdx === selectedClass);
      setStudents(filtered);
      
      const allMarks = await getCollection('marks');
      const record = allMarks.find(m => m.classIdx === selectedClass && m.subject === selectedSubject && m.examType === examType);
      
      if (record) {
          setMarksData(record.records);
      } else {
          setMarksData({});
      }
  };

  const handleMarkChange = (studentId, value) => {
    setMarksData(prev => ({ ...prev, [studentId]: value }));
  };

  const saveMarks = async () => {
    const allMarks = await getCollection('marks');
    const index = allMarks.findIndex(m => m.classIdx === selectedClass && m.subject === selectedSubject && m.examType === examType);
    const existingRecord = allMarks[index];

    const newRecord = {
        classIdx: selectedClass,
        subject: selectedSubject,
        examType: examType,
        records: marksData
    };

    if (existingRecord) {
        await updateInCollection('marks', existingRecord.id, newRecord);
    } else {
        await addToCollection('marks', { ...newRecord, id: uuidv4() });
    }
    
    setMessage('Marks saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Add Marks</h2>
      
      {message && <Alert variant="success">{message}</Alert>}

      <Card className="p-4 mb-4 glass-card">
          <Row>
              <Col md={3}>
                  <Form.Group className="mb-3">
                      <Form.Label>Class</Form.Label>
                      <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                          <option value="">Select Class</option>
                          {classes.map(c => {
                             const name = typeof c === 'string' ? c : c.name;
                             return <option key={name} value={name}>{name}</option> 
                          })}
                      </Form.Select>
                  </Form.Group>
              </Col>
              <Col md={3}>
                  <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                          <option value="">Select Subject</option>
                          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </Form.Select>
                  </Form.Group>
              </Col>
               <Col md={3}>
                  <Form.Group className="mb-3">
                      <Form.Label>Exam Type</Form.Label>
                      <Form.Select value={examType} onChange={(e) => setExamType(e.target.value)}>
                          <option value="Midterm">Midterm</option>
                          <option value="Final">Final</option>
                          <option value="Quiz">Quiz</option>
                      </Form.Select>
                  </Form.Group>
              </Col>
          </Row>
      </Card>

      {selectedClass && selectedSubject && students.length > 0 && (
          <div className="glass-card p-0 overflow-hidden">
             <Table hover responsive className="mb-0">
                 <thead className="bg-light">
                     <tr>
                         <th>Roll No</th>
                         <th>Name</th>
                         <th>Marks Obtained</th>
                         <th>Max Marks</th>
                     </tr>
                 </thead>
                 <tbody>
                     {students.map(student => (
                         <tr key={student.id}>
                             <td>{student.rollNo}</td>
                             <td>{student.name}</td>
                             <td>
                                 <Form.Control 
                                     type="number" 
                                     placeholder="Enter Marks" 
                                     style={{ width: '150px' }}
                                     value={marksData[student.id] || ''}
                                     onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                 />
                             </td>
                             <td>100</td>
                         </tr>
                     ))}
                 </tbody>
             </Table>
             <div className="p-3 bg-white border-top text-end">
                 <Button variant="primary" onClick={saveMarks}>Save Marks</Button>
             </div>
          </div>
      )}
    </Container>
  );
};

export default AddMarks;
