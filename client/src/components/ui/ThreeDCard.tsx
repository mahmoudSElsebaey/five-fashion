import {
  createContext,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type ThreeDContextValue = {
  mouseX: number;
  mouseY: number;
  isHovering: boolean;
};

const ThreeDContext = createContext<ThreeDContextValue>({
  mouseX: 0,
  mouseY: 0,
  isHovering: false,
});

/** Perspective wrapper — Aceternity / 21st 3D-card style. */
export function CardContainer({
  children,
  className = '',
  containerClassName = '',
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMouseX(x);
    setMouseY(y);
  };

  const rotateX = isHovering && !reduced ? (0.5 - mouseY) * 14 : 0;
  const rotateY = isHovering && !reduced ? (mouseX - 0.5) * 14 : 0;

  return (
    <div
      className={`flex items-center justify-center ${containerClassName}`}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={ref}
        onMouseEnter={() => setIsHovering(true)}
        onMouseMove={handleMove}
        onMouseLeave={() => {
          setIsHovering(false);
          setMouseX(0.5);
          setMouseY(0.5);
        }}
        className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <ThreeDContext.Provider value={{ mouseX, mouseY, isHovering }}>
          {children}
        </ThreeDContext.Provider>
      </div>
    </div>
  );
}

export function CardBody({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`h-full w-full [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  );
}

type CardItemProps = {
  children: ReactNode;
  className?: string;
  translateZ?: number | string;
  as?: ElementType;
  style?: CSSProperties;
} & Record<string, unknown>;

export function CardItem({
  children,
  className = '',
  translateZ = 0,
  as: Tag = 'div',
  style,
  ...rest
}: CardItemProps) {
  const { isHovering } = useContext(ThreeDContext);
  const reduced = useReducedMotion();
  const z = typeof translateZ === 'string' ? translateZ : `${translateZ}px`;
  const lift = isHovering && !reduced ? z : '0px';

  return (
    <Tag
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: `translateZ(${lift})`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
