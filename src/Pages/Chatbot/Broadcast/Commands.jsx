import React, { useState } from 'react';
import { Plus, Trash2, Save, Menu, MessageSquare, Bot, User, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const WhatsAppCommands = () => {
  const [commands, setCommands] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCommand, setNewCommand] = useState({
    command: '',
    description: '',
    type: 'feature',
    action: '',
    isActive: true
  });

  const featureOptions = {
    basic: [
      'schedule_message',
      'chatbot',
      'catalog',
      'template_creation',
      'direct_reply',
      'basic_analytics',
      'language_support'
    ],
    professional: [
      'rpa_flows',
      'ai_document_qa',
      'phone_verification',
      'carousel_creation',
      'drip_marketing',
      'advanced_analytics',
      'full_language_support'
    ],
    enterprise: [
      'ai_chatbot',
      'payment_processing',
      'team_management',
      'api_integration',
      'priority_support',
      'custom_training',
      'campaign_analytics'
    ]
  };

  const handleAddCommand = () => {
    if (newCommand.command.startsWith('/') && newCommand.action) {
      setCommands([...commands, { ...newCommand, id: Date.now() }]);
      setNewCommand({
        command: '',
        description: '',
        type: 'feature',
        action: '',
        isActive: true
      });
      setShowAddDialog(false);
    }
  };

  const handleDeleteCommand = (id) => {
    setCommands(commands.filter(cmd => cmd.id !== id));
  };

  const getActionOptions = () => {
    switch (newCommand.type) {
      case 'feature':
        return (
          <>
            <optgroup label="Basic Features">
              {featureOptions.basic.map(feature => (
                <SelectItem key={feature} value={feature}>
                  {feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </optgroup>
            <optgroup label="Professional Features">
              {featureOptions.professional.map(feature => (
                <SelectItem key={feature} value={feature}>
                  {feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </optgroup>
            <optgroup label="Enterprise Features">
              {featureOptions.enterprise.map(feature => (
                <SelectItem key={feature} value={feature}>
                  {feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </optgroup>
          </>
        );
      case 'human':
        return (
          <>
            <SelectItem value="connect_support">Connect to Support</SelectItem>
            <SelectItem value="connect_sales">Connect to Sales</SelectItem>
            <SelectItem value="connect_technical">Connect to Technical Team</SelectItem>
          </>
        );
      default:
        return null;
    }
  };

  const getCommandIcon = (type) => {
    switch (type) {
      case 'feature':
        return <Bot className="w-4 h-4 text-blue-500" />;
      case 'human':
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <Menu className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Commands</h1>
          <p className="text-gray-500">Manage commands that users can access via WhatsApp</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Command
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Command</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Command</label>
                <Input
                  placeholder="/command"
                  value={newCommand.command}
                  onChange={(e) => setNewCommand({...newCommand, command: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="What does this command do?"
                  value={newCommand.description}
                  onChange={(e) => setNewCommand({...newCommand, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newCommand.type}
                  onValueChange={(value) => setNewCommand({...newCommand, type: value, action: ''})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature Command</SelectItem>
                    <SelectItem value="human">Human Connection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Action</label>
                <Select
                  value={newCommand.action}
                  onValueChange={(value) => setNewCommand({...newCommand, action: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getActionOptions()}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddCommand}
                disabled={!newCommand.command.startsWith('/') || !newCommand.action}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Add Command
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commands.map((cmd) => (
                <TableRow key={cmd.id}>
                  <TableCell className="font-mono">{cmd.command}</TableCell>
                  <TableCell>{cmd.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCommandIcon(cmd.type)}
                      {cmd.type.charAt(0).toUpperCase() + cmd.type.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {cmd.action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCommand(cmd.id)}
                      className="hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {commands.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No commands configured. Click "Add Command" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppCommands;