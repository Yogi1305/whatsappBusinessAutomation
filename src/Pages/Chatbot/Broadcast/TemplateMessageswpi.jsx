import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useCallback, useEffect, useRef, useState } from 'react';
import { axiosInstance, fastURL } from '../../../api';
import axios from 'axios';
import { MentionTextArea, convertMentionsForFrontend } from '../../NewFlow/MentionTextArea';


const getTenantIdFromUrl = () => {
    const pathArray = window.location.pathname.split('/');
    if (pathArray.length >= 2) {
      return pathArray[1];
    }
    return null;
  };
const TemplateMessages = ({
  fetchBroadcastHistory,
  resetTemplateForm,
  setShowTemplatePopup,
  templates
 
}) => {
    
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(null);
    const [accessToken, setaccessToken] = useState('');
    const [accountId, setAccountId] = useState('');
    const tenantId = getTenantIdFromUrl();
    const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const handleEditTemplate = async (template) => {
    setIsEditing(true);
    setSelectedTemplate(template);
    setShowTemplatePopup(true);
    setTemplateName(template.name);
    setCategory(template.category);
    setLanguage(template.language);
    
    const headerComponent = template.components.find(c => c.type === "HEADER");
    if (headerComponent) {
      setHeaderType(headerComponent.format.toLowerCase());
      setHeaderContent(headerComponent.text || headerComponent.example?.header_handle?.[0] || '');
    }

    const bodyComponent = template.components.find(c => c.type === "BODY");
    if (bodyComponent) {
      setBodyText(bodyComponent.text);
    }

    const footerComponent = template.components.find(c => c.type === "FOOTER");
    if (footerComponent) {
      setFooterText(footerComponent.text);
    }

    const buttonsComponent = template.components.find(c => c.type === "BUTTONS");
    if (buttonsComponent) {
      setButtons(buttonsComponent.buttons.map(button => ({ text: button.text })));
    } else {
      setButtons([]);
    }
  };
  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const url = `https://graph.facebook.com/v20.0/${accountId}/message_templates?name=${templateId}`;
        await axios.delete(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        await fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };
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
      console.error('Error fetching template details:', error);
    }
  };
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
      console.error('Error fetching templates:', error);
    }
  }, [accessToken, accountId]);
  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    fetchTemplateDetails(template.id);
  };
  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        const response = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
          headers: {
            'X-Tenant-ID': tenantId
          }
        });
        setBusinessPhoneNumberId(response.data.whatsapp_data[0].business_phone_number_id);
        setAccountId(response.data.whatsapp_data[0].business_account_id);
        setaccessToken(response.data.whatsapp_data[0].access_token);
        return response.data.whatsapp_data;
      } catch (error) {
        console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);
  
  useEffect(() => {
    if (accessToken && accountId) {
      fetchTemplates();
      fetchTemplateDetails();
      
    }
  }, [accessToken, accountId, fetchTemplates]);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">Template Messages</h1>
        <button
          onClick={() => {
            resetTemplateForm();
            setShowTemplatePopup(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                    ${template.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                      template.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {template.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>Category: {template.category}</p>
                  <p>Language: {template.language}</p>
                  <p className="line-clamp-2">
                    Body: {template.components.find(c => c.type === "BODY")?.text}
                  </p>
                  {template.components.find(c => c.type === "BUTTONS") && (
                    <p>
                      Buttons: {template.components.find(c => c.type === "BUTTONS").buttons.length}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.name)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateMessages;