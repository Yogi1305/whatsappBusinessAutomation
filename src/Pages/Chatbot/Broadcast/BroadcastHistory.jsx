import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner"; 
import { BarChart2, X, Calendar, MessageSquare, DollarSign, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance, { fastURL } from '../../../api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// New component for the insights modal
const InsightsModal = ({ isOpen, onClose, insightsData, templateName, timeRange, setTimeRange }) => {
  if (!isOpen) return null;

  // Function to get time range label
  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case 'today': return 'Today';
      case '7days': return 'Last 7 Days';
      case '1month': return 'Last Month';
      case '3months': return 'Last 3 Months';
      default: return 'Last 3 Months';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Insights for {templateName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Time range selector */}
        <div className="px-6 pt-4">
          <Tabs 
            defaultValue={timeRange} 
            className="w-full"
            onValueChange={(value) => setTimeRange(value)}
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="7days">7 Days</TabsTrigger>
              <TabsTrigger value="1month">1 Month</TabsTrigger>
              <TabsTrigger value="3months">3 Months</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="text-sm text-gray-500 mt-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Showing data for: {getTimeRangeLabel()}</span>
          </div>
        </div>
        
        <div className="p-6">
          {insightsData ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {insightsData.data[0]?.data_points.reduce((sum, dp) => sum + (dp.sent || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-500">Sent</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {insightsData.data[0]?.data_points.reduce((sum, dp) => sum + (dp.delivered || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-500">Delivered</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {insightsData.data[0]?.data_points.reduce((sum, dp) => sum + (dp.read || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-500">Read</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {insightsData.data[0]?.data_points.reduce((sum, dp) => sum + (dp.clicked || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-500">Clicked</div>
                </Card>
              </div>

              {/* Detailed Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Sent</th>
                      <th className="text-left p-3">Delivered</th>
                      <th className="text-left p-3">Read</th>
                      <th className="text-left p-3">Clicked</th>
                      <th className="text-left p-3">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insightsData.data[0]?.data_points.map((dataPoint, index) => {
                      // Find cost value if available
                      const costItem = dataPoint.cost?.find(c => c.type === "amount_spent");
                      const costValue = costItem?.value || 0;
                      
                      // Convert Unix timestamp to readable date
                      const date = new Date(dataPoint.start * 1000);
                      const formattedDate = date.toLocaleDateString();
                      
                      return (
                        <tr key={index} className="border-b">
                          <td className="p-3">{formattedDate}</td>
                          <td className="p-3">{dataPoint.sent || 0}</td>
                          <td className="p-3">{dataPoint.delivered || 0}</td>
                          <td className="p-3">{dataPoint.read || 0}</td>
                          <td className="p-3">{dataPoint.clicked || 0}</td>
                          <td className="p-3">${costValue.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p>Loading insights data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BroadcastHistory = ({
  broadcastHistory,
  filteredBroadcastHistory,
  handleBroadcastMessage,
  handleGroup,
  showBroadcastPopup,
  templates,
  selectedTemplate,
  contacts,
  broadcastGroup,
  selectedPhones,
  selectedBCGroups,
  isSendingBroadcast,
  handleTemplateClick,
  setShowTemplatePopup,
  handlePhoneSelection,
  handleBCGroupSelection,
  handleSendBroadcast,
  handleCloseBroadcastPopup,
  showGroupPopup,
  setIsSendingBroadcast,
  groupName,
  setGroupName,
  handleCreateGroup,
  handleCloseGroupPopup,
  BroadcastPopup,
  GroupPopup,
  businessPhoneNumberId,
  accessToken
}) => {
  // State for insights modal
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [insightsData, setInsightsData] = useState(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [timeRange, setTimeRange] = useState('3months');
  
  // State for total metrics
  const [totalMetrics, setTotalMetrics] = useState({
    sent: 0,
    delivered: 0,
    read: 0,
    cost: 0
  });

  // Function to calculate start date based on time range
  const getStartDate = (range) => {
    const now = new Date();
    const endDate = Math.floor(now.getTime() / 1000);
    
    switch(range) {
      case 'today':
        now.setHours(0, 0, 0, 0);
        return Math.floor(now.getTime() / 1000);
      case '7days':
        now.setDate(now.getDate() - 7);
        return Math.floor(now.getTime() / 1000);
      case '1month':
        now.setMonth(now.getMonth() - 1);
        return Math.floor(now.getTime() / 1000);
      case '3months':
      default:
        now.setMonth(now.getMonth() - 3);
        return Math.floor(now.getTime() / 1000);
    }
  };

  // Function to fetch insights data
  const fetchInsightsData = async (templateId, range) => {
    const startDate = getStartDate(range);
    const endDate = Math.floor(Date.now() / 1000);
    
    setInsightsData(null); // Reset data while loading
    
    try {
      // Make direct API call to Facebook Graph API
      console.log( localStorage.getItem("tenant_id"));
      const responses = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
        headers: {
          'X-Tenant-ID': localStorage.getItem("tenant_id")
        }
      });
      console.log(responses);
      // console.log("access token",responses.data.whatsapp_data[0].access_token);
      console.log(responses.data);
      // console.log(templateId);
      const response = await axiosInstance.get(
        `https://graph.facebook.com/v22.0/${responses.data.whatsapp_data[0].business_account_id}/template_analytics`, 
        { 
          headers: {
            'Authorization': `Bearer ${responses.data.whatsapp_data[0].accessToken}`
          },
          params: {
            access_token:responses.data.whatsapp_data[0].access_token,
            start: startDate,
            end: endDate,
            granularity: 'daily',
            metric_types: 'cost,clicked,delivered,read,sent',
            template_ids: [`${templateId}`],
          }
        }
      );
      
      setInsightsData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching template insights:', error);
      toast.error('Failed to load template insights');
    }
  };

  // Function to handle viewing template insights
  const handleViewInsights = async (templateId, templateName) => {
    toast.info(`Loading insights for template: ${templateName}`);
    setSelectedTemplateName(templateName);
    setSelectedTemplateId(templateId);
    setShowInsightsModal(true);
    
    // Fetch data with the current time range
    await fetchInsightsData(templateId, timeRange);
  };

  // Function to fetch total metrics across all templates
  const fetchTotalMetrics = async () => {
    const startDate = getStartDate('3months'); // Default to 3 months for total metrics
    const endDate = Math.floor(Date.now() / 1000);
    
    try {
      const responses = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
        headers: {
          'X-Tenant-ID': localStorage.getItem("tenant_id")
        }
      });
      
      // Get template IDs
      const templateIds = templates.map(template => template.id).join(',');
      
      if (templateIds) {
        const response = await axiosInstance.get(
          `https://graph.facebook.com/v22.0/${responses.data.whatsapp_data[0].business_phone_number_id}/template_analytics`, 
          { 
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            params: {
              start: startDate,
              end: endDate,
              granularity: 'daily',
              metric_types: 'cost,delivered,read,sent',
              template_ids: templateIds,
            }
          }
        );
        
        // Calculate totals
        let totalSent = 0;
        let totalDelivered = 0;
        let totalRead = 0;
        let totalCost = 0;
        
        response.data.data.forEach(template => {
          template.data_points.forEach(dataPoint => {
            totalSent += dataPoint.sent || 0;
            totalDelivered += dataPoint.delivered || 0;
            totalRead += dataPoint.read || 0;
            
            const costItem = dataPoint.cost?.find(c => c.type === "amount_spent");
            totalCost += costItem?.value || 0;
          });
        });
        
        setTotalMetrics({
          sent: totalSent,
          delivered: totalDelivered,
          read: totalRead,
          cost: totalCost
        });
      }
    } catch (error) {
      console.error('Error fetching total metrics:', error);
    }
  };

  // Effect to refetch data when time range changes
  useEffect(() => {
    if (showInsightsModal && selectedTemplateId) {
      fetchInsightsData(selectedTemplateId, timeRange);
    }
  }, [timeRange, showInsightsModal, selectedTemplateId]);

  // Fetch total metrics when component mounts or templates change
  useEffect(() => {
    if (templates && templates.length > 0 && accessToken) {
      fetchTotalMetrics();
    }
  }, [templates, accessToken]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-4xl font-semibold text-center sm:text-left w-full">
          Broadcast History
        </h1>
        <div className="flex space-x-4 w-full sm:w-auto justify-center sm:justify-end items-center">
          <Button 
            onClick={handleBroadcastMessage}
            className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto z-30"
          >
            New Broadcast
          </Button>
          <Button 
            onClick={handleGroup}
            className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
          >
            New Group
          </Button>
        </div>
      </div>

      {/* Total Metrics Summary Section */}
      <div className="bg-slate-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Total Message Metrics (Last 3 Months)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sent</p>
                <p className="text-2xl font-bold">{totalMetrics.sent.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Delivered</p>
                <p className="text-2xl font-bold">{totalMetrics.delivered.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Read</p>
                <p className="text-2xl font-bold">{totalMetrics.read.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Cost</p>
                <p className="text-2xl font-bold">${totalMetrics.cost.toFixed(2)}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Insights Modal */}
      <InsightsModal 
        isOpen={showInsightsModal}
        onClose={() => setShowInsightsModal(false)}
        insightsData={insightsData}
        templateName={selectedTemplateName}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />

      {/* Popups */}
      <BroadcastPopup
        showBroadcastPopup={showBroadcastPopup}
        templates={templates}
        selectedTemplate={selectedTemplate}
        contacts={contacts}
        broadcastGroup={broadcastGroup}
        selectedPhones={selectedPhones}
        selectedBCGroups={selectedBCGroups}
        isSendingBroadcast={isSendingBroadcast}
        onTemplateSelect={handleTemplateClick}
        onCreateTemplate={() => setShowTemplatePopup(true)}
        onPhoneSelection={handlePhoneSelection}
        onBCGroupSelection={handleBCGroupSelection}
        onSendBroadcast={handleSendBroadcast}
        onClose={handleCloseBroadcastPopup}
        setIsSendingBroadcast={setIsSendingBroadcast}
      />

      <GroupPopup
        showGroupPopup={showGroupPopup}
        groupName={groupName}
        contacts={contacts}
        broadcastGroup={broadcastGroup}
        selectedPhones={selectedPhones}
        onGroupNameChange={setGroupName}
        onPhoneSelection={handlePhoneSelection}
        onCreateGroup={handleCreateGroup}
        onClose={handleCloseGroupPopup}
      />

      {/* Template Insights Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Template Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates && templates.map(template => (
            <Card key={template.id} className="p-4 flex flex-col justify-between">
              <div className="mb-4">
                <h3 className="font-medium text-lg truncate" title={template.name}>
                  {template.name}
                </h3>
              </div>
              <Button 
                onClick={() => handleViewInsights(template.id, template.name)}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <BarChart2 className="h-4 w-4" />
                View Insights
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BroadcastHistory;