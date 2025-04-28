import {ROUTES} from '@navigation/routes';
import {Navigate, Outlet} from 'react-router-dom';

import {useAuth} from '@hooks/useAuth';

const PublicGuard = () => {
  const {isAuthenticated} = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default PublicGuard;
