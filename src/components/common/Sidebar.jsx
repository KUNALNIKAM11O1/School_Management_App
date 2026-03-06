
import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, FaUserGraduate, FaChalkboardTeacher, FaBook, 
  FaMoneyBillWave, FaClipboardList, FaBullhorn, FaFileAlt, FaCalendarAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="sidebar d-flex flex-column p-3">
      <h4 className="text-center mb-4 fw-bold text-primary">SMS Portal</h4>
      <Nav className="flex-column">
        
        {/* Admin Links */}
        {role === 'admin' && (
          <>
            <Nav.Link as={NavLink} to="/admin/dashboard" className="mb-2">
              <FaHome className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/students" className="mb-2">
              <FaUserGraduate className="me-2" /> Students
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/teachers" className="mb-2">
              <FaChalkboardTeacher className="me-2" /> Teachers
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/classes" className="mb-2">
              <FaBook className="me-2" /> Classes
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/fees" className="mb-2">
              <FaMoneyBillWave className="me-2" /> Fees
            </Nav.Link>
             <Nav.Link as={NavLink} to="/admin/reports" className="mb-2">
              <FaFileAlt className="me-2" /> Reports
            </Nav.Link>
             <Nav.Link as={NavLink} to="/admin/announcements" className="mb-2">
              <FaBullhorn className="me-2" /> Announcements
            </Nav.Link>
          </>
        )}

        {/* Teacher Links */}
        {role === 'teacher' && (
          <>
            <Nav.Link as={NavLink} to="/teacher/dashboard" className="mb-2">
              <FaHome className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/teacher/students" className="mb-2">
              <FaUserGraduate className="me-2" /> Students
            </Nav.Link>
            <Nav.Link as={NavLink} to="/teacher/attendance" className="mb-2">
              <FaClipboardList className="me-2" /> Attendance
            </Nav.Link>
             <Nav.Link as={NavLink} to="/teacher/marks" className="mb-2">
              <FaFileAlt className="me-2" /> Marks
            </Nav.Link>
             <Nav.Link as={NavLink} to="/teacher/assignments" className="mb-2">
              <FaBook className="me-2" /> Assignments
            </Nav.Link>
          </>
        )}

        {/* Student Links */}
        {role === 'student' && (
          <>
            <Nav.Link as={NavLink} to="/student/dashboard" className="mb-2">
              <FaHome className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/student/attendance" className="mb-2">
              <FaClipboardList className="me-2" /> Attendance
            </Nav.Link>
            <Nav.Link as={NavLink} to="/student/marks" className="mb-2">
              <FaFileAlt className="me-2" /> Marks
            </Nav.Link>
             <Nav.Link as={NavLink} to="/student/timetable" className="mb-2">
              <FaCalendarAlt className="me-2" /> Timetable
            </Nav.Link>
             <Nav.Link as={NavLink} to="/student/fees" className="mb-2">
              <FaMoneyBillWave className="me-2" /> Fees
            </Nav.Link>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
