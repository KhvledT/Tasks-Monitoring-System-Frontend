import { forwardRef, type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'error'> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-zinc-400 text-xs font-semibold tracking-wide">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={`w-full bg-zinc-900/40 border ${
              error ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-sky-500'
            } rounded-xl px-3.5 py-3 text-sm text-zinc-100 outline-none transition appearance-none cursor-pointer ${className || ''}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-zinc-950 text-zinc-100">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
export default FormSelect;
