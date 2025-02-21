import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { axiosInstance, fastURL } from '../../../api';
import { whatsappURL } from '../../../Navbar';
import { convertMentionsForFrontend } from '../../NewFlow/MentionTextArea';
import { toast } from "sonner";

export const useBroadcastManager = (tenantId) => {
  const [accessToken, setAccessToken] = useState('');
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastHistory, setBroadcastHistory] = useState([]);
  const [filteredBroadcastHistory, setFilteredBroadcastHistory] = useState([]);

  const fetchBusinessPhoneId = async () => {
    try {
      const response = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });
      setBusinessPhoneNumberId(response.data.whatsapp_data[0].business_phone_number_id);
      setAccountId(response.data.whatsapp_data[0].business_account_id);
      setAccessToken(response.data.whatsapp_data[0].access_token);
      return response.data.whatsapp_data[0];
    } catch (error) {
    //  console.error('Error fetching business phone ID:', error);
    }
  };

  const fetchBroadcastHistory = async () => {
    try {
      const response = await axiosInstance.get(`${fastURL}/get-status/`);
      const formattedHistory = formatBroadcastHistory(response.data);
      setBroadcastHistory(formattedHistory);
      setFilteredBroadcastHistory(formattedHistory);
    } catch (error) {
    //  console.error('Error fetching broadcast history:', error);
    }
  };

  const formatBroadcastHistory = (groupedStatuses) => {
    return Object.entries(groupedStatuses).map(([broadcastGroup, statuses]) => ({
      id: broadcastGroup,
      name: statuses.name ? `${statuses.name}(G)` : statuses.template_name || `Broadcast Group ${broadcastGroup}`,
      sent: statuses.sent,
      delivered: statuses.delivered,
      read: statuses.read,
      replied: statuses.replied,
      failed: statuses.failed,
      status: statuses.delivered ? 'Completed' : 'In Progress'
    }));
  };

  const sendBroadcast = async (selectedPhones, selectedBCGroups, broadcastGroup, selectedTemplate) => {
    if (selectedPhones.length === 0 && selectedBCGroups.length === 0) {
      toast.error("Please select at least one contact or group and enter a message.");
      return false;
    }

    try {
      let bg_id;
      let bg_name;

      const phoneNumbers = [
        ...selectedPhones.map((contact) => parseInt(contact.phone)),
        ...selectedBCGroups.flatMap((bgId) => {
          const bcg = broadcastGroup.find((bg) => bg.id === bgId);
          bg_id = bcg.id;
          bg_name = bcg.name;
          return bcg.members.map(member => parseInt(member.phone));
        })
      ].filter(Boolean);

      const payload = {
        bg_id: bg_id,
        bg_name: bg_name,
        template: {
          id: selectedTemplate.id,
          name: selectedTemplate?.name || "under_name",
        },
        business_phone_number_id: businessPhoneNumberId,
        phoneNumbers: phoneNumbers,
      };

      const response = await axios.post(`${whatsappURL}/send-template/`, payload, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      if (response.status === 200) {
        toast.success("Broadcast message sent successfully!");
        return true;
      }
      return false;
    } catch (error) {
    //  console.error("Error sending broadcast:", error);
      toast.error("Failed to send broadcast message. Please try again.");
      return false;
    }
  };

  return {
    accessToken,
    businessPhoneNumberId,
    accountId,
    broadcasts,
    broadcastHistory,
    filteredBroadcastHistory,
    fetchBusinessPhoneId,
    fetchBroadcastHistory,
    sendBroadcast
  };
};

export const useTemplateManager = (accessToken, accountId) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(null);

  const fetchTemplates = useCallback(async () => {
    if (!accessToken || !accountId) return;
    try {
      const url = `https://graph.facebook.com/v20.0/${accountId}/message_templates?fields=name,status,components,language,category`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const formattedTemplates = response.data.data.map(template => ({
        ...template,
        components: template.components.map(component => {
          if (component.type === "BODY") {
            return {
              ...component,
              text: convertMentionsForFrontend(component.text)
            };
          }
          return component;
        })
      }));
      setTemplates(formattedTemplates);
    } catch (error) {
    //  console.error('Error fetching templates:', error);
    }
  }, [accessToken, accountId]);

  const fetchTemplateDetails = async (templateId) => {
    try {
      const url = `https://graph.facebook.com/v20.0/${templateId}?fields=name,status,components,language`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setSelectedTemplateDetails(response.data);
    } catch (error) {
    //  console.error('Error fetching template details:', error);
    }
  };

  const deleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const url = `https://graph.facebook.com/v20.0/${accountId}/message_templates?name=${templateId}`;
        await axios.delete(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        await fetchTemplates();
        return true;
      } catch (error) {
      //  console.error('Error deleting template:', error);
        return false;
      }
    }
    return false;
  };

  const createTemplate = async (templateData) => {
    try {
      const url = `https://graph.facebook.com/v20.0/${accountId}/message_templates`;
      await axios({
        method: 'post',
        url: url,
        data: templateData,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      await fetchTemplates();
      return true;
    } catch (error) {
    //  console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || error.message || 'An error occurred while creating the template',
        variant: "destructive",
        duration: 5000
      });
      return false;
    }
  };

  useEffect(() => {
    if (accessToken && accountId) {
      fetchTemplates();
    }
  }, [accessToken, accountId, fetchTemplates]);

  return {
    templates,
    selectedTemplate,
    selectedTemplateDetails,
    setSelectedTemplate,
    fetchTemplates,
    fetchTemplateDetails,
    deleteTemplate,
    createTemplate
  };
};

export const useMediaUpload = (accessToken) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMedia = async (file, type = 'image') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
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

      setUploadProgress(100);
      return response.data.body.h;
    } catch (error) {
    //  console.error('Error uploading file:', error);
      setUploadProgress(0);
      throw error;
    }
  };

  return {
    uploadProgress,
    uploadMedia
  };
};