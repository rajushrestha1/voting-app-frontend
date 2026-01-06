import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCandidates, getResults, addCandidate, removeCandidate } from '../../api/api';
import AddCandidateForm from '../candidate/AddCandidateForm';
import CandidateList from '../candidate/CandidateList';
import ResultsChart from '../common/ResultsChart';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('candidates');

  useEffect(() => {
    if (!admin) return;
    
    const fetchData = async () => {
      try {
        if (activeTab === 'candidates') {
          const { data } = await getCandidates();
          setCandidates(data);
        } else {
          const { data } = await getResults();
          setResults(data);
        }
      } catch (error) {
console.error('Login error:', error);
  toast.error('Faild to fetch data');    
  }
    };
    
    fetchData();
  }, [admin, activeTab]);

  const handleAddCandidate = async (candidateData) => {
    try {
      const { data } = await addCandidate(candidateData);
      setCandidates([...candidates, data]);
      setShowForm(false);
      toast.success('Candidate added successfully');
    } catch (error) {
console.error('Login error:', error);
  toast.error('Failed to add candidate');    }
  };

  const handleRemoveCandidate = async (id) => {
    try {
      await removeCandidate(id);
      setCandidates(candidates.filter(c => c._id !== id));
      toast.success('Candidate removed successfully');
    } catch (error) {
      console.error('Login error:', error);
    toast.error('Failed to remove candidate');
        }
    };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'candidates' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('candidates')}
        >
          Manage Candidates
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'results' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('results')}
        >
          View Results
        </button>
      </div>
      
      {activeTab === 'candidates' ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Candidates Management</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {showForm ? 'Cancel' : 'Add New Candidate'}
            </button>
          </div>
          
          {showForm && (
            <AddCandidateForm 
              onSubmit={handleAddCandidate} 
              onCancel={() => setShowForm(false)}
            />
          )}
          
          <CandidateList 
            candidates={candidates} 
            onRemove={handleRemoveCandidate} 
          />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Election Results</h2>
          <ResultsChart data={results} />
          
          <div className="mt-8">
            {(() => {
              const grouped = results.reduce((acc, c) => {
                const party = c.party || 'Independent';
                if (!acc[party]) acc[party] = [];
                acc[party].push(c);
                return acc;
              }, {});

              const totalVotesAll = results.reduce((sum, c) => sum + (c.votes || 0), 0);

              return Object.keys(grouped).map((party) => {
                const items = (grouped[party] || []).slice().sort((a, b) => (b.votes || 0) - (a.votes || 0));
                const totalVotesParty = items.reduce((s, it) => s + (it.votes || 0), 0);

                return (
                  <div key={party} className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">{party} ({items.length} candidates)</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left">Candidate</th>
                            <th className="py-3 px-4 text-left">Position</th>
                            <th className="py-3 px-4 text-center">Votes</th>
                            <th className="py-3 px-4 text-center">% of Party</th>
                            <th className="py-3 px-4 text-center">% of Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((candidate, idx) => {
                            const pctParty = totalVotesParty > 0 ? ((candidate.votes / totalVotesParty) * 100).toFixed(1) : '0.0';
                            const pctAll = totalVotesAll > 0 ? ((candidate.votes / totalVotesAll) * 100).toFixed(1) : '0.0';
                            return (
                              <tr key={candidate._id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="py-3 px-4 border-b">{candidate.name}</td>
                                <td className="py-3 px-4 border-b">{candidate.position || 'Candidate'}</td>
                                <td className="py-3 px-4 border-b text-center">{candidate.votes}</td>
                                <td className="py-3 px-4 border-b text-center">{pctParty}%</td>
                                <td className="py-3 px-4 border-b text-center">{pctAll}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;