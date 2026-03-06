
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getCollection } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendance: '0%',
    avgMarks: '0%'
  });

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const attendance = await getCollection('attendance');
    const marks = await getCollection('marks');
    
    // Calculate Attendance %
    let totalDays = 0;
    let presentDays = 0;
    
    attendance.forEach(record => {
        if (record.records && record.records[user.id]) {
            totalDays++;
            if (record.records[user.id] === 'present') {
                presentDays++;
            }
        }
    });
    
    const attendancePct = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

    // Calculate Average Marks
    let totalMarks = 0;
    let marksCount = 0;
    
    marks.forEach(exam => {
        if (exam.records && exam.records[user.id]) {
            marksCount++;
            totalMarks += parseInt(exam.records[user.id] || 0);
        }
    });

    const avgMarks = marksCount > 0 ? (totalMarks / marksCount).toFixed(1) : 0;

    setStats({
        attendance: `${attendancePct}%`,
        avgMarks: `${avgMarks}%`
    });
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Student Dashboard</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card className="text-center shadow-sm p-3 glass-card">
             <h4>My Attendance</h4>
             <p className="display-4 fw-bold text-primary">{stats.attendance}</p>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="text-center shadow-sm p-3 glass-card">
             <h4>Average Score</h4>
             <p className="display-4 fw-bold text-success">{stats.avgMarks}</p>
          </Card>
        </Col>
      </Row>
      
       <Row>
          <Col md={12}>
              <Card className="shadow-sm p-4 glass-card">
                  <h4>Welcome, {user?.name}</h4>
                  <p>Check your latest result and daily attendance status.</p>
              </Card>
          </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
