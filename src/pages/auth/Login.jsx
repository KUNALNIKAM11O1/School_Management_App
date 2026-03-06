
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';

const Login = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    usergmail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!formData.usergmail || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(formData.usergmail, formData.password, role);
    if (result.success) {
      // Navigate based on role
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Card className="p-4 shadow-lg glass-card" style={{ width: '400px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted">Login to your account</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Role Selection */}
        <div className="d-flex justify-content-between mb-4">
          <Button 
            variant={role === 'admin' ? 'primary' : 'outline-primary'} 
            className="flex-fill me-1"
            onClick={() => setRole('admin')}
          >
            <FaUserShield /> Admin
          </Button>
          <Button 
            variant={role === 'teacher' ? 'primary' : 'outline-primary'} 
            className="flex-fill mx-1"
            onClick={() => setRole('teacher')}
          >
            <FaChalkboardTeacher /> Teacher
          </Button>
          <Button 
            variant={role === 'student' ? 'primary' : 'outline-primary'} 
            className="flex-fill ms-1"
            onClick={() => setRole('student')}
          >
            <FaUserGraduate /> Student
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email (User Gmail)</Form.Label>
            <Form.Control 
              type="email" 
              name="usergmail" 
              placeholder="Enter your gmail" 
              value={formData.usergmail} 
              onChange={handleChange} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              name="password" 
              placeholder="Enter password" 
              value={formData.password} 
              onChange={handleChange} 
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 py-2 fw-bold shadow-sm">
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
