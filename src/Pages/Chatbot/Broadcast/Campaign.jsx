import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  Plus, X, MessageSquare, Clock,
  ChevronRight, Sparkles, Trash2,
  Upload, Search, Users, Save,
  AlertCircle, CheckCircle2, Copy,
  Send, Edit2, Wand2
} from 'lucide-react';
import WhatsAppTemplatePopup from './WhatsAppTemplatePopup';
//import { suggestedSequences } from './suggestedSequences'; // Import the seque
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import axiosInstance, { djangoURL } from '../../../api';
import { toast } from 'react-toastify';

var campaignName = 'new';
const suggestedSequences = [
  {
    id: 1,
    name: `${campaignName}_${Math.random().toString(36).substring(7)}`,
    description: "Short personalized opener with industry context",
    aiPrompt: "Create brief, personalized first touch messages focusing on specific value props",
    messages: [
      {
        content: `Hi {{firstName}}! I'm {{senderName}} from {{companyName}}. Noticed {{companyName}} is helping {{competitorCustomer}} with {{specificPainPoint}} in {{industry}} - would love to share how we could help {{prospectCompany}} too.`,
        timeDelay: 0,
        status: "delivered"
      },
      {
        content: `Hey {{firstName}}, following up on {{productName}} for {{prospectCompany}}'s {{useCase}} needs. We helped {{referenceBrand}} achieve {{specificResult}} in just {{timeframe}}. 

Quick chat this week to explore if we could do the same for your team?`,
        timeDelay: 1440,
        status: "read"
      },
      {
        content: `Hi {{firstName}}, 

Given your focus on {{businessInitiative}} at {{prospectCompany}}, thought you'd find this interesting:

{{competitorCustomer}} saw {{metricImprovement}} after implementing our {{productFeature}} for their {{teamSize}}-person team.

15min call to discuss your {{specificPainPoint}}?`,
        timeDelay: 4320,
        status: "read"
      }
    ]
  },
  {
    id: 2,
    name: `${campaignName}_${Math.random().toString(36).substring(7)}`,
    description: "Problem-centric conversation starter",
    aiPrompt: "Create messages that focus on prospect's specific pain points with social proof",
    messages: [
      {
        content: `Hi {{firstName}}! Saw {{prospectCompany}}'s post about {{recentAnnouncement}}. We're helping {{industryPeer}} tackle {{painPoint}} - thought you might be interested in their approach?`,
        timeDelay: 0,
        status: "delivered"
      },
      {
        content: `Hello {{firstName}}, {{senderName}} again. Just learned about {{prospectCompany}}'s {{initiative}} from {{newsSource}}. 

Our {{solution}} helped {{referenceBrand}} achieve {{specificOutcome}} during their similar project. Worth a quick discussion?`,
        timeDelay: 1440,
        status: "read"
      },
      {
        content: `Hi {{firstName}},

Quick update: We just launched {{newFeature}} specifically for {{industry}} companies scaling {{businessFunction}}.

{{referenceBrand}} saw {{metricImprovement}} within {{timeframe}}. Would this interest your team at {{prospectCompany}}?`,
        timeDelay: 2880,
        status: "read"
      }
    ]
  },
  {
    id: 3,
    name: `${campaignName}_${Math.random().toString(36).substring(7)}`,
    description: "Trigger event-based outreach",
    aiPrompt: "Create timely messages based on trigger events and news",
    messages: [
      {
        content: `Hi {{firstName}}! Noticed {{prospectCompany}}'s {{triggerEvent}}. We recently helped {{competitorName}} solve {{relatedChallenge}} - thought you might find their approach interesting?`,
        timeDelay: 0,
        status: "delivered"
      },
      {
        content: `Hey {{firstName}}, after {{prospectCompany}}'s {{announcement}}, wanted to share how {{industryPeer}} achieved {{specificResult}} using our {{productFeature}}.

Quick call to discuss your {{businessGoal}}?`,
        timeDelay: 1440,
        status: "read"
      },
      {
        content: `Hi {{firstName}},

Given {{prospectCompany}}'s focus on {{strategicInitiative}}, thought you'd be interested:

{{competitorCustomer}} just achieved {{businessOutcome}} using our {{solution}} in {{timeframe}}.

15min this week to explore possibilities?`,
        timeDelay: 4320,
        status: "read"
      }
    ]
  }
];

