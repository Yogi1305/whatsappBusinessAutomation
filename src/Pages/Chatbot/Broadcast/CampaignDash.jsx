import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CampaignManager from './Campaign';
import axiosInstance, { djangoURL } from '../../../api';

const CampaignsDashboard = ({
    contacts,
    broadcastGroups,
    showTemplatePopup,
    setShowTemplatePopup,
    templates,
    accountId,
    accessToken
  }) => {
  const [showCampaignCreator, setShowCampaignCreator] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${djangoURL}/campaign/`);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      setError('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = (campaignData) => {
    setShowCampaignCreator(false);
    setEditingCampaign(null);
    fetchCampaigns();
  };

  const handleEditCampaign = async (campaign) => {
    try {
      const response = await axiosInstance.get(`${djangoURL}/campaign/?id=${campaign.id}`);
      const campaignData = response.data;
      
      // Transform campaign data for editor
      const transformedData = {
        ...campaignData,
        sequence: campaignData.templates_data.map((template, index) => ({
          id: Date.now() + index,
          name: template.name,
          templateId: template.template_id,
          next: template.next,
          index: template.index,
          status: template.status || 'read',
          timeDelay: template.time_delay || 60,
          isApproved: true
        })),
        selectedProspects: campaignData.phone?.map(phone => ({
          id: Date.now() + Math.random(),
          phone: phone.toString()
        })) || []
      };

      setEditingCampaign(transformedData);
      setShowCampaignCreator(true);
    } catch (error) {
      console.error('Failed to fetch campaign details:', error);
      setError('Failed to fetch campaign details');
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      await axiosInstance.delete(`${djangoURL}/campaign/?id=${campaignToDelete.id}`);
      await fetchCampaigns();
      setShowDeleteDialog(false);
      setCampaignToDelete(null);
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      setError('Failed to delete campaign');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        Loading campaigns...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (showCampaignCreator) {
    return (
      <CampaignManager
        templates={templates}
        onCreateCampaign={handleCreateCampaign}
        initialData={editingCampaign} // Pass the transformed campaign data
        contacts={contacts}
        broadcastGroups={broadcastGroups}
        showTemplatePopup={showTemplatePopup}
        setShowTemplatePopup={setShowTemplatePopup}
        accountId={accountId}
        accessToken={accessToken}
        isEditing={!!editingCampaign} // Pass flag to indicate edit mode
      />
    );
  }


  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-gray-500">Manage your campaigns</p>
        </div>
        <Button 
          onClick={() => setShowCampaignCreator(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No campaigns found. Create your first campaign!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{campaign.name}</h3>
                    <p className="text-sm text-gray-500">Contacts: {campaign.phone?.length || 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                  
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setCampaignToDelete(campaign);
                            setShowDeleteDialog(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Messages: {campaign.templates_data?.length || 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setCampaignToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCampaign} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignsDashboard;