
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Relative path check needed if moved? It is in src/context
import Login from './pages/auth/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageTeachers from './pages/admin/ManageTeachers';
import ManageClasses from './pages/admin/ManageClasses';
import ManageFees from './pages/admin/ManageFees';
import AdminReports from './pages/admin/AdminReports';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import AddMarks from './pages/teacher/AddMarks';
import StudentDashboard from './pages/student/StudentDashboard';
import ViewMarks from './pages/student/ViewMarks';
import ComingSoon from './components/common/ComingSoon';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
             <Route element={<MainLayout />}>
                
                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                   <Route path="/admin/dashboard" element={<AdminDashboard />} />
                   <Route path="/admin/students" element={<ManageStudents />} />
                   <Route path="/admin/teachers" element={<ManageTeachers />} />
                   <Route path="/admin/classes" element={<ManageClasses />} />
                   <Route path="/admin/fees" element={<ManageFees />} />
                   <Route path="/admin/reports" element={<AdminReports />} />
                   <Route path="/admin/announcements" element={<ComingSoon title="Announcements Management" />} />
                </Route>

                {/* Teacher Routes */}
                <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                   <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                   <Route path="/teacher/students" element={<ComingSoon title="My Students List" />} />
                   <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                   <Route path="/teacher/marks" element={<AddMarks />} />
                   <Route path="/teacher/assignments" element={<ComingSoon title="Assignments Managment" />} />
                </Route>

                {/* Student Routes */}
                 <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                   <Route path="/student/dashboard" element={<StudentDashboard />} />
                   <Route path="/student/attendance" element={<ComingSoon title="My Attendance History" />} />
                   <Route path="/student/marks" element={<ViewMarks />} />
                   <Route path="/student/timetable" element={<ComingSoon title="Class Timetable" />} />
                   <Route path="/student/fees" element={<ComingSoon title="My Fees Status" />} />
                </Route>

             </Route>
          </Route>
          
          {/* Fallback for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;