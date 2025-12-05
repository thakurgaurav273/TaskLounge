import { Loader2, Circle } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'spinner' | 'pulse';
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const Loading = ({
  size = 'md',
  variant = 'default',
  message,
  className = '',
  fullScreen = false
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const baseClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.1)] backdrop-blur-sm' 
    : 'flex items-center gap-2';

  return (
    <div className={`${baseClasses} ${className}`}>
      {variant === 'spinner' && (
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      )}
      
      {variant === 'dots' && (
        <div className="flex gap-1">
          <div className={`${sizeClasses[size === 'lg' ? 'md' : size]} bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.16s]`} />
          <div className={`${sizeClasses[size === 'lg' ? 'md' : size]} bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.08s]`} />
          <div className={`${sizeClasses[size === 'lg' ? 'md' : size]} bg-indigo-500 rounded-full animate-bounce`} />
        </div>
      )}
      
      {variant === 'pulse' && (
        <div className={`${sizeClasses[size]} bg-indigo-500 rounded-full animate-pulse`} />
      )}
      
      {variant === 'default' && (
        <Circle className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      )}

      {message && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {message}
        </span>
      )}
    </div>
  );
};

export default Loading;
