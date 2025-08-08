import { Route } from 'react-router-dom';
import CandidateList from '../components/Candidate/CandidateList';
import VotePanel from '../components/Candidate/VotePanel';
import VoteResults from '../components/Candidate/VoteResults';
import AdminCampaign from '../components/Candidate/AdminCampaign';
import ProtectedRoute from '../components/ProtectedRoute';
import PrivateLayout from '../components/PrivateLayout';
import VoterList from '../components/Candidate/VoterList';

const VotingRoutes = (
  <Route element={<PrivateLayout />}>
    <Route path="/candidates" element={<ProtectedRoute><CandidateList /></ProtectedRoute>} />
    <Route path="/vote" element={<ProtectedRoute><VotePanel /></ProtectedRoute>} />
    <Route path="/results" element={<VoteResults />} />
    <Route path="/admin/campaign" element={<ProtectedRoute adminOnly={true}><AdminCampaign /></ProtectedRoute>} />
    <Route path="/admin/voters" element={<ProtectedRoute adminOnly={true}><VoterList /></ProtectedRoute>} />
  </Route>
);

export default VotingRoutes;