
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getCollection } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminReports = () => {
  const [feesData, setFeesData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const fees = await getCollection('fees');
    const attendance = await getCollection('attendance');
    
    // Fees Status
    let paid = 0;
    let pending = 0;
    (fees || []).forEach(f => {
        if (f.status === 'Paid') paid++;
        else pending++;
    });
    setFeesData([
        { name: 'Paid', value: paid },
        { name: 'Pending', value: pending }
    ]);

    // Attendance Overview (Mock for now, or aggregate records)
    // Aggregation: Count total 'present' vs 'absent' across all records
    let totalPresent = 0;
    let totalAbsent = 0;
    (attendance || []).forEach(record => {
        const statuses = Object.values(record.records || {});
        totalPresent += statuses.filter(s => s === 'present').length;
        totalAbsent += statuses.filter(s => s === 'absent').length;
    });

    setAttendanceData([
        { name: 'Present', value: totalPresent },
        { name: 'Absent', value: totalAbsent }
    ]);

  };

  const COLORS = ['#0088FE', '#FF8042'];
  const COLORS_ATTENDANCE = ['#00C49F', '#FFBB28'];

  return (
    <Container fluid>
      <h2 className="mb-4">Reports & Analytics</h2>
      
      <Row>
          <Col md={6} className="mb-4">
              <Card className="shadow-sm p-4 glass-card h-100">
                  <h4 className="mb-4 text-center">Fees Collection Status</h4>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={feesData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {feesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
              </Card>
          </Col>

          <Col md={6} className="mb-4">
              <Card className="shadow-sm p-4 glass-card h-100">
                  <h4 className="mb-4 text-center">Overall Attendance</h4>
                   <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                         <PieChart>
                            <Pie
                                data={attendanceData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {attendanceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_ATTENDANCE[index % COLORS_ATTENDANCE.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
              </Card>
          </Col>
      </Row>
    </Container>
  );
};

export default AdminReports;
