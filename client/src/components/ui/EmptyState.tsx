import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Internal app path, e.g. /shop */
  actionTo?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Shared empty state for shop, cart, wishlist, admin lists, etc.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
  icon,
  className = '',
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) onAction();
    else if (actionTo) navigate(actionTo);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 px-6 py-16 text-center sm:py-24 ${className}`}
      role="status"
    >
      {icon && (
        <div className="text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="max-w-md space-y-2">
        <p className="text-lg font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {actionLabel && (onAction || actionTo) && (
        <Button variant="outline" size="sm" onClick={handleAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
