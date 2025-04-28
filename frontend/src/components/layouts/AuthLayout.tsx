import {Outlet} from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-grow w-full items-center justify-center p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
