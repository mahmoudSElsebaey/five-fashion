import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl border border-border bg-card text-foreground shadow-sm
          transition-all duration-normal ease-five
          ${hoverable ? 'hover:bg-card-hover hover:shadow-md cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-1.5 p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-5 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex items-center p-5 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
