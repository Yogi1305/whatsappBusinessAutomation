import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WhatsAppQRCode = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const response = await axios.post(
          'https://graph.facebook.com/v20.0/241683569037594/message_qrdls',
          {
            prefilled_message: "Hey Nuren!!",
            generate_qr_image: "SVG"
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer EAAVZBobCt7AcBO8trGDsP8t4bTe2mRA7sNdZCQ346G9ZANwsi4CVdKM5MwYwaPlirOHAcpDQ63LoHxPfx81tN9h2SUIHc1LUeEByCzS8eQGH2J7wwe9tqAxZAdwr4SxkXGku2l7imqWY16qemnlOBrjYH3dMjN4gamsTikIROudOL3ScvBzwkuShhth0rR9P'
            }
          }
        );

        if (response.data && response.data.qr_image_url) {
          setQrCodeUrl(response.data.qr_image_url);
        } else {
          setError('Failed to generate QR code');
        }
      } catch (err) {
        setError('Error generating QR code');
        console.error('QR code generation error:', err);
      }
    };

    generateQRCode();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center">
      {qrCodeUrl ? (
        <img src={qrCodeUrl} alt="WhatsApp QR Code" className="w-48 h-48" />
      ) : (
        <div className="text-gray-500">Loading QR Code...</div>
      )}
    </div>
  );
};

export default WhatsAppQRCode;