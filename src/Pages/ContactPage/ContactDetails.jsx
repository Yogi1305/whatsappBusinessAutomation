import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Edit2,
  Save,
  X,
  UserX
} from 'lucide-react';
import { format } from 'date-fns';
import axiosInstance, { djangoURL } from '../../api';
import { fastURL } from '../../api';
import { useSearchParams } from 'react-router-dom';

const ContactDetails = () => {
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone');
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState(null);
  const [editedContact, setEditedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      if (!phone) {
        setError('Phone number is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosInstance.get(`${fastURL}/contact?phone=${phone}`);
        const contactData = response.data;
        
        // Ensure contactData has all required fields with default values
        const sanitizedContact = {
          id: contactData?.id || null,
          email: contactData?.email || null,
          isActive: contactData?.isActive || false,
          template_key: contactData?.template_key || null,
          last_delivered: contactData?.last_delivered || null,
          phone: contactData?.phone || phone,
          name: contactData?.name || 'Unknown Contact',
          address: contactData?.address || null,
          description: contactData?.description || null,
          createdOn: contactData?.createdOn || new Date().toISOString(),
          tenant_id: contactData?.tenant_id || null,
          last_seen: contactData?.last_seen || null,
          last_replied: contactData?.last_replied || null,
          customField: contactData?.customField || {}
        };

        setContact(sanitizedContact);
        setEditedContact(sanitizedContact);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch contact details');
       // console.error('Error fetching contact:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactDetails();
  }, [phone]);

  const handleInputChange = (field, value) => {
    if (!editedContact) return;
    
    setEditedContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomFieldChange = (field, value) => {
    if (!editedContact?.customField) return;
    
    setEditedContact(prev => ({
      ...prev,
      customField: {
        ...(prev?.customField || {}),
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!editedContact?.id) {
      setError('Cannot save contact without ID');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.patch(`${djangoURL}/update-contacts/`, editedContact);
      setContact(editedContact);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact');
    //  console.error('Error updating contact:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedContact(contact);
    setIsEditing(false);
  };
  
  const handleSendMessage = (contactId) => {
    navigate(`../chatbot?id=${contactId}`);
  };

  const getInitials = (name) => {
    if (!name) return '??';
    
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (err) {
    //  console.error('Error formatting date:', err);
      return 'Invalid Date';
    }
  };

  const renderField = (label, icon, value, field) => {
    const Icon = icon;
    return (
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
        {isEditing ? (
          <div className="flex-1">
            <Label className="text-sm text-gray-500">{label}</Label>
            <Input
              value={value || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ) : (
          <span className="text-gray-600">{value || `No ${label.toLowerCase()} provided`}</span>
        )}
      </div>
    );
  };

  const renderCustomField = (key, value) => {
    if (!key) return null;

    return (
      <div key={key} className="flex items-start gap-2 w-full">
        <div className="w-5 h-5 mt-1 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-medium text-gray-500">
          {key[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 capitalize">
            {key.replace(/_/g, ' ')}
          </p>
          {isEditing ? (
            typeof value === 'boolean' ? (
              <div className="flex items-center space-x-2 mt-1">
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleCustomFieldChange(key, checked)}
                />
                <Label>{value ? 'Yes' : 'No'}</Label>
              </div>
            ) : (
              <Input
                value={value?.toString() || ''}
                onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                className="mt-1 w-full"
              />
            )
          ) : (
            <p className="text-gray-600 break-all">
              {typeof value === 'boolean' 
                ? (value ? 'Yes' : 'No') 
                : key === 'link' && value
                  ? (
                    <a 
                      href={value} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline break-all"
                    >
                      {value}
                    </a>
                  ) 
                  : value?.toString() || 'N/A'}
            </p>
          )}
        </div>
      </div>
    );
  };

  if (isLoading && !contact) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Loading contact details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Contact</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contact || !editedContact) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="text-gray-400 mb-4">
              <UserX className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Not Found</h2>
            <p className="text-gray-600 mb-4">The requested contact could not be found.</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Contact Details</h1>
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white font-bold text-xl">
                  {getInitials(editedContact?.name)}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={editedContact?.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <CardTitle className="text-2xl">{editedContact?.name || 'Unknown Contact'}</CardTitle>
                  )}
                  <div className="flex gap-2 mt-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={editedContact?.isActive || false}
                          onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                        />
                        <Label>Active</Label>
                      </div>
                    ) : (
                      <Badge variant={editedContact?.isActive ? "success" : "secondary"}>
                        {editedContact?.isActive ? "Active" : "Inactive"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="info">Basic Info</TabsTrigger>
                  <TabsTrigger value="custom">Custom Fields</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {renderField('Email', Mail, editedContact?.email, 'email')}
                      {renderField('Phone', Phone, editedContact?.phone, 'phone')}
                      {renderField('Address', MapPin, editedContact?.address, 'address')}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Created On</p>
                          <p className="text-gray-600">{formatDate(editedContact?.createdOn)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="custom">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(editedContact?.customField || {}).map(([key, value]) => 
                      renderCustomField(key, value)
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="activity">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Last Delivered</p>
                        <p className="text-gray-600">{formatDate(editedContact?.last_delivered)}</p>
                      </div>
                      </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Last Reply</p>
                        <p className="text-gray-600">{formatDate(editedContact?.last_replied)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full gap-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={!editedContact?.phone}
                  onClick={() => handleSendMessage(contact.id)}
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-4">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
                  
                  {editedContact?.last_seen && (
                    <div className="relative flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-blue-500 relative z-10 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Last seen</p>
                        <p className="text-xs text-gray-500">{formatDate(editedContact.last_seen)}</p>
                      </div>
                    </div>
                  )}
                  
                  {editedContact?.last_replied && (
                    <div className="relative flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500 relative z-10 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Last replied</p>
                        <p className="text-xs text-gray-500">{formatDate(editedContact.last_replied)}</p>
                      </div>
                    </div>
                  )}
                  
                  {editedContact?.last_delivered && (
                    <div className="relative flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-purple-500 relative z-10 mt-1" />
                      <div>
                        <p className="text-sm font-medium">Last delivered</p>
                        <p className="text-xs text-gray-500">{formatDate(editedContact.last_delivered)}</p>
                      </div>
                    </div>
                  )}

                  {!editedContact?.last_seen && !editedContact?.last_replied && !editedContact?.last_delivered && (
                    <div className="py-4 text-center text-gray-500">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;