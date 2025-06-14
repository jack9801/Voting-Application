import { Route } from 'react-router-dom';
import CandidateList from '../components/Candidate/CandidateList';
import VotePanel from '../components/Candidate/VotePanel';
import VoteResults from '../components/Candidate/VoteResults';
import CandidateForm from '../components/Candidate/CandidateForm';
import ProtectedRoute from '../components/ProtectedRoute';
import PrivateLayout from '../components/PrivateLayout';

const VotingRoutes = (
  <Route element={<PrivateLayout />}>
    <Route path="/candidates" element={<ProtectedRoute><CandidateList /></ProtectedRoute>} />
    <Route path="/vote" element={<ProtectedRoute><VotePanel /></ProtectedRoute>} />
    <Route path="/results" element={<VoteResults />} />
     <Route path="/admin/candidate-form" element={<CandidateForm />} />
  </Route>
);

export default VotingRoutes;
