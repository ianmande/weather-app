import {useState} from 'react';

import {Eye, EyeOff, Lock} from 'lucide-react';
import {FieldValues, UseFormReturn} from 'react-hook-form';

import {FormField, FormItem, FormControl, FormMessage} from '@interfaces/components/ui/form';
import {Input} from '@components/ui/input';

interface InputControlProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: string;
  type: string;
  placeholder: string;
}

export const InputControl = ({form, name, type, placeholder}: InputControlProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-500" />
            </div>
            <FormControl>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                className="pl-10 pr-10"
                {...field}
              />
            </FormControl>
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
