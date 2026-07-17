import { forwardRef, type InputHTMLAttributes, useId } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'error'> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, type = 'text', id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={inputId} className="text-zinc-400 text-xs font-semibold tracking-wide">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-zinc-900/40 border ${
            error ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-sky-500'
          } rounded-xl px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder-zinc-650 ${className || ''}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
export default FormInput;
