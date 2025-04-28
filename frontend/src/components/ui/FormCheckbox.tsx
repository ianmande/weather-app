import {ReactNode} from 'react';

import {UseFormRegisterReturn} from 'react-hook-form';

import {Checkbox} from '@components/ui/checkbox';

interface FormCheckboxProps {
  id: string;
  label: ReactNode;
  checked?: boolean;
  register?: UseFormRegisterReturn;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const FormCheckbox = ({id, label, checked, register, onCheckedChange, className}: FormCheckboxProps) => {
  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange?.(checked === true)}
        {...(register || {})}
      />
      <label htmlFor={id} className="text-sm text-gray-600">
        {label}
      </label>
    </div>
  );
};

export default FormCheckbox;
