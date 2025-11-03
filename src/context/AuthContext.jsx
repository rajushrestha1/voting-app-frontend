import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
// import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // split student/admin states to match ProtectedRoute expectations
  const [student, setStudent] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  /** ------------------------
   *  FACE LOGIN
   *  ------------------------ */
  const faceLogin = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(
        `${API_URL}/auth/face-student-login`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      console.log('Face login response:', response.data);

      if (!response.data.matched) {
        throw new Error('Face not recognized');
      }

      // Map backend user to frontend user state
      const loggedInUser = {
        userId: response.data.user?._id,
        name: response.data.user?.name || 'Unknown'
      };

      // For face-only login treat as generic user
      setUser(loggedInUser);
      return loggedInUser;

    } catch (error) {
      console.error('Face login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid server response');
    }
  };

  /** ------------------------
   *  FACE + STUDENT LOGIN
   *  ------------------------ */
  const faceStudentLogin = async (studentId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('studentId', studentId);
      formData.append('image', imageFile);

      const response = await axios.post(
        `${API_URL}/auth/face-student-login`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      console.log('Face+Student login response:', response.data);

      if (!response.data.matched) {
        throw new Error('Face did not match');
      }

      const loggedInStudent = {
        studentId: response.data.studentId,
        name: response.data.name,
        votedFor: response.data.votedFor || {},
        hasVoted: !!response.data.hasVoted,
      };

      // set both generic user and student for compatibility
      setUser({ studentId: loggedInStudent.studentId, name: loggedInStudent.name });
      setStudent(loggedInStudent);
      return loggedInStudent;

    } catch (error) {
      console.error('Face+Student login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid server response');
    }
  };

  /** ------------------------
   *  STUDENT LOGIN
   *  ------------------------ */
  const studentLogin = async (studentId) => {
    try {
      const response = await axios.post(
        // backend auth route is exposed at /auth/login
        `${API_URL}/auth/login`,
        { studentId },
        { withCredentials: true }
      );

      console.log('Student login response:', response.data);

      const loggedInStudent = {
        studentId: response.data.studentId,
        name: response.data.name,
        votedFor: response.data.votedFor || {},
        hasVoted: !!response.data.hasVoted,
      };
      setUser(loggedInStudent);
      setStudent(loggedInStudent);
      return response.data;
    } catch (error) {
      console.error('Student login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid server response');
    }
  };

  // NEW: admin login
  const loginAdmin = async (credentials) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/login`,
        credentials,
        { withCredentials: true }
      );
      // minimal admin state; expand if backend returns admin info
      setAdmin({ username: credentials.username });
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid server response');
    }
  };
  // NEW: admin logout
  const logoutAdmin = async () => {
    try {
      await axios.post(`${API_URL}/admin/logout`, {}, { withCredentials: true });
      setAdmin(null);
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };
  // FIXED: student logout (use correct backend route)
  const logoutStudent = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setStudent(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  /** ------------------------
   *  LOGOUT
   *  ------------------------ */
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/student/logout`, {}, { withCredentials: true });
      setUser(null);
      setStudent(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        student,
        setStudent,
        admin,
        setAdmin,
        loading,
        setLoading,
        faceLogin,
        faceStudentLogin,
        studentLogin,
        loginAdmin,       // <-- exported
        logoutAdmin,      // <-- exported
        logoutStudent,    // <-- exported
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};