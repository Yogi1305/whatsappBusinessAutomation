import React, { useCallback, useEffect, useRef, useState } from 'react';
import { axiosInstance, fastURL } from '../../../api';
import axios from 'axios';
import { whatsappURL } from '../../../Navbar';
import BroadcastHistory from './BroadcastHistory';
import TemplateMessages from './TemplateMessages';
import { MentionTextArea, convertMentionsForFrontend } from '../../NewFlow/MentionTextArea';
import BroadcastPopup from './BroadcastPopup';
import GroupPopup from './GroupPopup';
import WhatsAppTemplatePopup from './WhatsAppTemplatePopup';
import { toast } from "sonner"; 
//import { Clock, MessageSquare,FileText } from 'lucide-react';
import { History, Rocket, Terminal, FileText, MessageSquare } from 'lucide-react';
import CarouselEditor from './Carousel';
import CampaignsDashboard from './CampaignDash';
import WhatsAppCommands from './Commands';
import { useAuth } from '../../../authContext';
//import CampaignManager from './Campaign';
const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1];
  }
  return null;
};

const initial_bg = [
  
]

const BroadcastPage = () => {
  const { tenant } = useAuth();
  const [loading, setLoading] = useState(false);
const tier = tenant?.tier || 'Free'; 
  const [accessToken, setAccessToken] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [activeTab, setActiveTab] = useState('history');

  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  
  const [showBroadcastPopup, setShowBroadcastPopup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [broadcastGroup, setBroadcastGroup] = useState(initial_bg);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [selectedBCGroups, setSelectedBCGroups] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [headerType, setHeaderType] = useState('text');
  const [headerContent, setHeaderContent] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [buttons, setButtons] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [headerImage, setHeaderImage] = useState(null);
  
  const [broadcastHistory, setBroadcastHistory] = useState([]);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [headerMediaId, setHeaderMediaId] = useState('');
  const [filteredBroadcastHistory, setFilteredBroadcastHistory] = useState([]);
  const [bodyVariables, setBodyVariables] = useState([]);
  const [headerVariables, setHeaderVariables] = useState([]);
  
  const [showGroupPopup, setShowGroupPopup] = useState(false);
  const tenantId = getTenantIdFromUrl();

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
        setAccessToken(response.data.whatsapp_data[0].access_token);
        return response.data.whatsapp_data[0];
      } catch (error) {
        console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);

  const handleEditTemplate = async (template) => {
    // console.log("Selected Template: ", template)
    setIsEditing(true);
    setSelectedTemplate(template);
    setShowTemplatePopup(true);
    setTemplateName(template.name);
    setTemplateId(template.id);
    setCategory(template.category);
    setLanguage(template.language);
    
    const headerComponent = template.components.find(c => c.type === "HEADER");
    // console.log("Editing header component: ", headerComponent)
    if (headerComponent) {
      setHeaderType(headerComponent.format.toLowerCase());
      const headerText = headerComponent?.text
      const example = headerComponent?.example
      const convertedText = convertIndicesToText(headerText, example.header_text)
      setHeaderContent(convertedText)
      // setHeaderContent(headerComponent.text || headerComponent.example?.header_handle?.[0] || '');
    }

    const bodyComponent = template.components.find(c => c.type === "BODY");
    // console.log("Editing body component: ", bodyComponent)
    if (bodyComponent) {
      setBodyText(bodyComponent.text);
    }

    const footerComponent = template.components.find(c => c.type === "FOOTER");
    // console.log("Editing footer component: ", footerComponent)
    if (footerComponent) {
      setFooterText(footerComponent?.text || '');
    }else{
      setFooterText('')
    }

    const buttonsComponent = template.components.find(c => c.type === "BUTTONS");
    // console.log("Editing buttons component: ", buttonsComponent)
    // console.log("Buttons: ", buttons)
    if (buttonsComponent) {
      setButtons(
        buttonsComponent.buttons.map(button => ({
          text: button.text,
          type: button.type,
          ...(button.type === "URL" && { url: convertIndicesToText(button.url, button.example) }),
          ...(button.type === "PHONE_NUMBER" && { phoneNumber: button.phone_number })
        }))
      );
    } else {
      setButtons([]);
    }
    
    // console.log("Buttons editing: ", buttons)
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

  useEffect(() => {
    if (accessToken && accountId) {
      fetchTemplates();
      fetchBroadcastHistory();
    }
  }, [accessToken, accountId, fetchTemplates]);

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

  const handleSendBroadcast = async () => {
    if (selectedPhones.length === 0 && selectedBCGroups.length === 0) {
      toast.error("Please select at least one contact or group and enter a message.", {
        position: "top-right",
        duration: 3000
      });
     
      return;
    }
  
    setIsSendingBroadcast(true);
    
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
        toast.success("Broadcast message sent successfully!", {
          position: "top-center",
          duration: 3000
        });
        handleCloseBroadcastPopup();
      } else {
        throw new Error("Failed to send broadcast");
      }
    } catch (error) {
      console.error("Error sending broadcast:", error);
      toast.error("Failed to send broadcast message. Please try again.", {
        position: "top-center",
        duration: 3000
      });
    
    } finally {
      setIsSendingBroadcast(false);
    }
  };

  const handleCloseBroadcastPopup = () => {
    setShowBroadcastPopup(false);
    setSelectedPhones([]);
    setSelectedBCGroups([]);
    setGroupName('');
    setIsSendingBroadcast(false);
  };

  const handleCloseGroupPopup = () => {
    setShowGroupPopup(false);
    setSelectedPhones([]);
    setSelectedBCGroups([]);
    setGroupName('');
  };
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
  setLoading(true);
    const components = [];
  
    // Handle HEADER component
    if (headerType === 'text' && headerContent.trim()) {
      // Text header
      const headerComponent = {
        type: "HEADER",
        format: "TEXT",
        text: convertBodyTextToIndexedFormat(headerContent), // Convert text to indexed format
      };
  
      if (headerVariables.length > 0) {
        headerComponent.example = {
          header_text: [headerVariables.map(variable => `{{${variable}}}`)], // Array of arrays
        };
      }
  
      components.push(headerComponent);
    } else if (headerType === 'image' && headerMediaId) {
      // Image header
      components.push({
        type: "HEADER",
        format: "IMAGE",
        example: { header_handle: [headerMediaId] }, // Media ID for image
      });
    } else if (headerType === 'video' && headerMediaId) {
      // Video header
      components.push({
        type: "HEADER",
        format: "VIDEO",
        example: { header_handle: [headerMediaId] }, // Media ID for video
      });
    } else if (headerType === 'document' && headerMediaId) {
      // Document header
      components.push({
        type: "HEADER",
        format: "DOCUMENT",
        example: { header_handle: [headerMediaId] }, // Media ID for document
      });
    }
  
    // Handle BODY component
    const bodyComponent = {
      type: "BODY",
      text: convertBodyTextToIndexedFormat(bodyText),
    };
  
    if (bodyVariables.length > 0) {
      bodyComponent.example = {
        body_text: [bodyVariables.map(variable => `{{${variable}}}`)], // Array of arrays
      };
    }
  
    components.push(bodyComponent);
  
    // Handle FOOTER component
    if (footerText.trim()) {
      components.push({
        type: "FOOTER",
        text: footerText,
      });
    }
  
    // Handle BUTTONS component
    if (buttons.length > 0) {
      components.push({
        type: "BUTTONS",
        buttons: buttons.map(button => {
          switch (button.type) {
            case 'QUICK_REPLY':
              return {
                type: "QUICK_REPLY",
                text: button.text,
              };
            case 'PHONE_NUMBER':
              return {
                type: "PHONE_NUMBER",
                text: button.text,
                phone_number: button.phoneNumber,
              };
            case 'URL':
              return {
                type: "URL",
                text: button.text,
                url: button.url,
              };
            default:
              return null;
          }
        }).filter(Boolean),
      });
    }
  
    // Prepare template data
    const templateData = {
      name: templateName,
      category: category,
      components: components,
      language: language,
    };
  
    // Prepare update data (if editing)
    const updateTemplateData = {
      name: templateName, // Include name for updates
      category: category,
      components: components,
      language: language, // Include language for updates
    };
  
    try {
      const url = isEditing
        ? `https://graph.facebook.com/v20.0/${templateId}` // Update URL
        : `https://graph.facebook.com/v20.0/${accountId}/message_templates`;
  
      const response = await axios({
        method: isEditing ? 'POST' : 'POST', // Use POST for both create and update
        url: url,
        data: isEditing ? updateTemplateData : templateData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // Handle success
      setShowTemplatePopup(false);
      resetTemplateForm();
      await fetchTemplates();
      setActiveTab('templates');
      alert("Template created successfully!");
     
    } catch (error) {
      console.error('Error creating/updating template:', error);
  
      // Provide detailed error message
      const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred while creating the template';
      alert(errorMessage);
     
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

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    fetchTemplateDetails(template.id);
  };

  const handleBroadcastMessage = () => {
    setShowBroadcastPopup(true);
  };

  const handleGroup = () => {
    setShowGroupPopup(true);
  };

  const resetTemplateForm = () => {
    setTemplateName('');
    setCategory('');
    setLanguage('');
    setHeaderType('text');
    setHeaderContent('');
    setBodyText('');
    setFooterText('');
    setButtons([]);
    setHeaderImage(null);
    setIsEditing(false);
    setSelectedTemplate(null);
  };
  
  const fetchBroadcastHistory = async () => {
    try {
      const response = await axiosInstance.get(`${fastURL}/get-status/`);
      const formattedHistory = formatBroadcastHistory(response.data);
      setBroadcastHistory(formattedHistory);
      setFilteredBroadcastHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching broadcast history:', error);
    }
  };

 

  const formatBroadcastHistory = (groupedStatuses) => {
    return Object.entries(groupedStatuses).map(([broadcastGroup, statuses]) => ({
      id: broadcastGroup,
      name: statuses.name ? `${statuses.name}(G)` : statuses.template_name ||`Broadcast Group ${broadcastGroup}`,
      sent: statuses.sent,
      delivered: statuses.delivered,
      read: statuses.read,
      replied: statuses.replied,
      failed: statuses.failed,
      status: statuses.delivered ? 'Completed' : 'In Progress'
    }));
  }



  const handleBCGroupSelection = (bgId) => {
    console.log("Broadcast::::::::", bgId)
    setSelectedBCGroups(prevSelected => 
      prevSelected.includes(bgId)
        ? prevSelected.filter(id => id !== bgId)
        : [...prevSelected, bgId]
    );
  };


 
  const addButton = () => {
    setButtons([...buttons, { type: 'QUICK_REPLY', text: '' }]);
  };


  const updateButton = (index, field, value) => {
    const updatedButtons = buttons.map((button, i) => 
      i === index ? { ...button, [field]: value } : button
    );
    setButtons(updatedButtons);
  };

  const extractVariables = (text) => {
    console.log("Test: ", text)
    const regex = /@([\w.]+)/g; // Updated regex to allow dots in variable names
    const matches = text.match(regex);
    console.log("MAtched: ", matches)
    return matches ? matches.map(match => match.slice(1)) : [];
  };

  const convertBodyTextToIndexedFormat = (text) => {
    let indexCounter = 1;
    return text.replace(/@([\w.]+)/g, () => `{{${indexCounter++}}}`);
  };

  const convertIndicesToText = (headerContent, example) => {
    if (!headerContent || !example) {
      return headerContent; // Return original text if inputs are invalid
    }
  
    // Process example array to replace {{contact.name}} with @contact.name
    const formattedExample = example.map(item =>
      item.replace(/\{\{([\w.]+)\}\}/g, "@$1")
    );
  
    // Replace placeholders like {{1}}, {{2}}, etc.
    const replacedText = headerContent.replace(/\{\{(\d+)\}\}/g, (match, index) => {
      const arrayIndex = parseInt(index, 10) - 1;
  
      if (arrayIndex >= 0 && arrayIndex < formattedExample.length) {
        return formattedExample[arrayIndex];
      }
  
      return match; // Keep placeholder if index is invalid
    });
  
    console.log("Replaced text:", replacedText);
    return replacedText;
  };


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') {
      fetchBroadcastHistory();
      fetchTemplates();
    }
  };

  const deleteButton = (index) => {
    const updatedButtons = buttons.filter((_, i) => i !== index);
    setButtons(updatedButtons);
  };

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setHeaderImage(selectedFile);
      setHeaderContent(URL.createObjectURL(selectedFile));
  
      try {
        console.log('Uploading file to WhatsApp Media API...');
  
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', selectedFile.type.split('/')[0]); // Automatically detect type (image, video, audio, etc.)
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
  
        console.log('File uploaded to WhatsApp, ID:', response.data.body.h);
        setHeaderMediaId(response.data.body.h); // Save the media ID for later use
        setUploadProgress(100);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadProgress(0);
      }
    }
  };
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      setIsBottomNavVisible(st < lastScrollTop);
      lastScrollTop = st <= 0 ? 0 : st;
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="flex min-h-screen">
   <div className="hidden md:block w-64 bg-white border-r border-gray-200 shadow-sm">
  <div className="px-3 py-4 space-y-1">
    {/* Broadcast History */}
    <div
      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer
        ${activeTab === 'history' 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
        }`}
      onClick={() => handleTabChange('history')}
    >
      <div className="flex items-center space-x-3">
        <History className="w-5 h-5" /> {/* Changed to History icon */}
        <span>Broadcast History</span>
      </div>
    </div>

    {/* Template Messages */}
    <div
      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer
        ${activeTab === 'templates' 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
        }`}
      onClick={() => handleTabChange('templates')}
    >
      <div className="flex items-center space-x-3">
      <FileText className="w-5 h-5" />  {/* Changed to Template icon */}
        <span>Template Messages</span>
      </div>
    </div>

    {/* Campaigns */}
    <div
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            tier === 'enterprise' ? 'cursor-pointer hover:bg-gray-100' : 'cursor-not-allowed opacity-50'
          }
            ${activeTab === 'campaigns' 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'text-gray-700'
            }`}
          onClick={tier === 'enterprise' ? () => handleTabChange('campaigns') : undefined}
        >
      <div className="flex items-center space-x-3">
        <Rocket className="w-5 h-5" /> {/* Changed to Rocket icon */}
        <span>Drip Campaigns</span>
      </div>
    </div>

    {/* Commands */}
    <div
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            tier === 'enterprise' ? 'cursor-pointer hover:bg-gray-100' : 'cursor-not-allowed opacity-50'
          }
            ${activeTab === 'commands' 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'text-gray-700'
            }`}
          onClick={tier === 'enterprise' ? () => handleTabChange('commands') : undefined}
        >
      <div className="flex items-center space-x-3">
        <Terminal className="w-5 h-5" /> {/* Changed to Terminal icon */}
        <span>Commands</span>
      </div>
    </div>
  </div>
