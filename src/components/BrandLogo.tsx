import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textColor = 'text-slate-900',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div
        className={`${sizeMap[size]} shrink-0 rounded-2xl bg-white shadow-md shadow-red-500/15 border border-red-100 flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-105`}
      >
        <img
          src="/logo-circle.png"
          alt="Vuela Colombia Logo"
          className="w-full h-full object-contain p-0.5"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to local image in case of path issue
            const target = e.currentTarget;
            if (target.src !== '/logo.png') {
              target.src = '/logo.png';
            }
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none ${size === 'lg' || size === 'xl' ? 'text-2xl' : 'text-xl'} ${textColor}`}>
            Vuela<span className="text-red-600">Colombia</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Buscador Nacional
          </span>
        </div>
      )}
    </div>
  );
};
