import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { student, admin, logoutStudent, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (student) {
      logoutStudent();
      navigate('/');
    } else if (admin) {
      logoutAdmin();
      navigate('/admin/login');
    }
  };

  return (
    <nav className=" text-black shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">StudentVote</Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-yellow-500 font-semibold transition">Home</Link>
          <Link to="/about" className="hover:text-yellow-500 font-semibold transition">About Us</Link>
          <Link to="/candidates" className="hover:text-yellow-500 font-semibold transition">Candidate Details</Link>
          <Link to="/requirements" className="hover:text-yellow-500 font-semibold transition">Voting Requirements</Link>
          <Link to="/register" className="hover:text-yellow-500 font-semibold transition">Register</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {student ? (
            <div className="flex items-center space-x-3">
              <span>Welcome, {student.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-white hover:text-black broder px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          ) : admin ? (
            <div className="flex items-center space-x-3">
              <span>Admin Panel</span>
              <button 
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-white hover:text-black border cursor-pointer px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 hover:bg-white hover:text-black border px-4 py-2 rounded transition">
                Student Login
              </Link>
              <Link to="/admin/login" className="bg-blue-500 hover:bg-white hover:text-black border px-4 py-2 rounded transition">
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;