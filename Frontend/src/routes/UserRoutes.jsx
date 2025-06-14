import { Route } from 'react-router-dom';
import Home from '../components/Home/Home';
import Login from '../components/Login/Login';
import Signup from '../components/Signup/Signup';
import Profile from '../components/Profile/Profile';
import Logout from '../components/Logout/Logout';
import PrivateLayout from '../components/PrivateLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const userRoutes = (
  <>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* Private Routes */}
    <Route element={<PrivateLayout />}>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
      />
    </Route>
  </>
);

export default userRoutes;