const WhatsAppCampaign = ({
  templates = [],
  onCreateTemplate,
  onSaveCampaign,
  showTemplatePopup,
  setShowTemplatePopup,
  accountId,
  accessToken,
  initialData = null,
  isEditing = false
}) => {
  const [sequence, setSequence] = useState([]);
  const [campaignName, setCampaignName] = useState('new');
  const [prospects, setProspects] = useState([]);
  const [selectedProspects, setSelectedProspects] = useState(
    initialData?.selectedProspects?.map(p => p.id) || []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [selectedNodeForTemplate, setSelectedNodeForTemplate] = useState(null);
  const [pendingApprovalTemplates, setPendingApprovalTemplates] = useState([]);
  const [showSuggestedSequences, setShowSuggestedSequences] = useState(false);
  const [editingSuggested, setEditingSuggested] = useState(null);
  const [editedSequence, setEditedSequence] = useState(null);
  const [newProspect, setNewProspect] = useState({
    name: '',
    phone: '',
    email: '',
    company: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHeaders, setFileHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (initialData && isEditing) {
      const convertedSequence = initialData.sequence.map(node => ({
        id: Date.now() + Math.random(),
        name: node.name || '',
        next: node.next,
        index: node.index,
        status: node.status || 'read',
        timeDelay: node.timeDelay || 60,
        templateId: node.templateId || '',
        isApproved: true,
        isPendingApproval: false
      }));

      setSequence(convertedSequence);
      setCampaignName(initialData.name);
      setProspects(initialData.selectedProspects);
      setSelectedProspects(initialData.selectedProspects.map(p => p.id));
    }
  }, [initialData, isEditing]);

  const extractVariablesFromTemplates = () => {
    const variables = new Set();

    sequence.forEach(node => {
      const template = templates.find(t => t.id === node.templateId) ||
                      pendingApprovalTemplates.find(t => t.id === node.templateId);
      if (template?.content) {
        const matches = template.content.match(/{{(.*?)}}/g);
        if (matches) {
          matches.forEach(match => {
            variables.add(match.replace(/[{}]/g, ''));
          });
        }
      }
    });

    return Array.from(variables);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(header => header.trim());
          setFileHeaders(headers);
          setSelectedFile(file);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          setUploadError('Failed to parse CSV file. Please ensure it is properly formatted.');
        }
      };
      reader.readAsText(file);
    }
  };

  const isColumnMappingValid = () => {
    const variables = extractVariablesFromTemplates();
    return variables.every(variable => columnMapping[variable]);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first.");
      return;
    }

    if (!isColumnMappingValid()) {
      setUploadError("Please map all variables to columns.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('model_name', "Contact");
    formData.append('column_mapping', JSON.stringify(columnMapping));

    try {
      const response = await axiosInstance.post(`${djangoURL}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Contacts uploaded successfully!");
    //   fetchContacts(); Refresh contact list

      // Reset file input and state
      setSelectedFile(null);
      setFileHeaders([]);
      setColumnMapping({});
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload contacts. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const ColumnMappingSection = () => {
    const variables = extractVariablesFromTemplates();

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Map Columns to Variables</h3>
        {variables.map(variable => (
          <div key={variable} className="flex items-center gap-4">
            <span style={{marginRight:'20px'}}className="w-32 font-medium">{variable}</span>
            <Select
              value={columnMapping[variable] || ''}
              onValueChange={(value) => setColumnMapping(prev => ({ ...prev, [variable]: value }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {fileHeaders.map(header => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    );
  };

  const handleCreateTemplate = async (templateData) => {
    if (selectedNodeForTemplate) {
      try {
        // Add template to pending approval with the name from templateData
        const newPendingTemplate = {
          ...templateData,
          id: Date.now(),
          status: 'pending',
          name: templateData.name // Ensure name is included from template data
        };
        
        setPendingApprovalTemplates([...pendingApprovalTemplates, newPendingTemplate]);
        
        // Update sequence node with pending template and its name
        updateNode(selectedNodeForTemplate, {
          templateId: newPendingTemplate.id,
          name: templateData.name, // Set the name here
          isPendingApproval: true
        });
      } catch (error) {
        console.error('Error creating template:', error);
        alert("Failed to create template");
      }
      setShowTemplatePopup(false);
    }
  };
  
  const handleEditSuggested = (sequence) => {
    setEditingSuggested(sequence.id);
    setEditedSequence({...sequence});
  };

  // Add function to save edited suggested sequence
  const handleSaveSuggestedEdit = () => {
    if (editedSequence) {
      // Update the suggested sequences array
      const updatedSuggestions = suggestedSequences.map(seq =>
        seq.id === editedSequence.id ? editedSequence : seq
      );
      // Update the global suggested sequences (you'll need to implement this)
      // setSuggestedSequences(updatedSuggestions);
      setEditingSuggested(null);
      setEditedSequence(null);
    }
  };


  const convertBodyTextToIndexedFormat = (text) => {
    let indexCounter = 1;
    return text.replace(/@(\w+)/g, () => `{{${indexCounter++}}}`);
  };

  const handleSendForApproval = async (nodeId) => {
    const node = sequence.find(n => n.id === nodeId);
    const template = pendingApprovalTemplates.find(t => t.id === node.templateId);
    
    if (template) {
      try {
        // Prepare components based on template data
        const components = [];
        
        // Add header if present
        if (template.headerType) {
          components.push({
            type: "HEADER",
            format: template.headerType.toUpperCase(),
            text: template.headerType === 'text' ? convertBodyTextToIndexedFormat(template.headerContent) : undefined,
            example: template.headerType === 'image' ? { header_handle: [template.headerMediaId] } : undefined,
          });
        }
  
        // Add body component
        const bodyComponent = {
          type: "BODY",
          text: convertBodyTextToIndexedFormat(template.content),
        };
  
        if (template.variables && template.variables.length > 0) {
          bodyComponent.example = {
            body_text: [template.variables.map(variable => `{{${variable}}}`)]
          };
        }
  
        components.push(bodyComponent);
  
        // Add footer if present
        if (template.footerText?.trim()) {
          components.push({
            type: "FOOTER",
            text: template.footerText
          });
        }
  
        // Add buttons if present
        if (template.buttons?.length > 0) {
          components.push({
            type: "BUTTONS",
            buttons: template.buttons.map(button => {
              switch (button.type) {
                case 'QUICK_REPLY':
                  return { type: "QUICK_REPLY", text: button.text };
                case 'PHONE_NUMBER':
                  return { type: "PHONE_NUMBER", text: button.text, phone_number: button.phoneNumber };
                case 'URL':
                  return { type: "URL", text: button.text, url: button.url };
                default:
                  return null;
              }
            }).filter(Boolean)
          });
        }
  
        const fbTemplateData = {
          name: template.name,
          category: template.category || 'MARKETING', // Default category if not provided
          components: components,
          language: template.language || 'en' // Default language if not provided
        };
  
        const response = await axios({
          method: 'post',
          url: `https://graph.facebook.com/v20.0/${accountId}/message_templates`,
          data: fbTemplateData,
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
  
        // Update sequence node with the approved template
      
        updateNode(nodeId, {
          templateId: template.id,
          name: template.name,
          isPendingApproval: false,
          isApproved: true  // Add this new flag
        });
        
        // Update pending templates status
        setPendingApprovalTemplates(prev =>
          prev.map(t => t.id === template.id ? {...t, status: 'approved'} : t)
        );
  
        // Show success notification
        alert("Template approved successfully");
  
      } catch (error) {
        console.error('Error sending template for approval:', error);
        alert('Failed to send template for approval');
      }
    }
  };
  const addSequenceNode = () => {
    const newNode = {
      id: Date.now(),
      name: '',
      next: sequence.length === 0 ? null : sequence.length + 1,
      index: sequence.length + 1,
      status: 'read',
      timeDelay: 60,
      templateId: ''
    };
    setSequence([...sequence, newNode]);
  };

  const updateNode = (nodeId, updates) => {
    setSequence(sequence.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const deleteNode = (index) => {
    const newSequence = sequence.filter(node => node.index !== index);
    newSequence.forEach((node, idx) => {
      node.index = idx + 1;
      if (node.next) {
        node.next = idx === newSequence.length - 1 ? null : idx + 2;
      }
    });
    setSequence(newSequence);
  };

  const importSuggestedSequence = (suggestedSequence) => {
    const newSequence = suggestedSequence.messages.map((msg, index) => {
      // Create a pending template for each message
      const pendingTemplate = {
        id: Date.now() + index,
        name: `${suggestedSequence.name}${index + 1}`,
        content: msg.content,
        status: 'pending'
      };
      
      setPendingApprovalTemplates(prev => [...prev, pendingTemplate]);
      
      return {
        id: Date.now() + index,
        name: pendingTemplate.name,
        next: index === suggestedSequence.messages.length - 1 ? null : index + 2,
        index: index + 1,
        status: msg.status,
        timeDelay: msg.timeDelay,
        templateId: pendingTemplate.id,
        isPendingApproval: true
      };
    });
    
    setSequence(newSequence);
    setShowSuggestedSequences(false);
  };

  // Validation functions
  const isSequenceValid = useMemo(() => {
    return sequence.every(node => 
      node.templateId && 
      node.timeDelay > 0 && 
      node.status
    );
  }, [sequence]);

  const isFormValid = useMemo(() => {
    const hasCampaignName = campaignName.trim().length > 0;
    const hasProspects = selectedProspects.length > 0;
    const hasSequence = sequence.length > 0;
    
    return hasCampaignName && hasProspects && hasSequence && isSequenceValid;
  }, [campaignName, selectedProspects, sequence, isSequenceValid]);

  const getValidationMessages = () => {
    const messages = [];
    if (!campaignName.trim()) messages.push('Campaign name is required');
    if (sequence.length === 0) messages.push('At least one message is required');
    if (!isSequenceValid) messages.push('All messages must have a template and valid delay');
    if (selectedProspects.length === 0) messages.push('At least one prospect must be selected');
    return messages;
  };


  // Prospect handling functions
  const handleAddProspect = () => {
    if (newProspect.name && newProspect.phone) {
      setProspects([...prospects, { ...newProspect, id: Date.now() }]);
      setNewProspect({ name: '', phone: '', email: '', company: '' });
      setShowAddDialog(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProspects(filteredProspects.map(p => p.id));
    } else {
      setSelectedProspects([]);
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    // Return false if prospect is null/undefined
    if (!prospect) return false;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    // Safely check each field with optional chaining and nullish coalescing
    const nameMatch = prospect.name?.toLowerCase()?.includes(searchTermLower) ?? false;
    const phoneMatch = prospect.phone?.includes(searchTerm) ?? false;
    const emailMatch = prospect.email?.toLowerCase()?.includes(searchTermLower) ?? false;
    const companyMatch = prospect.company?.toLowerCase()?.includes(searchTermLower) ?? false;
    
    return nameMatch || phoneMatch || emailMatch || companyMatch;
  });

  // Save campaign handler
  const handleSaveCampaign = async () => {
    setShowValidation(true);
    
    if (!isFormValid) {
      return;
    }

    const phoneNumbers = prospects
      .filter(p => selectedProspects.includes(p.id))
      .map(p => parseInt(p.phone.replace(/\D/g, '')));

    const templatesData = sequence.map((node, index) => {
      const template = templates.find(t => t.id === node.templateId) ||
                      pendingApprovalTemplates.find(t => t.id === node.templateId);
      const isLastNode = index === sequence.length - 1;
      
      return {
        index: index + 1,
        name: template?.name || '',
        timeDelay: node.timeDelay,
        status: node.status,
        next: isLastNode ? null : index + 2,
        ...(isLastNode && { terminal: true })
      };
    });

    const campaignData = {
      name: campaignName,
      phone: phoneNumbers,
      templates_data: templatesData
    };

    try {
      const response = await axiosInstance[isEditing ? 'put' : 'post'](
        `${djangoURL}/campaign/${isEditing ? `?id=${initialData.id}` : ''}`,
        campaignData
      );
    
      if (response.status === 200) {
        onSaveCampaign(campaignData);
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const TemplateSelector = ({ nodeId, currentTemplateId }) => {
    const node = sequence.find(n => n.id === nodeId);
    
    // Look for template in both templates array and pending templates
    const currentTemplate = templates.find(t => t.id === currentTemplateId) ||
                          pendingApprovalTemplates.find(t => t.id === currentTemplateId);
    
    // If we're editing and have a name but no template (from initial data)
    const templateName = node?.name || currentTemplate?.name || 'Select Template';
    
    const isApproved = node?.isApproved;
    const isPendingApproval = node?.isPendingApproval;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start hover:bg-gray-50 border-dashed"
          >
            <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
            {templateName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <div className="max-h-64 overflow-y-auto">
            {templates.map(template => (
              <DropdownMenuItem 
                key={template.id}
                onClick={() => updateNode(nodeId, { 
                  templateId: template.id,
                  name: template.name,
                  isPendingApproval: false,
                  isApproved: true
                })}
                className="hover:bg-blue-50"
              >
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                  {template.name}
                </div>
              </DropdownMenuItem>
            ))}
            {pendingApprovalTemplates
              .filter(t => t.status === 'approved')
              .map(template => (
                <DropdownMenuItem 
                  key={template.id}
                  onClick={() => updateNode(nodeId, { 
                    templateId: template.id,
                    name: template.name, // Ensure name is set when selecting approved template
                    isPendingApproval: false,
                    isApproved: true
                  })}
                  className="hover:bg-blue-50"
                >
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                    {template.name}
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      Approved
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="hover:bg-green-50"
            onClick={() => {
              setSelectedNodeForTemplate(nodeId);
              setShowTemplatePopup(true);
            }}
          >
            <Sparkles className="w-4 h-4 mr-2 text-green-500" />
            Create New Template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Suggested sequences component
  const SuggestedSequences = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Suggested Sequences</h3>
        <Button
          variant="ghost"
          onClick={() => setShowSuggestedSequences(!showSuggestedSequences)}
          className="text-blue-600"
        >
          {showSuggestedSequences ? 'Hide Suggestions' : 'Show Suggestions'}
        </Button>
      </div>

      {showSuggestedSequences && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {suggestedSequences.map((sequence) => (
            <Card key={sequence.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  {editingSuggested === sequence.id ? (
                    <Input
                      value={editedSequence.name}
                      onChange={(e) => setEditedSequence({
                        ...editedSequence,
                        name: e.target.value
                      })}
                      className="max-w-[200px]"
                    />
                  ) : (
                    sequence.name
                  )}
                  <div className="flex gap-2">
                    {editingSuggested === sequence.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSaveSuggestedEdit}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSuggested(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSuggested(sequence)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => importSuggestedSequence(sequence)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
                {editingSuggested === sequence.id ? (
                  <Input
                    value={editedSequence.description}
                    onChange={(e) => setEditedSequence({
                      ...editedSequence,
                      description: e.target.value
                    })}
                    className="mt-2"
                  />
                ) : (
                  <p className="text-sm text-gray-500">{sequence.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(editingSuggested === sequence.id ? editedSequence : sequence).messages.map((message, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg max-w-[80%] bg-green-50 border-green-100"
                    >
                      {editingSuggested === sequence.id ? (
                        <Input
                          value={message.content}
                          onChange={(e) => {
                            const updatedMessages = [...editedSequence.messages];
                            updatedMessages[index] = {
                              ...updatedMessages[index],
                              content: e.target.value
                            };
                            setEditedSequence({
                              ...editedSequence,
                              messages: updatedMessages
                            });
                          }}
                          className="mb-2"
                        />
                      ) : (
                        <div className="text-sm">{message.content}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        {editingSuggested === sequence.id ? (
                          <Input
                            type="number"
                            value={message.timeDelay}
                            onChange={(e) => {
                              const updatedMessages = [...editedSequence.messages];
                              updatedMessages[index] = {
                                ...updatedMessages[index],
                                timeDelay: parseInt(e.target.value)
                              };
                              setEditedSequence({
                                ...editedSequence,
                                messages: updatedMessages
                              });
                            }}
                            className="w-24"
                          />
                        ) : (
                          message.timeDelay === 0 ? 'Immediate' : `After ${message.timeDelay / 60} hours`
                        )}
                        <Clock className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Create Campaign
        </h2>
        <p className="text-gray-500 mt-1">Design your WhatsApp campaign sequence and manage prospects</p>
      </div>
      <div className="space-y-2">
        <Button
          onClick={handleSaveCampaign}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          <Save className="w-4 h-4" />
          Save Campaign
        </Button>
        
        {showValidation && !isFormValid && (
          <div className="text-sm text-red-500">
            {getValidationMessages().map((message, index) => (
              <div key={index} className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Campaign Name Input */}
    <Input
      placeholder="Enter campaign name..."
      value={campaignName}
      onChange={(e) => setCampaignName(e.target.value)}
      className={`max-w-md text-lg ${showValidation && !campaignName.trim() ? 'border-red-500' : ''}`}
    />

    {/* Main Content */}
    <Tabs defaultValue="sequence" className="w-full">
      <TabsList className="w-full max-w-md">
        <TabsTrigger 
          value="sequence" 
          className="flex-1 data-[state=active]:bg-blue-50"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Sequence Builder
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="prospects" 
          className="flex-1 data-[state=active]:bg-green-50"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Prospects ({selectedProspects.length})
          </div>
        </TabsTrigger>
      </TabsList>

      {/* Sequence Builder Tab */}
      <TabsContent value="sequence">
        {showTemplatePopup && (
          <WhatsAppTemplatePopup
            onSubmit={handleCreateTemplate}
            onClose={() => setShowTemplatePopup(false)}
          />
        )}
        
        <SuggestedSequences />
        
        <div className="relative min-h-[500px] bg-gradient-to-b from-gray-50 to-white rounded-lg p-8 border border-dashed">
          {sequence.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-gray-400">No messages in sequence</div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={addSequenceNode}
                  className="flex items-center gap-2 border-dashed hover:border-blue-500 hover:text-blue-500"
                >
                  <Plus className="w-5 h-5" />
                  Add First Message
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {sequence.map((node, index) => (
                <div key={node.id} className="relative">
                  {index > 0 && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="h-12 w-px bg-gradient-to-b from-blue-200 to-green-200"></div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45">
                        <ChevronRight className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                  )}
                  
                  <Card className="border-2 border-gray-100 hover:border-blue-100 transition-all max-w-2xl mx-auto shadow-sm hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <TemplateSelector 
                              nodeId={node.id}
                              currentTemplateId={node.templateId}
                            />
                          </div>
                          {node.isPendingApproval && !node.isApproved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendForApproval(node.id)}
                              className="hover:bg-green-50"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Send for Approval
                            </Button>
                          )}
                          {node.isApproved && (
                            <span className="text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              Approved
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNode(node.index)}
                            className="hover:bg-red-50 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        {node.templateId && (
                          <div className={`p-4 rounded-md border ${
                            node.isApproved ? 'bg-green-50 border-green-100' :
                            node.isPendingApproval ? 'bg-yellow-50 border-yellow-100' : 
                            'bg-blue-50 border-blue-100'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-blue-700">
                                {(templates.find(t => t.id === node.templateId) ||
                                  pendingApprovalTemplates.find(t => t.id === node.templateId))?.name}
                              </div>
                              {node.isPendingApproval && !node.isApproved && (
                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                                  Pending Approval
                                </span>
                              )}
                              {node.isApproved && (
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                  Approved Template
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-blue-600 mt-2">
                              {(templates.find(t => t.id === node.templateId) ||
                                pendingApprovalTemplates.find(t => t.id === node.templateId))?.content}
                            </div>
                          </div>
                        )}  

                        <div className="flex items-center gap-4 pt-2">
                          <Select
                            value={node.status}
                            onValueChange={(value) => updateNode(node.id, { status: value })}
                          >
                            <SelectTrigger className="w-40 bg-gray-50">
                              <SelectValue placeholder="Select trigger" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="read">After read</SelectItem>
                              <SelectItem value="delivered">After delivered</SelectItem>
                              <SelectItem value="replied">After replied</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-500" />
                            <Input
                              type="number"
                              min="1"
                              value={node.timeDelay}
                              onChange={(e) => updateNode(node.id, { 
                                timeDelay: parseInt(e.target.value) 
                              })}
                              className="w-24 bg-gray-50"
                            />
                            <span className="text-sm text-gray-500">minutes</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {index === sequence.length - 1 && (
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addSequenceNode}
                        className="rounded-full border-dashed hover:border-green-500 hover:text-green-500"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Next Message
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="prospects">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle>Campaign Prospects</CardTitle>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csv-upload"
                  onChange={handleFileUpload}
                />
                <label htmlFor="csv-upload">
                  <Button variant="outline" className="cursor-pointer hover:bg-white/50" asChild>
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-green-500" />
                      Import CSV
                    </div>
                  </Button>
                </label>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Prospect
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Prospect</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          placeholder="Enter prospect name"
                          value={newProspect.name}
                          onChange={(e) => setNewProspect({...newProspect, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                          placeholder="Enter phone number"
                          value={newProspect.phone}
                          onChange={(e) => setNewProspect({...newProspect, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email (optional)</label>
                        <Input
                          placeholder="Enter email address"
                          value={newProspect.email}
                          onChange={(e) => setNewProspect({...newProspect, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company (optional)</label>
                        <Input
                          placeholder="Enter company name"
                          value={newProspect.company}
                          onChange={(e) => setNewProspect({...newProspect, company: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleAddProspect}
                        disabled={!newProspect.name || !newProspect.phone}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Add Prospect
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {selectedFile && fileHeaders.length > 0 && (
  <>
    <ColumnMappingSection />
    <Button
      onClick={handleUploadClick}
      disabled={!isColumnMappingValid() || isUploading}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      {isUploading ? "Uploading..." : "Upload to Contacts"}
    </Button>
    {uploadError && (
      <div className="text-sm text-red-500">
        <AlertCircle className="w-4 h-4 inline-block mr-1" />
        {uploadError}
      </div>
    )}
  </>
)}
              <div className="flex justify-between items-center">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search prospects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-gray-50"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {selectedProspects.length} of {prospects.length} prospects selected
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedProspects.length === filteredProspects.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProspects.map((prospect) => (
                      <TableRow key={prospect.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedProspects.includes(prospect.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedProspects([...selectedProspects, prospect.id]);
                              } else {
                                setSelectedProspects(selectedProspects.filter(id => id !== prospect.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{prospect.name}</TableCell>
                        <TableCell>{prospect.phone}</TableCell>
                        <TableCell>{prospect.email}</TableCell>
                        <TableCell>{prospect.company}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProspects(prospects.filter(p => p.id !== prospect.id))}
                            className="hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProspects.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No prospects found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);
};

export default WhatsAppCampaign;