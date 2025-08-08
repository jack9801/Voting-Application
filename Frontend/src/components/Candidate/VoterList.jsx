import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaDownload } from 'react-icons/fa';

const VoterList = () => {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVoters = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_BASE}/user/voters`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setVoters(res.data.voters);
            } catch (err) {
                setError('Failed to fetch voters. Only Admins can view this page.');
            } finally {
                setLoading(false);
            }
        };
        fetchVoters();
    }, []);

    const handleDownload = () => {
        const token = localStorage.getItem('token');
        axios({
            url: `${import.meta.env.VITE_API_BASE}/user/voters/download`,
            method: 'GET',
            responseType: 'blob', // Important for handling file downloads
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'voters.csv'); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link); // Clean up
        }).catch(err => {
            setError("Could not download file. You may not have the required permissions.");
        });
    };

    if (loading) return <p className="text-center mt-8 animate-pulse text-gray-600">Loading voters...</p>;
    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Voter List</h2>
                    <button 
                        onClick={handleDownload}
                        className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                        <FaDownload className="mr-2" />
                        Export to CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Aadhar Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Voted</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {voters.map((voter) => (
                                <tr key={voter._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{voter.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voter.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voter.aadharcardNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {voter.isvoted ? (
                                            <FaCheckCircle className="text-green-500 text-xl" />
                                        ) : (
                                            <FaTimesCircle className="text-red-500 text-xl" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VoterList;