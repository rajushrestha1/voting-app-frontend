import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});


export const studentLogin = (studentId) =>
  API.post('/auth/login', { studentId });

export const studentLogout = () =>
  API.post('/auth/logout');

export const castVote = (voteData) =>
  API.post('/vote', voteData);

export const castBulkVote = (candidateIds) =>
  API.post('/vote/bulk', { candidateIds });


export const adminLogin = (credentials) =>
  API.post('/admin/login', credentials);

export const adminLogout = () =>
  API.post('/admin/logout');

export const addCandidate = (candidateData) =>
  API.post('/admin/candidates', candidateData);

export const removeCandidate = (id) =>
  API.delete(`/admin/candidates/${id}`);

export const getCandidates = () =>
  API.get('/admin/candidates');

export const getResults = () =>
  API.get('/admin/results');


export const getPublicCandidates = () =>
  API.get('/public/candidates');


export const faceRegister = (formData) =>
  API.post('/auth/face/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });


export const faceLogin = (formData) =>
  API.post('/auth/face/login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });


export const faceStudentLogin = (studentId, imageFile) => {
  const formData = new FormData();
  formData.append('studentId', studentId);
  formData.append('image', imageFile);

  return API.post('/auth/face-student-login', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getCurrentUser = () =>
  API.get('/me');

export const getCurrentStudent = () =>
  API.get('/auth/me-student');

export default API;
