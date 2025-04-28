import React from 'react';
import { animated } from 'react-spring';
import { useHoverSpring, usePulse } from '../../animations/useAnimations';
import './animated-button.scss';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  isPulsing?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isPulsing = false,
  disabled = false,
  className = '',
}) => {
  const hoverSpring = useHoverSpring();
  const pulseSpring = usePulse();

  const buttonClasses = [
    'animated-button',
    `animated-button--${variant}`,
    `animated-button--${size}`,
    disabled ? 'animated-button--disabled' : '',
    isLoading ? 'animated-button--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <animated.button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={isPulsing ? pulseSpring : hoverSpring}
    >
      <span className="button-content">
        {isLoading ? (
          <span className="loading-spinner">
            <span className="material-symbols-outlined spin">progress_activity</span>
          </span>
        ) : children}
      </span>
    </animated.button>
  );
}; 