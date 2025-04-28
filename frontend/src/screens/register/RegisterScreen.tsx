import {AuthCard} from '@components/auth/AuthCard';

import {RegisterForm} from './parts/RegisterForm';

const RegisterScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <AuthCard description="Crea una cuenta para acceder a tus ciudades">
        <RegisterForm />
      </AuthCard>
    </div>
  );
};

export default RegisterScreen;
