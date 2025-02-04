import { useState } from 'react';
import { axiosInstance } from '../../api';

export default function useFileUpload(businessPhoneNumberId, accessToken) {
  const [uploadStatus, setUploadStatus] = useState('');
  const [mediaId, setMediaId] = useState(null);

  const uploadFile = async (file) => {
    try {
      setUploadStatus('Uploading...');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('image') ? 'image' : 'document');
      formData.append('messaging_product', 'whatsapp');

      const response = await axiosInstance.post(
        `https://graph.facebook.com/v16.0/${businessPhoneNumberId}/media`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setMediaId(response.data.id);
      setUploadStatus('Upload successful!');
      return response.data.id;
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('Upload failed');
      return null;
    }
  };

  return { uploadFile, mediaId, uploadStatus };
}