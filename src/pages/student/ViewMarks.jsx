
import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Card, Row, Col } from 'react-bootstrap';
import { getCollection } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ViewMarks = () => {
  const { user } = useAuth();
  const [marksList, setMarksList] = useState([]);
  
  useEffect(() => {
    if (user) {
        fetchMarks();
    }
  }, [user]);

  const fetchMarks = async () => {
      const allMarks = await getCollection('marks');
      
      const myMarks = [];
      allMarks.forEach(exam => {
          if (exam.records && exam.records[user.id]) {
              myMarks.push({
                  subject: exam.subject,
                  examType: exam.examType,
                  score: exam.records[user.id],
                  total: 100
              });
          }
      });
      
      setMarksList(myMarks);
  };

  return (
    <Container fluid>
      <h2 className="mb-4">My Marks</h2>
      
      {marksList.length > 0 ? (
          <div className="glass-card p-0 overflow-hidden">
             <Table hover responsive className="mb-0">
                 <thead className="bg-light">
                     <tr>
                         <th>Subject</th>
                         <th>Exam Type</th>
                         <th>Score</th>
                         <th>Total</th>
                         <th>Percentage</th>
                     </tr>
                 </thead>
                 <tbody>
                     {marksList.map((mark, index) => (
                         <tr key={index}>
                             <td>{mark.subject}</td>
                             <td>{mark.examType}</td>
                             <td className="fw-bold">{mark.score}</td>
                             <td>{mark.total}</td>
                             <td>{((mark.score / mark.total) * 100).toFixed(1)}%</td>
                         </tr>
                     ))}
                 </tbody>
             </Table>
          </div>
      ) : (
          <Alert variant="info">No marks found for you yet.</Alert>
      )}
    </Container>
  );
};

export default ViewMarks;
