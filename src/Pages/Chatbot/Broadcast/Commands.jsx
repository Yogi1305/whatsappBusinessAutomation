import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { djangoURL, axiosInstance } from '../../../api';
import { getTenantIdFromUrl} from '../chatbot/utilityfunctions.jsx';
import { Terminal, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Enhanced CommandItem with better UX
const CommandItem = ({ command, index, onDelete, onChange }) => {
  const getCharacterCountColor = (current, max) => {
    const ratio = current / max;
    return ratio > 0.8 ? 'text-orange-500' : 
           ratio > 0.6 ? 'text-yellow-500' : 
           'text-gray-500';
  };

  return (
    <Draggable draggableId={command.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            flex items-center space-x-4 p-4 bg-white rounded-lg mb-4 relative
            transition-all duration-200 ease-in-out
            ${snapshot.isDragging 
              ? 'shadow-lg ring-2 ring-blue-200' 
              : 'shadow-sm hover:shadow-md'
            }
          `}
        >
          <div className="flex-1 space-y-3">
          <div className={`
                text-xs mt-1 flex justify-between
                ${getCharacterCountColor(command.text.length, 32)}
              `}>
                <span>Command text</span>
                <span>{32 - command.text.length} characters remaining</span>
              </div>
            <div className="relative group">
              <input
                type="text"
                value={command.text.startsWith("\/") ? command.text : `\/${command.text}`}
                onChange={(e) => onChange(command.id, 'text', e.target.value)}
                maxLength={32}
                placeholder="Command text (e.g., /help)"
                className={`
                  w-full p-2 border rounded-md
                  transition-all duration-200
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${command.text.length > 24 ? 'border-orange-300' : 'border-gray-200'}
                `}
              />
            </div>
            <div className="relative group">
            <div className={`
                text-xs mt-1 flex justify-between
                ${getCharacterCountColor(command.description.length, 256)}
              `}>
                <span>Description</span>
                <span>{256 - command.description.length} characters remaining</span>
              </div>
              <textarea
                value={command.description}
                onChange={(e) => onChange(command.id, 'description', e.target.value)}
                maxLength={256}
                placeholder="Command description - Explain what this command does"
                className={`
                  w-full p-2 border rounded-md resize-none
                  transition-all duration-200
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${command.description.length > 200 ? 'border-orange-300' : 'border-gray-200'}
                `}
                rows={3}
              />

            </div>
          </div>
          <button
            onClick={() => onDelete(command.id)}
            className={`
              p-2 rounded-full
              transition-all duration-200
              text-gray-400 hover:text-red-500
              hover:bg-red-50
            `}
            title="Delete command"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </Draggable>
  );
};

// Enhanced AgentItem with validation
const AgentItem = ({ agent, onDelete, onChange }) => {
  const isValidPhoneNumber = (number) => {
    return /^\+?[1-9]\d{1,14}$/.test(number);
  };

  return (
    <div className={`
      flex items-center space-x-2 p-3 bg-white rounded-lg
      transition-all duration-200
      ${isValidPhoneNumber(agent.number) ? 'shadow-sm hover:shadow-md' : 'shadow-sm border-red-200'}
    `}>
      <div className="flex-1">
        <input
          type="tel"
          value={agent.number}
          onChange={(e) => onChange(agent.id, e.target.value)}
          placeholder="+1234567890"
          className={`
            w-full p-2 border rounded-md
            transition-all duration-200
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${!isValidPhoneNumber(agent.number) && agent.number 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200'
            }
          `}
        />
        {!isValidPhoneNumber(agent.number) && agent.number && (
          <div className="text-xs text-red-500 mt-1">
            Please enter a valid phone number with country code
          </div>
        )}
      </div>
      <button
        onClick={() => onDelete(agent.id)}
        className={`
          p-2 rounded-full
          transition-all duration-200
          text-gray-400 hover:text-red-500
          hover:bg-red-50
        `}
        title="Delete agent"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// Main Component
const WhatsAppCommands = () => {
  const [commands, setCommands] = useState([{ id: '1', text: '', description: '' }]);
  const [agents, setAgents] = useState([{ id: '1', number: '' }]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingCommand, setSavingCommand] = useState(false);
  const [savingAgent, setSavingAgent] = useState(false);

  // Fetch Commands
  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const bpid = localStorage.getItem('bpid');
        const access_token = localStorage.getItem('accessToken');
        if (bpid && access_token) {
          const response = await axios.get(
            `https://graph.facebook.com/v22.0/${bpid}?fields=conversational_automation`,
            {
              headers: { 'Authorization': `Bearer ${access_token}` }
            }
          );
          const commandList = response.data.conversational_automation.commands;
          console.log("Response: ", response.data)
          const formattedCommands = commandList.map((command, index) => ({
            id: `cmd-${index + 1}`,
            text: command.command_name || "",
            description: command.command_description || "",
          }));
          setCommands(formattedCommands);
        }
      } catch (error) {
        console.error("Error fetching commands:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommands();
  }, []);

  // Fetch Agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${djangoURL}/tenant-agents/`);
        const tenant = getTenantIdFromUrl();
        const agentList = response.data[`${tenant}`];
        const formattedAgents = agentList.map((agent, index) => ({
          id: `agent-${index + 1}`,
          number: agent
        }));
        setAgents(formattedAgents);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  // Handlers
  const handleAddCommand = () => {
    setCommands([
      ...commands,
      { id: `cmd-${Date.now()}`, text: '', description: '' }
    ]);
  };

  const handleDeleteCommand = (id) => {
    setCommands(commands.filter(command => command.id !== id));
  };

  const handleCommandChange = (id, field, value) => {
    setCommands(commands.map(command =>
      command.id === id ? { ...command, [field]: value } : command
    ));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(commands);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCommands(items);
  };

  const handleAddAgent = () => {
    setAgents([
      ...agents,
      { id: `agent-${Date.now()}`, number: '' }
    ]);
  };

  const handleDeleteAgent = (id) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  const handleAgentChange = (id, value) => {
    setAgents(agents.map(agent =>
      agent.id === id ? { ...agent, number: value } : agent
    ));
  };

  const handleCommandSave = async () => {
    setSavingCommand(true);
    try {
      const data = commands.map(command => ({
        "command_name": command.text.replace(/\//g, ""), // Removes all '/' occurrences
        "command_description": command.description
      }))
      const bpid = localStorage.getItem('bpid');
      const access_token = localStorage.getItem('accessToken');
      if (bpid && access_token) {
        await axios.post(
          `https://graph.facebook.com/v22.0/${bpid}/conversational_automation`, {"commands": data},
          {
            headers: { 'Authorization': `Bearer ${access_token}` }
          }
        );
      }
      else throw new Error("bpid or access_token is not present")
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSavingCommand(false);
    }
  };

  const handleAgentSave = async () => {
    setSavingAgent(true);
    try {
      const data = agents.map(agent => (agent.number))
      axiosInstance.post(`${djangoURL}/tenant-agents/`, {"agents": data})
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSavingAgent(false);
    }
  };


  const handleCancel = () => {
    setCommands([{ id: '1', text: '', description: '' }]);
    setAgents([{ id: '1', number: '' }]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Commands Section */}
        <div className="flex-1">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-900">
                WhatsApp Commands
              </CardTitle>
              <p className="text-sm text-gray-500">
                Configure your WhatsApp bot commands and their responses
              </p>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="commands">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {commands.map((command, index) => (
                        <CommandItem
                          key={command.id}
                          command={command}
                          index={index}
                          onDelete={handleDeleteCommand}
                          onChange={handleCommandChange}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <Button
                onClick={handleAddCommand}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white
                  transition-colors duration-200"
              >
                + Add Command
              </Button>

              <div className="flex justify-between mt-6">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="px-8"
                  disabled={savingCommand}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCommandSave}
                  className={`
                    px-8 bg-black hover:bg-blue-600 text-white
                    transition-colors duration-200
                    ${savingCommand ? 'opacity-75 cursor-not-allowed' : ''}
                  `}
                  disabled={savingCommand}
                >
                  {savingCommand ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Section */}
        <div className="w-full lg:w-80">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Agents
              </CardTitle>
              <p className="text-sm text-gray-500">
                Manage your WhatsApp support agents
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <AgentItem
                    key={agent.id}
                    agent={agent}
                    onDelete={handleDeleteAgent}
                    onChange={handleAgentChange}
                  />
                ))}
              </div>

              <Button
                onClick={handleAddAgent}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white
                  transition-colors duration-200"
              >
                + Add Agent
              </Button>
            </CardContent>
          </Card>
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleAgentSave}
              className={`
                w-22 bg-black hover:bg-blue-600 text-white
                transition-colors duration-200
                ${savingAgent ? 'opacity-75 cursor-not-allowed' : ''}
              `}
              disabled={savingAgent}
            >
              {savingAgent ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppCommands;