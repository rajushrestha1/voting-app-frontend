import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import WebcamCapture from '../webcam/WebcamCapture.jsx';

const LoginForm = () => {
  const [studentId, setStudentId] = useState('');
  const [faceImage, setFaceImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [faceMatched, setFaceMatched] = useState(null);
  const { faceStudentLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) return toast.error('Please enter your Student ID.');
    if (!faceImage) return toast.error('Please capture your face using the webcam.');

    setLoading(true);
    try {
      await faceStudentLogin(studentId, faceImage);
      setFaceMatched(true);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setFaceMatched(false);
      setRetryCount((prev) => prev + 1);
      console.error('Login error:', error);
      const message =
        error?.response?.data?.message ||
        error.message ||
        'Face did not match. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setFaceImage(null);
    setFaceMatched(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Student Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your Student ID and capture your face to login
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="studentId" className="sr-only">
                Student ID
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <WebcamCapture onCapture={setFaceImage} />
            {faceMatched === false && (
              <p className="mt-2 text-sm text-red-600 text-center">
                Face did not match. Please try again.
              </p>
            )}
            {retryCount > 0 && faceMatched === false && (
              <button
                type="button"
                onClick={handleRetry}
                className="mt-2 w-full px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
              >
                Retry Capture
              </button>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
