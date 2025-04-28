import {lazy, Suspense} from 'react';

import {Progress} from '@radix-ui/react-progress';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import AuthLayout from '@components/layouts/AuthLayout';
import MainLayout from '@components/layouts/MainLayout';

import AuthGuard from './guards/AuthGuard';
import PublicGuard from './guards/PublicGuard';

import {ROUTES} from './routes';

const HomeScreen = lazy(() => import('@screens/home/HomeScreen'));
const LoginScreen = lazy(() => import('@screens/login/LoginScreen'));
const RegisterScreen = lazy(() => import('@screens/register/RegisterScreen'));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Progress />}>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicGuard />}>
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<LoginScreen />} />
              <Route path={ROUTES.REGISTER} element={<RegisterScreen />} />
            </Route>
          </Route>

          {/* Protected routes - Normal user */}
          <Route element={<AuthGuard />}>
            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<HomeScreen />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
