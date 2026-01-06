import React, { useState } from 'react';
import { faceRegister } from '../api/api';

export default function Register() {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState(''); 
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files).slice(0, 4)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMsg('Please enter your name');
      return;
    }
    if (files.length === 0) {
      setMsg('Please upload at least one face image');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      if (studentId.trim()) formData.append('studentId', studentId.trim()); 

      
      files.forEach((file) => formData.append('images', file));

      const { data } = await faceRegister(formData);

      setMsg(data?.message || 'Registered successfully');
      setName('');
      setStudentId(''); 
      setFiles([]);
    } catch (err) {
      console.error('Registration failed:', err?.response?.data?.message || err.message);
      setMsg(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center">Register Your Face</h1>
        <p className="text-center text-gray-600 text-sm">
          Enter your name, student ID and upload clear, front-facing face image(s)
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="studentId"
            placeholder="Student ID (optional, provide to enable face+student login)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="border rounded px-3 py-2"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {msg && <p className="text-center text-green-500 mt-2">{msg}</p>}
      </div>
    </div>
  );
}
