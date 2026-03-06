
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Alert, Row, Col, Card } from 'react-bootstrap';
import { getCollection, addToCollection, updateInCollection } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

const TeacherAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({}); // { studentId: 'present' | 'absent' }
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
      loadStudentsAndAttendance();
    }
  }, [selectedClass, attendanceDate]);

  const loadStudentsAndAttendance = async () => {
    const allStudents = await getCollection('students');
    const filteredStudents = allStudents.filter(s => s.classIdx === selectedClass);
    setStudents(filteredStudents);

    // Load existing attendance if any
    const allAttendance = await getCollection('attendance');
    const record = allAttendance.find(a => a.date === attendanceDate && a.classIdx === selectedClass);
    
    if (record) {
      setAttendanceData(record.records);
    } else {
      const initialStatus = {};
      filteredStudents.forEach(s => initialStatus[s.id] = 'present');
      setAttendanceData(initialStatus);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    const allAttendance = await getCollection('attendance');
    const index = allAttendance.findIndex(a => a.date === attendanceDate && a.classIdx === selectedClass);
    const existingRecord = allAttendance[index];

    const newRecord = {
        date: attendanceDate,
        classIdx: selectedClass,
        records: attendanceData
    };

    if (existingRecord) {
        await updateInCollection('attendance', existingRecord.id, newRecord);
    } else {
        await addToCollection('attendance', { ...newRecord, id: uuidv4() });
    }
    
    setMessage('Attendance saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Mark Attendance</h2>
      
      {message && <Alert variant="success">{message}</Alert>}

      <Card className="p-4 mb-4 glass-card">
          <Row>
              <Col md={4}>
                  <Form.Group className="mb-3">
                      <Form.Label>Select Class</Form.Label>
                      <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                          <option value="">-- Select Class --</option>
                          {classes.map(c => {
                             const name = typeof c === 'string' ? c : c.name;
                             return <option key={name} value={name}>{name}</option> 
                          })}
                      </Form.Select>
                  </Form.Group>
              </Col>
               <Col md={4}>
                  <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
                  </Form.Group>
              </Col>
          </Row>
      </Card>

      {selectedClass && students.length > 0 && (
          <div className="glass-card p-0 overflow-hidden">
             <Table hover responsive className="mb-0">
                 <thead className="bg-light">
                     <tr>
                         <th>Roll No</th>
                         <th>Name</th>
                         <th>Status</th>
                     </tr>
                 </thead>
                 <tbody>
                     {students.map(student => (
                         <tr key={student.id}>
                             <td>{student.rollNo}</td>
                             <td>{student.name}</td>
                             <td>
                                 <Form.Check 
                                     inline 
                                     type="radio" 
                                     label="Present" 
                                     name={`attendance-${student.id}`} 
                                     checked={attendanceData[student.id] === 'present'} 
                                     onChange={() => handleStatusChange(student.id, 'present')}
                                     className="me-3"
                                 />
                                 <Form.Check 
                                     inline 
                                     type="radio" 
                                     label="Absent" 
                                     name={`attendance-${student.id}`} 
                                     checked={attendanceData[student.id] === 'absent'} 
                                     onChange={() => handleStatusChange(student.id, 'absent')}
                                     className="text-danger"
                                 />
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </Table>
             <div className="p-3 bg-white border-top">
                 <Button variant="primary" onClick={saveAttendance}>Save Attendance</Button>
             </div>
          </div>
      )}
      
      {selectedClass && students.length === 0 && (
          <Alert variant="warning">No students found in this class.</Alert>
      )}

    </Container>
  );
};

export default TeacherAttendance;
