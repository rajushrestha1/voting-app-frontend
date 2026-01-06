import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  
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

      const loggedInUser = {
        userId: response.data.user?._id,
        name: response.data.user?.name || 'Unknown'
      };

      setUser(loggedInUser);
      return loggedInUser;

    } catch (error) {
      console.error('Face login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid server response');
    }
  };

  
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

      setUser({ studentId: loggedInStudent.studentId, name: loggedInStudent.name });
      setStudent(loggedInStudent);
      return loggedInStudent;

    } catch (error) {
      console.error('Face+Student login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid server response');
    }
  };

  
  const studentLogin = async (studentId) => {
    try {
      const response = await axios.post(
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

  const loginAdmin = async (credentials) => {
    try {
      const response = await axios.post(
        `${API_URL}/admin/login`,
        credentials,
        { withCredentials: true }
      );
      setAdmin({ username: credentials.username });
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error(error.response?.data?.message || 'Invalid server response');
    }
  };
  const logoutAdmin = async () => {
    try {
      await axios.post(`${API_URL}/admin/logout`, {}, { withCredentials: true });
      setAdmin(null);
    } catch (error) {
      console.error('Admin logout error:', error);
    }
  };
  const logoutStudent = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setStudent(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  
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
        loginAdmin,       
        logoutAdmin,      
        logoutStudent,    
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};