
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaTools } from 'react-icons/fa';

const ComingSoon = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Card className="text-center p-5 shadow-lg glass-card" style={{ maxWidth: '500px' }}>
        <div className="mb-4 text-warning">
          <FaTools size={50} />
        </div>
        <h2 className="mb-3">{title || 'Feature Coming Soon'}</h2>
        <p className="text-muted mb-4">
          This module is currently under development. Please check back later!
        </p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Card>
    </Container>
  );
};

export default ComingSoon;
