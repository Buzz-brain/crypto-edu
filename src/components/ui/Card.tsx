import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  interactive?: boolean;
}

export function Card({ 
  children, 
  variant = 'default', 
  interactive = false, 
  className, 
  ...props 
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 overflow-hidden';
  
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-lg',
    outlined: 'border-2 shadow-none'
  };

  const Component = interactive ? motion.div : 'div';
  const motionProps = interactive ? {
    whileHover: { y: -2, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' },
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  } : {};

  return (
    <Component
      className={clsx(
        baseClasses,
        variantClasses[variant],
        interactive && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-6 py-4 border-b border-gray-200', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('px-6 py-4 border-t border-gray-200 bg-gray-50', className)} {...props}>
      {children}
    </div>
  );
}