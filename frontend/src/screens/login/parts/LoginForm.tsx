import {useState} from 'react';

import {yupResolver} from '@hookform/resolvers/yup';
import {ROUTES} from '@navigation/routes';
import {Eye, EyeOff, Mail, Lock} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';

import {Button} from '@components/ui/button';
import FormInput from '@components/ui/FormInput';

import {useAuth} from '@hooks/useAuth';

import {LoginRequest} from '@interfaces/user';

import {loginSchema, LoginFormData} from '@utilities/validations/auth.schema';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const loginData: LoginRequest = {
        email: data.email,
        password: data.password,
      };

      const result = await login(loginData);

      if (result.success) {
        toast.success('¡Inicio de sesión exitoso!');
        navigate(ROUTES.HOME);
      } else {
        toast.error(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        type="email"
        placeholder="Correo electrónico"
        register={register('email')}
        error={errors.email?.message}
        leftIcon={<Mail className="w-5 h-5 text-gray-500" />}
      />

      <FormInput
        type={showPassword ? 'text' : 'password'}
        placeholder="Contraseña"
        register={register('password')}
        error={errors.password?.message}
        leftIcon={<Lock className="w-5 h-5 text-gray-500" />}
        rightIcon={
          showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />
        }
        onRightIconClick={() => setShowPassword(!showPassword)}
      />

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          className="text-sm p-0 h-auto"
          onClick={() => console.log('Olvidé mi contraseña')}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </div>

      <Button
        type="submit"
        className="w-full mt-2.5 bg-blue-600 hover:bg-blue-400 cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">¿No tienes una cuenta?</span>{' '}
        <Link to={ROUTES.REGISTER} className="p-0 h-auto text-blue-300">
          Regístrate
        </Link>
      </div>
    </form>
  );
};
