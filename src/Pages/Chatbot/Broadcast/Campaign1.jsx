import React, { useState } from 'react';
import { 
  Plus, X, ArrowRight, Clock, Check, ChevronRight, 
  ArrowLeft, MessageSquare, Sparkles, Edit2, Upload,
  Users, FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const CampaignManager = ({
    templates,
    groups,
    contacts,
    onCreateCampaign,
    onCreateTemplate,
    onUploadProspects,
    onImportContacts
  }) => {
    const [step, setStep] = useState(1);
    const [sequence, setSequence] = useState([]);
    const [showTemplateCreator, setShowTemplateCreator] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
      name: '',
      category: '',
      content: ''
    });
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [selectedProspects, setSelectedProspects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [columnMappings, setColumnMappings] = useState({
      name: '',
      email: '',
      company: ''
    });
    const [previewData, setPreviewData] = useState([]);

  const templateSuggestions = [
    {
      category: 'Follow Up',
      templates: [
        {
          name: 'Gentle Reminder',
          content: "Hi {{name}}, I hope you're doing well! I just wanted to follow up on our previous conversation. Would you have some time this week to discuss further?"
        },
        {
          name: 'Meeting Request',
          content: "Hello {{name}}, I'd love to schedule a quick call to discuss how we can help your business grow. What time works best for you?"
        }
      ]
    },
    {
      category: 'Product Launch',
      templates: [
        {
          name: 'New Feature Announcement',
          content: "Exciting news {{name}}! We've just launched our new feature that helps you {{benefit}}. Would you like to learn more?"
        },
        {
          name: 'Early Access Invite',
          content: "Hi {{name}}, As a valued customer, we're offering you exclusive early access to our new {{product}}. Interested in trying it out?"
        }
      ]
    }
  ];

  const addSequenceNode = () => {
    const newNode = {
      id: Date.now(),
      templateId: '',
      templateContent: '',
      delay: 24,
      delayUnit: 'hours',
      triggers: {
        read: false,
        delivered: false,
        replied: false
      }
    };
    setSequence([...sequence, newNode]);
  };

  const updateNode = (nodeId, field, value) => {
    setSequence(sequence.map(node => 
      node.id === nodeId ? { ...node, [field]: value } : node
    ));
  };

  const deleteNode = (nodeId) => {
    setSequence(sequence.filter(node => node.id !== nodeId));
  };

  const TemplateCreatorDialog = () => (
    <Dialog>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({...prev, name: e.target.value}))}
            />
            <Select
              value={newTemplate.category}
              onChange={(e) => setNewTemplate(prev => ({...prev, category: e.target.value}))}
            >
              <option value="">Select Category</option>
              <option value="follow_up">Follow Up</option>
              <option value="product_launch">Product Launch</option>
              <option value="onboarding">Onboarding</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message Content</label>
            <Textarea
              placeholder="Type your message content..."
              value={newTemplate.content}
              onChange={(e) => setNewTemplate(prev => ({...prev, content: e.target.value}))}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">AI Suggestions</label>
            <div className="grid grid-cols-1 gap-2">
              {templateSuggestions.map((category) => (
                <div key={category.category}>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{category.category}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {category.templates.map((template) => (
                      <Card
                        key={template.name}
                        className={`cursor-pointer hover:border-primary transition-all ${
                          selectedSuggestion?.name === template.name ? 'border-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedSuggestion(template);
                          setNewTemplate({
                            name: template.name,
                            category: category.category.toLowerCase(),
                            content: template.content
                          });
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{template.content}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowTemplateCreator(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onCreateTemplate(newTemplate);
                setShowTemplateCreator(false);
              }}
            >
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const TemplateSelector = ({ nodeId, currentTemplateId }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <MessageSquare className="w-4 h-4 mr-2" />
          {currentTemplateId ? 
            templates.find(t => t.id === currentTemplateId)?.name : 
            'Select Template'
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 max-h-[300px] overflow-y-auto">
        {templates.map(template => (
          <DropdownMenuItem 
            key={template.id}
            onClick={() => updateNode(nodeId, 'templateId', template.id)}
          >
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              {template.name}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DialogTrigger asChild>
          <DropdownMenuItem>
            <Sparkles className="w-4 h-4 mr-2" />
            Create New Template
          </DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const ProspectManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Add Prospects</h2>
          <p className="text-gray-500 mt-1">Upload contacts or select from existing ones</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => onUploadProspects(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drop your Excel file here or click to browse
                </p>
                <Button variant="outline" className="mt-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Prospects
                </Button>
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Select from Existing Contacts</h3>
                <Input 
                  type="text" 
                  placeholder="Search contacts..." 
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                {contacts?.filter(contact => 
                  contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  contact.email.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(contact => (
                  <div 
                    key={contact.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedProspects.includes(contact.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProspects([...selectedProspects, contact.id]);
                          } else {
                            setSelectedProspects(selectedProspects.filter(id => id !== contact.id));
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {contact.company}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-gray-500">
                  {selectedProspects.length} contacts selected
                </p>
                <Button
                  onClick={() => onImportContacts(selectedProspects)}
                  disabled={selectedProspects.length === 0}
                >
                  Add Selected Contacts
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSequenceBuilder = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Create Message Sequence</h2>
          <p className="text-gray-500 mt-1">Design your campaign flow by adding message templates</p>
        </div>
      </div>

      <div className="relative min-h-[400px] bg-gray-50 rounded-lg p-6">
        <Dialog>
          {sequence.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={addSequenceNode}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add First Message
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {sequence.map((node, index) => (
                <div key={node.id} className="relative">
                  {index > 0 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="h-8 w-px bg-gray-300"></div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                  <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all max-w-2xl mx-auto">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-4">
                            <TemplateSelector 
                              nodeId={node.id}
                              currentTemplateId={node.templateId}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNode(node.id)}
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </Button>
                          </div>

                          {node.templateId && (
                            <div className="p-3 bg-gray-100 rounded-md">
                              <div className="text-sm font-medium">
                                {templates.find(t => t.id === node.templateId)?.name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {templates.find(t => t.id === node.templateId)?.content}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <Input
                                type="number"
                                value={node.delay}
                                onChange={(e) => updateNode(node.id, 'delay', parseInt(e.target.value))}
                                className="w-20"
                              />
                              <Select
                                value={node.delayUnit}
                                onChange={(e) => updateNode(node.id, 'delayUnit', e.target.value)}
                                className="w-24"
                              >
                                <option value="minutes">mins</option>
                                <option value="hours">hours</option>
                                <option value="days">days</option>
                              </Select>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${node.triggers.read ? 'bg-primary text-white' : ''}`}
                              onClick={() => updateNode(node.id, 'triggers', {
                                ...node.triggers,
                                read: !node.triggers.read
                              })}
                            >
                              Read
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${node.triggers.delivered ? 'bg-primary text-white' : ''}`}
                              onClick={() => updateNode(node.id, 'triggers', {
                                ...node.triggers,
                                delivered: !node.triggers.delivered
                              })}
                            >
                              Delivered
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${node.triggers.replied ? 'bg-primary text-white' : ''}`}
                              onClick={() => updateNode(node.id, 'triggers', {
                                ...node.triggers,
                                replied: !node.triggers.replied
                              })}
                            >
                              Replied
                            </Button>
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
                        className="rounded-full flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Next
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <TemplateCreatorDialog />
        </Dialog>
      </div>
    </div>
  );
  const ColumnMapper = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Map Your Data</h2>
          <p className="text-gray-500 mt-1">Match your file columns to contact fields</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name Field</label>
                <Select
                  value={columnMappings.name}
                  onChange={(e) => setColumnMappings(prev => ({...prev, name: e.target.value}))}
                  className="mt-1"
                >
                  <option value="">Select column</option>
                  {previewData[0] && Object.keys(previewData[0]).map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Email Field</label>
                <Select
                  value={columnMappings.email}
                  onChange={(e) => setColumnMappings(prev => ({...prev, email: e.target.value}))}
                  className="mt-1"
                >
                  <option value="">Select column</option>
                  {previewData[0] && Object.keys(previewData[0]).map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Data Preview</h3>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      {previewData[0] && Object.keys(previewData[0]).map(column => (
                        <th key={column} className="px-4 py-2 text-left font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-4 py-2">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderSequenceBuilder();
      case 2:
        return <ProspectManager />;
      case 3:
        return <ColumnMapper />;
      default:
        return null;
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
    {/* Header with Progress Steps */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        {/* Back Button */}
        {step > 1 && (
          <Button variant="ghost" onClick={() => setStep(step - 1)} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        
        {/* Progress Indicators */}
        <div className="flex items-center space-x-2">
          {/* Step 1 */}
          <div className={`h-8 w-8 rounded-full flex items-center justify-center
            ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            1
          </div>
          
          {/* Connector 1-2 */}
          <div className="w-12 h-1 bg-gray-200">
            <div className={`h-full bg-primary transition-all
              ${step >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          
          {/* Step 2 */}
          <div className={`h-8 w-8 rounded-full flex items-center justify-center
            ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            2
          </div>
          
          {/* Connector 2-3 */}
          <div className="w-12 h-1 bg-gray-200">
            <div className={`h-full bg-primary transition-all
              ${step >= 3 ? 'w-full' : 'w-0'}`} />
          </div>
          
          {/* Step 3 */}
          <div className={`h-8 w-8 rounded-full flex items-center justify-center
            ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            3
          </div>
        </div>
      </div>
  
      {/* Action Buttons */}
      {step < 3 ? (
        <Button
          onClick={() => setStep(step + 1)}
          disabled={step === 1 && sequence.length === 0}
          className="flex items-center gap-2"
        >
          {step === 2 ? 'Map Columns' : 'Add Prospects'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          onClick={onCreateCampaign}
          disabled={!columnMappings.name || !columnMappings.email}
          className="flex items-center gap-2"
        >
          Create Campaign
          <Check className="w-4 h-4" />
        </Button>
      )}
    </div>
  
    {/* Step Content Container */}
    <div className="relative">
      {/* Step 1 Content */}
      <div className={`transition-all duration-500 transform ${
        step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'
      }`}>
        {step === 1 && renderSequenceBuilder()}
      </div>
      
      {/* Step 2 Content */}
      <div className={`transition-all duration-500 transform ${
        step === 2 ? 'translate-x-0 opacity-100' : 
        step === 1 ? 'translate-x-full opacity-0 absolute' : 
        '-translate-x-full opacity-0 absolute'
      }`}>
        {step === 2 && <ProspectManager />}
      </div>
      
      {/* Step 3 Content */}
      <div className={`transition-all duration-500 transform ${
        step === 3 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute'
      }`}>
        {step === 3 && <ColumnMapper />}
      </div>
    </div>
  </div>
  );
};

export default CampaignManager;