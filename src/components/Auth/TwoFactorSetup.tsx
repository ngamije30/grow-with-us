import { useState } from 'react';
import Image from 'next/image';

export const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const enable2FA = async () => {
    try {
      const response = await fetch('/api/2fa/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error('Error enabling 2FA:', error);
    }
  };

  const verify2FA = async () => {
    try {
      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationCode }),
      });
      
      if (response.ok) {
        setIsEnabled(true);
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error);
    }
  };

  return (
    <div className="two-factor-setup">
      {!isEnabled ? (
        <>
          <button onClick={enable2FA}>Enable Two-Factor Authentication</button>
          {qrCode && (
            <div>
              <p>Scan this QR code with your authenticator app:</p>
              <Image src={qrCode} alt="2FA QR Code" width={200} height={200} />
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
              />
              <button onClick={verify2FA}>Verify</button>
            </div>
          )}
        </>
      ) : (
        <p>Two-factor authentication is enabled!</p>
      )}
    </div>
  );
};