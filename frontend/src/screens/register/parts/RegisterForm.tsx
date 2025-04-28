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

import {RegisterRequest} from '@interfaces/user';

import {registerSchema, RegisterFormData} from '@utilities/validations/auth.schema';

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {register: registerUser} = useAuth();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const registerData: RegisterRequest = {
        email: data.email,
        password: data.password,
      };

      const result = await registerUser(registerData);

      if (result.success) {
        toast.success('¡Cuenta creada exitosamente!');
        navigate(ROUTES.HOME);
      } else {
        toast.error(result.error || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
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

      <FormInput
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirmar contraseña"
        register={register('confirmPassword')}
        error={errors.confirmPassword?.message}
        leftIcon={<Lock className="w-5 h-5 text-gray-500" />}
        rightIcon={
          showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />
        }
        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <Button
        type="submit"
        className="w-full mt-2.5 bg-blue-600 hover:bg-blue-400 cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>

      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">¿Ya tienes una cuenta?</span>{' '}
        <Link to={ROUTES.LOGIN} className="p-0 h-auto text-blue-300">
          Inicia sesión
        </Link>
      </div>
    </form>
  );
};
