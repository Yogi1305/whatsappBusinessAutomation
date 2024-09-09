import { BlobServiceClient } from '@azure/storage-blob';

const account = "pdffornurenai";
const sas = "sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-06-01T16:13:31Z&st=2024-06-01T08:13:31Z&spr=https&sig=8s7IAdQ3%2B7zneCVJcKw8o98wjXa12VnKNdylgv02Udk%3D";

const containerName = 'pdf';
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/?${sas}`);

const uploadToBlob = async (file, userId, tenantId) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Construct the unique file name
    const originalFileName = file.name;
    const fileExtension = originalFileName.split('.').pop(); // Get the file extension
    const newFileName = `${originalFileName.split('.')[0]}_${userId}_${tenantId}.${fileExtension}`; // Create the new file name

    const blockBlobClient = containerClient.getBlockBlobClient(newFileName);

    const uploadBlobResponse = await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    console.log(`Upload block blob ${newFileName} successfully`, uploadBlobResponse.requestId);

    return blockBlobClient.url; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file to Azure:', error);
    throw error;
  }
};

export default uploadToBlob;
