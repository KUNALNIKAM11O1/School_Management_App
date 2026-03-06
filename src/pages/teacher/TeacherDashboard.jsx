
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getCollection } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myClasses: 0,
    totalStudents: 0
  });

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const classes = await getCollection('classes');
    const students = await getCollection('students');
    
    // Filter classes where this teacher is assigned
    // Assuming user.id matches teacher.id or we match by check
    // In our seed, teacher id is 'teacher-1', user id is 'teacher-1'
    
    // In a real app we'd query API with filter, here we filter client side for mock
    const myClasses = classes.filter(c => c.teacherId === user.id);
    
    // Count students in my classes
    let studentCount = 0;
    myClasses.forEach(c => {
        const clsName = typeof c === 'string' ? c : c.name;
        const classStudents = students.filter(s => s.classIdx === clsName);
        studentCount += classStudents.length;
    });

    setStats({
      myClasses: myClasses.length,
      totalStudents: studentCount
    });
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Teacher Dashboard</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card className="text-center shadow-sm p-3 glass-card">
             <h4>My Classes</h4>
             <p className="display-4 fw-bold text-primary">{stats.myClasses}</p>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="text-center shadow-sm p-3 glass-card">
             <h4>Total Students</h4>
             <p className="display-4 fw-bold text-success">{stats.totalStudents}</p>
          </Card>
        </Col>
      </Row>
      
      <Row>
          <Col md={12}>
              <Card className="shadow-sm p-4 glass-card">
                  <h4>Welcome, {user?.name}</h4>
                  <p>Manage your classes, participation, and marks from the sidebar menu.</p>
              </Card>
          </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
