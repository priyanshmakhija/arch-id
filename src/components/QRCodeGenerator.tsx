import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  showText?: boolean;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 200, 
  className = '',
  showText = true
}) => {
  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <QRCode
        value={value}
        size={size}
        level="M"
        includeMargin={true}
      />
      {showText && (
        <p className="text-sm text-gray-600 font-mono break-all max-w-xs text-center">
          {value}
        </p>
      )}
    </div>
  );
};

export default QRCodeGenerator;
