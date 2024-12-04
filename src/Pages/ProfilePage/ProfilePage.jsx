import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import SmokeEffect from './smokeeffect'; // Adjust the import path as needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Edit2, 
  Save, 
  X, 
  Upload, 
  User as UserIcon, 
  Maximize2 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';
import axiosInstance, { fastURL } from '../../api';

const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  return pathArray.length >= 2 ? pathArray[1] : null;
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    role: '',
    name: '',
    phone_number: '',
    address: '',
    about: '',
    description: '',
    vertical: '',
    websites: ['', ''],
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileImageId, setProfileImageId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const [whatsappProfileData, setWhatsappProfileData] = useState(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const tenantId = getTenantIdFromUrl();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bpidResponse = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
          headers: { 'X-Tenant-ID': tenantId }
        });
        const businessPhoneNumberId = bpidResponse.data.whatsapp_data[0].business_phone_number_id;
        const accessToken = bpidResponse.data.whatsapp_data[0].access_token;
        
        setBusinessPhoneNumberId(businessPhoneNumberId);
        setAccessToken(accessToken);
  
        const whatsappProfileResponse = await axios.get(
          `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/whatsapp_business_profile?fields=about,description,email,messaging_product,profile_picture_url,websites,vertical`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          }
        );
        
        if (whatsappProfileResponse.data.data && whatsappProfileResponse.data.data.length > 0) {
          setWhatsappProfileData(whatsappProfileResponse.data.data[0]);
          
          setProfile(prevProfile => ({
            ...prevProfile,
            ...whatsappProfileResponse.data.data[0],
            websites: whatsappProfileResponse.data.data[0].websites || ['', '']
          }));
        }
  
        const profileResponse = await axiosInstance.get(`/get-user/${tenantId}`);
        setProfile(prevProfile => ({
          ...prevProfile,
          ...profileResponse.data,
        }));
  
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      }
    };
  
    if (tenantId) {
      fetchData();
    }
  }, [tenantId]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleWebsiteChange = (index, value) => {
    const newWebsites = [...profile.websites];
    newWebsites[index] = value;
    setProfile(prevProfile => ({
      ...prevProfile,
      websites: newWebsites
    }));
  };

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfileImage(selectedFile);
      setProfileImagePreview(URL.createObjectURL(selectedFile));

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', 'image');
        formData.append('messaging_product', 'whatsapp');

        const response = await axios.post(
          'https://my-template-whatsapp.vercel.app/uploadMedia',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            },
          }
        );

        setProfileImageId(response.data.body.h);
        setUploadProgress(100);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadProgress(0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    try {
      // Prepare the payload for WhatsApp Business Profile update
      const updatePayload = {
        messaging_product: "whatsapp",
        about: profile.about,
        description: profile.description,
        ...(profileImageId && { profile_picture_handle: profileImageId }),
        websites: profile.websites.filter(website => website.trim() !== '')
      };

      // Update profile on WhatsApp Business Profile
      await axios.post(
        `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/whatsapp_business_profile`,
        updatePayload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Optionally, update backend if needed
      // await axiosInstance.put(`/get-user/${tenantId}/`, profile);

    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
     {/*<SmokeEffect />*/}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </div>
          <Button 
            variant={isEditing ? "destructive" : "default"}
            onClick={handleEdit}
            className="flex items-center"
          >
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div 
                    className="relative group"
                    onDoubleClick={() => setIsImageExpanded(true)}
                  >
                    <Avatar className="h-24 w-24">
                      <AvatarImage 
                        src={profileImagePreview || whatsappProfileData?.profile_picture_url} 
                        alt="Profile Picture" 
                      />
                      <AvatarFallback>
                        <UserIcon className="h-12 w-12 text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                    {!isEditing && (
                      <div 
                        className="absolute bottom-0 right-0 bg-gray-200 text-gray-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsImageExpanded(true)}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" /> Change Picture
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Profile Picture</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center space-y-4">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="w-full" 
                          />
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <Progress value={uploadProgress} className="w-full" />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div>
                  <Label>Description</Label>
                  <Input 
                    value={profile.description || ''} 
                    name="description"
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                
                
              </div>
              <div className="space-y-4">
                <div>
                  <Label>About</Label>
                  <Input 
                    value={profile.about || ''} 
                    name="about"
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
               
               
                <div>
                  <Label>Website 1</Label>
                  <Input 
                    value={profile.websites[0] || ''} 
                    onChange={(e) => handleWebsiteChange(0, e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Website 2</Label>
                  <Input 
                    value={profile.websites[1] || ''} 
                    onChange={(e) => handleWebsiteChange(1, e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="flex items-center">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Image Expansion Dialog */}
      <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center">
            <img 
              src={profileImagePreview || whatsappProfileData?.profile_picture_url} 
              alt="Expanded Profile" 
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;