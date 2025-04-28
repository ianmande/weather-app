import {ReactNode} from 'react';

import {UseFormRegisterReturn} from 'react-hook-form';

import {Input} from '@components/ui/input';

interface FormInputProps {
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  className?: string;
}

const FormInput = ({
  type,
  placeholder,
  register,
  error,
  leftIcon,
  rightIcon,
  onRightIconClick,
  className,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{leftIcon}</div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          className={`${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className || ''}`}
          aria-invalid={!!error}
          {...register}
        />
        {rightIcon && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default FormInput;
