import React, { useRef } from 'react';
import { useCallback, useEffect,useState } from 'react';
import GroupPopup from './GroupPopup';
import { axiosInstance, fastURL } from '../../../api';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { whatsappURL } from '../../../Navbar';
import { MentionTextArea, convertMentionsForFrontend } from '../../NewFlow/MentionTextArea';
import { s } from 'framer-motion/client';
import { X } from 'lucide-react';
const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1];
  }
  return null;
};
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const WhatsAppTemplatePopup = ({
}) => {
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [headerType, setHeaderType] = useState('text');
  const [headerContent, setHeaderContent] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [bodyText, setBodyText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [buttons, setButtons] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [headerMediaId, setHeaderMediaId] = useState('');
  const [bodyVariables, setBodyVariables] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // May need to sync with TemplateMessages
  const [selectedTemplate, setSelectedTemplate] = useState(null); // May need to sync with 
  const fileInputRef = useRef(null);

  if (!showTemplatePopup) return null;
  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    
    const components = [];

    if ((headerType === 'text' && headerContent.trim()) || (headerType === 'image' && headerMediaId)) {
      components.push({
        type: "HEADER",
        format: headerType.toUpperCase(),
        text: headerType === 'text' ? headerContent : undefined,
        example: headerType === 'image' ? { header_handle: [headerMediaId] } : undefined,
      });
    }

    const bodyComponent = {
      type: "BODY",
      text: convertBodyTextToIndexedFormat(bodyText),
    };
  
    if (bodyVariables && bodyVariables.length > 0) {
      bodyComponent.example = {
        body_text: [bodyVariables.map(variable => `{{${variable}}}`)]
      };
    }
  
    components.push(bodyComponent);

    if (footerText.trim()) {
      components.push({
        type: "FOOTER",
        text: footerText
      });
    }

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
        }).filter(Boolean)
      });
    }

    const templateData = {
      name: templateName,
      category: category,
      components: components,
      language: language
    };

    try {
      const url = `https://graph.facebook.com/v20.0/${accountId}/message_templates`;
      
      const response = await axios({
        method: 'post',
        url: url,
        data: templateData,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      setShowTemplatePopup(false);
      resetTemplateForm();
      await fetchTemplates();
      setActiveTab('templates');
    } catch (error) {
      console.error('Error creating/updating template:', error);
    }
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
  
        console.log('File uploaded to WhatsApp, ID:', response.data.body.h);
        setHeaderMediaId(response.data.body.h);
        setUploadProgress(100);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadProgress(0);
      }
    }
  };
  const addButton = () => {
    setButtons([...buttons, { type: 'QUICK_REPLY', text: '' }]);
  };
  const extractVariables = (text) => {
    const regex = /@(\w+)/g;
    const matches = text.match(regex);
    return matches ? matches.map(match => match.slice(1)) : [];
  };
  const convertBodyTextToIndexedFormat = (text) => {
    let indexCounter = 1;
    return text.replace(/@(\w+)/g, () => `{{${indexCounter++}}}`);
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

  const deleteButton = (index) => {
    const updatedButtons = buttons.filter((_, i) => i !== index);
    setButtons(updatedButtons);
  };

  const updateButton = (index, field, value) => {
    const updatedButtons = buttons.map((button, i) => 
      i === index ? { ...button, [field]: value } : button
    );
    setButtons(updatedButtons);
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col bg-white">
        <CardHeader className="border-b">
          <CardTitle>{isEditing ? 'Edit' : 'Create'} WhatsApp Template Message</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-6 p-6 overflow-auto">
          <form onSubmit={handleCreateTemplate} className="flex-1 space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="UTILITY">Utility</SelectItem>
                    <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_US">English (US)</SelectItem>
                    <SelectItem value="es_ES">Spanish (Spain)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Header (Optional)</Label>
                <Select value={headerType || "none"} onValueChange={value => setHeaderType(value === "none" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select header type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No header</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
                
                {headerType === 'text' && (
                  <Input
                    className="mt-2"
                    value={headerContent}
                    onChange={(e) => setHeaderContent(e.target.value)}
                    placeholder="Header Text"
                  />
                )}
                
                {headerType === 'image' && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Upload Image
                    </Button>
                    {headerImage && (
                      <p className="text-sm text-gray-600">{headerImage.name}</p>
                    )}
                    {uploadProgress > 0 && (
                      <Progress value={uploadProgress} className="w-full" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label>Body Text</Label>
                <MentionTextArea
                  value={convertMentionsForFrontend(bodyText)}
                  onChange={(e) => {
                    setBodyText(e.target.value);
                    setBodyVariables(extractVariables(e.target.value));
                  }}
                  placeholder="Use @name, @phoneno, etc. for variables"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label>Footer (Optional)</Label>
                <Input
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="Footer Text"
                />
              </div>

              <div className="space-y-2">
                <Label>Buttons (Optional)</Label>
                {buttons.map((button, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Select
                      value={button.type}
                      onValueChange={(value) => updateButton(index, 'type', value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QUICK_REPLY">Quick Reply</SelectItem>
                        <SelectItem value="PHONE_NUMBER">Phone Number</SelectItem>
                        <SelectItem value="URL">URL</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="Button Text"
                      value={button.text}
                      onChange={(e) => updateButton(index, 'text', e.target.value)}
                    />

                    {button.type === 'PHONE_NUMBER' && (
                      <Input
                        type="tel"
                        placeholder="+1 555 123 4567"
                        value={button.phoneNumber}
                        onChange={(e) => updateButton(index, 'phoneNumber', e.target.value)}
                      />
                    )}

                    {button.type === 'URL' && (
                      <Input
                        type="url"
                        placeholder="URL"
                        value={button.url}
                        onChange={(e) => updateButton(index, 'url', e.target.value)}
                      />
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteButton(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addButton}
                  className="w-full"
                >
                  Add Button
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowTemplatePopup(false);
                  resetTemplateForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Save'} Template
              </Button>
            </div>
          </form>

          <div className="w-[400px] flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                  {headerType === 'text' && headerContent && (
                    <div className="font-medium">{headerContent}</div>
                  )}
                  {headerType === 'image' && headerContent && (
                    <img
                      src={headerContent}
                      alt="Header"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <div className="text-gray-800">
                    {convertMentionsForFrontend(bodyText)}
                  </div>
                  {footerText && (
                    <div className="text-sm text-gray-600">{footerText}</div>
                  )}
                  {buttons.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {buttons.map((button, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full"
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">1:10 PM</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppTemplatePopup;