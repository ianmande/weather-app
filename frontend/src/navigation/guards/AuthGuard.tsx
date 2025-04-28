import {ROUTES} from '@navigation/routes';
import {Navigate, Outlet} from 'react-router-dom';

import {useAuth} from '@hooks/useAuth';

const AuthGuard = () => {
  const {isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
