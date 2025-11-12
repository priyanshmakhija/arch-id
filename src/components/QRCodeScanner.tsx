import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const startScanning = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScanSuccess(decodedText);
            scanner.stop().catch(console.error);
            setScanning(false);
          },
          (errorMessage) => {
            // Ignore scanning errors (just means no QR code detected yet)
          }
        );
        setScanning(true);
      } catch (err: any) {
        console.error('Error starting scanner:', err);
        setError(err.message || 'Failed to start camera. Please check permissions.');
        setScanning(false);
      }
    };

    startScanning();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(console.error)
          .finally(() => {
            scannerRef.current = null;
          });
      }
    };
  }, [onScanSuccess]);

  const handleClose = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      scannerRef.current = null;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
        </div>

        {scanning && (
          <p className="text-sm text-gray-600 text-center">
            Point your camera at a QR code
          </p>
        )}

        <button
          onClick={handleClose}
          className="w-full mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QRCodeScanner;

