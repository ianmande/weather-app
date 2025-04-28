import {AuthCard} from '@components/auth/AuthCard';

import {LoginForm} from './parts/LoginForm';

const LoginScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <AuthCard description="Inicia sesión para acceder a tus ciudades">
        <LoginForm />
      </AuthCard>
    </div>
  );
};

export default LoginScreen;
