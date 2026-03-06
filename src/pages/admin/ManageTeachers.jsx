
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getCollection, addToCollection, updateInCollection, deleteFromCollection } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    usergmail: '',
    password: 'password',
    subject: '',
    phone: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const data = await getCollection('teachers');
    setTeachers(data);
  };

  const handleShow = (teacher = null) => {
    if (teacher) {
      setCurrentTeacher(teacher);
      setFormData(teacher);
    } else {
      setCurrentTeacher(null);
      setFormData({ name: '', subject: '', phone: '' });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentTeacher) {
      await updateInCollection('teachers', currentTeacher.id, formData);
    } else {
      const newTeacher = { ...formData, id: uuidv4() };
      await addToCollection('teachers', newTeacher);
      // No separate users collection
    }
    fetchTeachers();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      await deleteFromCollection('teachers', id);
      fetchTeachers();
    }
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Teachers</h2>
        <Button onClick={() => handleShow()} variant="primary">
          <FaPlus className="me-2" /> Add Teacher
        </Button>
      </div>

       <div className="mb-4">
         <Row>
             <Col md={4}>
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted"/></span>
                    <Form.Control 
                        type="text" 
                        placeholder="Search by name or subject..." 
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
              <th>Subject</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
             {filteredTeachers.length > 0 ? (
                filteredTeachers.map(teacher => (
                <tr key={teacher.id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.phone}</td>
                    <td>
                    <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShow(teacher)}>
                        <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(teacher.id)}>
                        <FaTrash />
                    </Button>
                    </td>
                </tr>
                ))
             ) : (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No teachers found.</td>
                </tr>
             )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentTeacher ? 'Edit Teacher' : 'Add Teacher'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
               <Form.Select name="subject" value={formData.subject} onChange={handleChange} required>
                  <option value="">Select Subject</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                   <option value="History">History</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>User Gmail (Login ID)</Form.Label>
              <Form.Control type="email" name="usergmail" value={formData.usergmail} onChange={handleChange} required placeholder="teacher@gmail.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>
            <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
                <Button variant="primary" type="submit">{currentTeacher ? 'Update' : 'Add'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageTeachers;
