
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getCollection } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    fees: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch real data
    const students = await getCollection('students');
    const teachers = await getCollection('teachers');
    const classes = await getCollection('classes');
    
    setStats({
      students: students.length,
      teachers: teachers.length,
      classes: classes.length,
      fees: 50000 // Dummy value for fees as per request requirements for now
    });

    // Prepare chart data: Students per Class
    // Assuming classes are objects {id, name...} or strings.
    // We need to match student.classIdx to class names.
    
    // Normalize class names
    const classMap = {};
    classes.forEach(c => {
        const name = typeof c === 'string' ? c : c.name;
        classMap[name] = 0; 
    });

    // Count students
    students.forEach(s => {
        if (classMap[s.classIdx] !== undefined) {
            classMap[s.classIdx]++;
        } else {
             // Handle students with unknown class or init
             if (!classMap[s.classIdx]) classMap[s.classIdx] = 0;
             classMap[s.classIdx]++;
        }
    });

    const data = Object.keys(classMap).map(cls => ({
        name: cls,
        count: classMap[cls]
    }));

    setChartData(data);
  };

  return (
    <Container fluid>
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="text-center shadow-sm p-3 glass-card">
             <h4>Total Students</h4>
             <p className="display-4 fw-bold text-primary">{stats.students}</p>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center shadow-sm p-3 glass-card">
             <h4>Total Teachers</h4>
             <p className="display-4 fw-bold text-success">{stats.teachers}</p>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center shadow-sm p-3 glass-card">
             <h4>Total Classes</h4>
             <p className="display-4 fw-bold text-info">{stats.classes}</p>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center shadow-sm p-3 glass-card">
             <h4>Total Fees</h4>
             <p className="display-4 fw-bold text-warning">${stats.fees}</p>
          </Card>
        </Col>
      </Row>

      <Row>
          <Col md={8}>
              <Card className="shadow-sm p-4 glass-card">
                  <h4 className="mb-4">Student Distribution per Class</h4>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" name="Students" />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
              </Card>
          </Col>
          <Col md={4}>
              <Card className="shadow-sm p-4 glass-card">
                  <h4 className="mb-4">Quick Stats</h4>
                  <ul>
                      <li>New Admissions today: 0</li>
                      <li>Absent Teachers: 0</li>
                      <li>Pending Complaints: 0</li>
                  </ul>
              </Card>
          </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
