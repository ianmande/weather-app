import {Outlet} from 'react-router-dom';

import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Navbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
