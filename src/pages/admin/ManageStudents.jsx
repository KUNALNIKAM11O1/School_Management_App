
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col, Alert } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getCollection, addToCollection, updateInCollection, deleteFromCollection } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    usergmail: '',
    password: 'password',
    rollNo: '',
    classIdx: '',
    address: '',
    phone: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const data = await getCollection('students');
    setStudents(data);
  };

  const handleShow = (student = null) => {
    if (student) {
      setCurrentStudent(student);
      setFormData(student);
    } else {
      setCurrentStudent(null);
      setFormData({ name: '', rollNo: '', classIdx: '', address: '', phone: '' });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStudent) {
      await updateInCollection('students', currentStudent.id, formData);
    } else {
      // Auto-generate ID or let server do it. json-server strings ids usually.
      // We will provide ID to be safe and consistent
      const newStudent = { ...formData, id: uuidv4() };
      await addToCollection('students', newStudent);
      // No separate users collection anymore
    }
    fetchStudents();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteFromCollection('students', id);
      fetchStudents();
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Students</h2>
        <Button onClick={() => handleShow()} variant="primary">
          <FaPlus className="me-2" /> Add Student
        </Button>
      </div>

      <div className="mb-4">
         <Row>
             <Col md={4}>
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted"/></span>
                    <Form.Control 
                        type="text" 
                        placeholder="Search by name or roll no..." 
                        className="border-start-0 ps-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             </Col>
         </Row>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <Table hover responsive className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.classIdx}</td>
                    <td>{student.phone}</td>
                    <td>{student.address}</td>
                    <td>
                    <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShow(student)}>
                        <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(student.id)}>
                        <FaTrash />
                    </Button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No students found.</td>
                </tr>
            )}
            
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentStudent ? 'Edit Student' : 'Add Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Roll Number</Form.Label>
              <Form.Control type="text" name="rollNo" value={formData.rollNo} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Class</Form.Label>
              <Form.Select name="classIdx" value={formData.classIdx} onChange={handleChange} required>
                  <option value="">Select Class</option>
                  <option value="10-A">10-A</option>
                  <option value="10-B">10-B</option>
                  <option value="11-A">11-A</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>User Gmail (Login ID)</Form.Label>
              <Form.Control type="email" name="usergmail" value={formData.usergmail} onChange={handleChange} required placeholder="student@gmail.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>
             <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control as="textarea" rows={3} name="address" value={formData.address} onChange={handleChange} required />
            </Form.Group>
            <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
                <Button variant="primary" type="submit">{currentStudent ? 'Update' : 'Add'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageStudents;