</div>
      {/*Mobile Sidebar to TopBar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t z-50">
  <div className="grid grid-cols-2">
    <button 
      onClick={() => handleTabChange('history')}
      className={`flex flex-col items-center justify-center py-3 transition-all duration-200 ease-in-out
        ${activeTab === 'history' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:bg-gray-100'}
      `}
    >
      <History className="w-5 h-5 mb-1" /> {/* Changed to History icon */}
      <span className="text-xs font-medium">History</span>
    </button>
    <button 
      onClick={() => handleTabChange('templates')}
      className={`flex flex-col items-center justify-center py-3 transition-all duration-200 ease-in-out
        ${activeTab === 'templates' ? 'text-primary bg-primary/10' : 'text-gray-600 hover:bg-gray-100'}
      `}
    >
      <FileText className="w-5 h-5" />  {/* Changed to Template icon */}
      <span className="text-xs font-medium">Templates</span>
    </button>
  </div>
</div>
      <div className="flex-1 p-6" style={{marginBottom:'30px'}}>
        {activeTab === 'history' && (
          <BroadcastHistory
            broadcastHistory={broadcastHistory}
            filteredBroadcastHistory={filteredBroadcastHistory}
            handleBroadcastMessage={handleBroadcastMessage}
            handleGroup={handleGroup}
            showBroadcastPopup={showBroadcastPopup}
            templates={templates}
            selectedTemplate={selectedTemplate}
            contacts={contacts}
            broadcastGroup={broadcastGroup}
            selectedPhones={selectedPhones}
            selectedBCGroups={selectedBCGroups}
            isSendingBroadcast={isSendingBroadcast}
            handleTemplateClick={handleTemplateClick}
            setShowTemplatePopup={setShowTemplatePopup}
            handleBCGroupSelection={handleBCGroupSelection}
            handleSendBroadcast={handleSendBroadcast}
            handleCloseBroadcastPopup={handleCloseBroadcastPopup}
            showGroupPopup={showGroupPopup}
            groupName={groupName}
            setGroupName={setGroupName}
            setIsSendingBroadcast={setIsSendingBroadcast}
            handleCloseGroupPopup={handleCloseGroupPopup}
            BroadcastPopup={BroadcastPopup}
            GroupPopup={GroupPopup}
          />
        )}

        {activeTab === 'templates' && (
          <TemplateMessages
            templates={templates}
            resetTemplateForm={resetTemplateForm}
            setShowTemplatePopup={setShowTemplatePopup}
            handleEditTemplate={handleEditTemplate}
            handleDeleteTemplate={handleDeleteTemplate}
            setShowPopup={setShowPopup}
          />
        )}
      
        {activeTab === 'campaigns' && tier === 'enterprise'&&(
            <CampaignsDashboard
              templates={templates}
              contacts={contacts}
              broadcastGroups={broadcastGroup}
              handleCreateCampaign={handleDeleteTemplate}
              showTemplatePopup={showTemplatePopup}
              setShowTemplatePopup={setShowTemplatePopup}
              accountId={accountId}
              accessToken={accessToken}
              businessPhoneNumberId={businessPhoneNumberId}
            />
          )}
           {activeTab === 'commands' && tier === 'enterprise'&&(
            <WhatsAppCommands
            />
          )}
          <div>
      {showPopup && (
        <CarouselEditor
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          accessToken={accessToken}
          accountId={accountId}
          uploadProgress={uploadProgress}
          setActiveTab={setActiveTab}
          fetchTemplates={fetchTemplates}
        />
      )}
    </div>
        <WhatsAppTemplatePopup
          showTemplatePopup={showTemplatePopup}
          isEditing={isEditing}
          templateName={templateName}
          category={category}
          language={language}
          headerType={headerType}
          headerContent={headerContent}
          headerImage={headerImage}
          bodyText={bodyText}
          footerText={footerText}
          buttons={buttons}
          uploadProgress={uploadProgress}
          setTemplateName={setTemplateName}
          setCategory={setCategory}
          setLanguage={setLanguage}
          setHeaderType={setHeaderType}
          setHeaderContent={setHeaderContent}
          handleImageUpload={handleImageUpload}
          setBodyText={setBodyText}
          setFooterText={setFooterText}
          updateButton={updateButton}
          deleteButton={deleteButton}
          addButton={addButton}
          handleCreateTemplate={handleCreateTemplate}
          setShowTemplatePopup={setShowTemplatePopup}
          resetTemplateForm={resetTemplateForm}
          setBodyVariables={setBodyVariables}
          setHeaderVariables={setHeaderVariables}
          extractVariables={extractVariables}
          convertMentionsForFrontend={convertMentionsForFrontend}
          MentionTextArea={MentionTextArea}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
     
      
    </div>
  );
};

export default BroadcastPage;