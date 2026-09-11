import { useState } from 'react';

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  /** Wrapper gets aspect ratio / positioning; img fills it */
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
};

/**
 * SECTION 04 — Safe product image with muted gradient fallback on error/missing src.
 */
export function ProductImage({
  src,
  alt,
  className = '',
  imgClassName = 'absolute inset-0 h-full w-full object-cover',
  loading = 'lazy',
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;

  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      {showImg ? (
        <img
          src={src!}
          alt={alt}
          loading={loading}
          className={imgClassName}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-surface via-muted to-accent/10"
          aria-hidden={!alt}
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
        />
      )}
    </div>
  );
}
