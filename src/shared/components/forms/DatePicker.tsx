import { forwardRef, type InputHTMLAttributes } from 'react';

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'error'> {
  label: string;
  error?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-zinc-400 text-xs font-semibold tracking-wide">
          {label}
        </label>
        <input
          ref={ref}
          type="date"
          className={`w-full bg-zinc-900/40 border ${
            error ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-sky-500'
          } rounded-xl px-3.5 py-3 text-sm text-zinc-100 [color-scheme:dark] outline-none transition ${className || ''}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
export default DatePicker;
