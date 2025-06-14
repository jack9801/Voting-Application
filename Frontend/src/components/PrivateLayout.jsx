import Header from './Header';
import { Outlet } from 'react-router-dom';

function PrivateLayout() {
  return (
    <>
      <Header />
      <div className="pt-20">
        <Outlet />
      </div>
    </>
  );
}

export default PrivateLayout;
