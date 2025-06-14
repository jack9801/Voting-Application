import {RouterProvider,createBrowserRouter,createRoutesFromElements,} from 'react-router-dom';
import userRoutes from './routes/UserRoutes';
import votingRoutes from './routes/VotingRoutes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {userRoutes}
      {votingRoutes}
    </>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
