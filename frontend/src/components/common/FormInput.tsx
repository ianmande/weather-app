import React from 'react';

import {AlertCircle} from 'lucide-react';

import {UseFormRegister, FieldError, FieldValues, Path} from 'react-hook-form';

import {Input} from '@components/ui/input';

interface FormInputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  name: Path<T>;
  error?: FieldError;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
}

const FormInput = <T extends FieldValues>({
  register,
  name,
  error,
  icon,
  endIcon,
  onEndIconClick,
  className,
  ...props
}: FormInputProps<T>) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{icon}</div>}
        <Input
          className={`${icon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''} ${className || ''}`}
          {...register(name)}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        {endIcon && (
          <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={onEndIconClick}>
            {endIcon}
          </button>
        )}
      </div>
      {error && (
        <p className="text-destructive text-sm flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormInput;
