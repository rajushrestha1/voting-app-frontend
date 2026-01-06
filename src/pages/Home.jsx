import React from 'react'; 
import { Link } from 'react-router-dom'; 
import About from '../pages/About';

const Home = () => {
  return (  
    <>
      <div
        className="w-full h-screen flex items-center justify-center bg-cover bg-center px-6 lg:px-16"
          style={{ backgroundImage: `url(/Images/e-voting.png)`, backgroundSize: 'cover', 
          backgroundPosition: 'center', }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-gray-900 ">
              Student Voting System
            </h1>
            <p className="mt-4 text-lg text-black max-w-2xl">
              A secure and transparent platform for student elections. Cast your vote anytime, anywhere.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-blue-600 text-white hover:bg-white hover:text-black border text-lg font-semibold rounded-lg shadow-md hover:scale-105 transition-all duration-300"
              >
                Student Login
              </Link>
              <Link
                to="/candidates"
                className="inline-block px-8 py-3 bg-white text-blue-600 text-lg font-semibold rounded-lg border hover:scale-105 transition-all duration-300"
              >
                View Candidates
              </Link>
            </div>
          </div>

          <div className="">
          </div>
        </div>
      </div>

      <About />
    </>
  );
};

export default Home;
