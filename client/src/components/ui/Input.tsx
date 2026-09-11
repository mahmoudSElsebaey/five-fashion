import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, fullWidth = true, id, ...props }, ref) => {
    const inputId = id || props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} space-y-1.5`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`
            flex h-10 w-full rounded-lg border border-input bg-surface px-3 py-2 text-sm
            text-foreground placeholder:text-muted-foreground
            transition-colors duration-normal ease-five
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-error focus-visible:ring-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
