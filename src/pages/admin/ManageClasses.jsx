
import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getCollection, addToCollection, updateInCollection, deleteFromCollection } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    teacherId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const classesData = await getCollection('classes');
    const teachersData = await getCollection('teachers');
    setClasses(classesData || []);
    setTeachers(teachersData || []);
  };

  const handleShow = (cls = null) => {
    if (cls) {
      setCurrentClass(cls);
      setFormData(cls);
    } else {
      setCurrentClass(null);
      setFormData({ name: '', teacherId: '' });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In db.json we structure classes as objects.
    if (currentClass) {
       await updateInCollection('classes', currentClass.id, formData);
    } else {
       await addToCollection('classes', { ...formData, id: uuidv4() });
    }

    fetchData();
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
       await deleteFromCollection('classes', id);
       fetchData();
    }
  };
  
  const getTeacherName = (id) => {
      const t = teachers.find(teacher => teacher.id === id);
      return t ? t.name : 'Unknown/Unassigned';
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Classes</h2>
        <Button onClick={() => handleShow()} variant="primary">
          <FaPlus className="me-2" /> Add Class
        </Button>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <Table hover responsive className="mb-0">
          <thead className="bg-light">
            <tr>
              <th>Class Name</th>
              <th>Class Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.length > 0 ? (
                classes.map(cls => (
                <tr key={cls.id}>
                    <td>{cls.name}</td>
                    <td>{cls.teacherId ? getTeacherName(cls.teacherId) : <span className="text-muted">Unassigned</span>}</td>
                    <td>
                    <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShow(cls)}>
                        <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cls.id)}>
                        <FaTrash />
                    </Button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">No classes found.</td>
                </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentClass ? 'Edit Class' : 'Add Class'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Class Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. 10-A" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Class Teacher</Form.Label>
              <Form.Select name="teacherId" value={formData.teacherId} onChange={handleChange}>
                  <option value="">Select Teacher</option>
                  {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleClose} className="me-2">Cancel</Button>
                <Button variant="primary" type="submit">{currentClass ? 'Update' : 'Add'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageClasses;
