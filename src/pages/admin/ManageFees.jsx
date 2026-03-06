
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col, Badge } from 'react-bootstrap';
import { getCollection, addToCollection, updateInCollection, deleteFromCollection } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

const ManageFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const feesData = await getCollection('fees');
    const studentsData = await getCollection('students');
    setFees(feesData || []);
    setStudents(studentsData || []);
  };

  const handleShow = () => {
    setFormData({ studentId: '', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFee = { ...formData, id: uuidv4() };
    await addToCollection('fees', newFee);
    fetchData();
    handleClose();
  };

  const handleStatusToggle = async (fee) => {
      const newStatus = fee.status === 'Paid' ? 'Pending' : 'Paid';
      await updateInCollection('fees', fee.id, { ...fee, status: newStatus });
      fetchData();
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await deleteFromCollection('fees', id);
      fetchData();
    }
  };

  const getStudentName = (id) => {
      const s = students.find(stud => stud.id === id);
      return s ? s.name : 'Unknown Student';
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Fees Management</h2>
        <Button onClick={handleShow} variant="primary">Add Fee Record</Button>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <Table hover responsive className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Student Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.length > 0 ? (
                fees.map(fee => (
                <tr key={fee.id}>
                    <td>{getStudentName(fee.studentId)}</td>
                    <td>${fee.amount}</td>
                    <td>{fee.date}</td>
                    <td>
                        <Badge bg={fee.status === 'Paid' ? 'success' : 'danger'} style={{ cursor: 'pointer' }} onClick={() => handleStatusToggle(fee)}>
                            {fee.status}
                        </Badge>
                    </td>
                    <td>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(fee.id)}>Delete</Button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No fee records found.</td>
                </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Fee Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Student</Form.Label>
              <Form.Select name="studentId" value={formData.studentId} onChange={handleChange} required>
                  <option value="">Select Student</option>
                  {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount ($)</Form.Label>
              <Form.Control type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
              </Form.Select>
            </Form.Group>
             <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
            </Form.Group>
            <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
                <Button variant="primary" type="submit">Add Record</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageFees;
