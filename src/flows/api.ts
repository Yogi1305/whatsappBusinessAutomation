// src/components/whatsapp-flow/api.ts

import axios from 'axios';
import { FlowData, RoutingEdge } from './types';

const BASE_URL = "https://graph.facebook.com/v20.0"
const WABA_ID = "460830850456088"
const ACCESS_TOKEN = "EAAVZBobCt7AcBO3wIFi4f1T5viNWnWVMNEYZB6fa0J4LymWmjlCUZCgWiWUyzM0puxnhWJiHZAZAeqvaY0zSJAj4PZAdUNmo6kwfHL4ZCAqvW8TVR1RFk5ZBx8zmpdul1sZBaw8Cl9Jd6aEnFhXvgZAIu3ABefjTlYJ9RipOQdfCNpWu6WDYG2mTH3Q4X7ZBk9VFlJ9ocGnSRxlh7ipRQIn9JrcFqFS5FjiDAESNLSaJpDu5XAfxWtn1KaN5afZA2ZAUH"

interface FlowCreateRequest {
    name: string;
    categories: string[];
    flow_json: string;
    publish: boolean;
  }
  
  interface RoutingModel {
    defaultScreen: string[];
    edges: RoutingEdge[];
  }
  
  function formatFlowJson(flow: FlowData) {
    return {
      version: "5.0",
      screens: flow.screens.map(screen => ({
        id: screen.id.replace(/[^A-Za-z_]/g, '_').toUpperCase(),
        title: screen.title,
        terminal: screen.terminal || false,
        success: screen.success || false,
        layout: {
          type: "Flow.Layout.SingleColumn",
          children: screen.layout.children.map(component => {
            switch (component.type.toLowerCase()) {
              case "text":
                return {
                  type: "Flow.Component.TextHeading",
                  text: component.text
                };
              case "button":
                return {
                  type: "Flow.Component.Button",
                  label: component.text,
                  "on-click-action": {
                    name: "navigate",
                    payload: {
                      screen: component.action?.next?.name?.replace(/[^A-Za-z_]/g, '_').toUpperCase() || ""
                    }
                  }
                };
              case "footer":
                return {
                  type: "Flow.Component.Footer",
                  label: component.text || "Complete",
                  "on-click-action": {
                    name: "complete",
                    payload: {}
                  }
                };
              default:
                return {
                  type: `Flow.Component.${component.type}`,
                  ...component
                };
            }
          })
        },
        data: screen.data || {}
      })),
      routing_model: {
        defaultScreen: ["START"],
        edges: (flow.routing_model?.edges || []).map(edge => ({
          ...edge,
          from: edge.from.replace(/[^A-Za-z_]/g, '_').toUpperCase(),
          to: edge.to.replace(/[^A-Za-z_]/g, '_').toUpperCase()
        }))
      }
    };
  }
  
  function validateFlowStructure(flow: FlowData): string[] {
    const errors: string[] = [];
  
    const idRegex = /^[A-Za-z_]+$/;
    
    flow.screens.forEach(screen => {
      if (!idRegex.test(screen.id)) {
        errors.push(`Screen ID "${screen.id}" should only contain letters and underscores`);
      }
    });
  
    if (!Array.isArray(flow.routing_model?.defaultScreen)) {
      errors.push('defaultScreen must be an array');
    }
  
    flow.screens.forEach(screen => {
      if (screen.layout.type !== "Flow.Layout.SingleColumn") {
        errors.push(`Invalid layout type for screen "${screen.id}". Expected "Flow.Layout.SingleColumn"`);
      }
  
      screen.layout.children.forEach(component => {
        if (!component.type.startsWith('Flow.Component.')) {
          errors.push(`Invalid component type "${component.type}" in screen "${screen.id}"`);
        }
      });
    });
  
    return errors;
  }
  
  export async function saveFlow(flow: FlowData): Promise<FlowData> {
    try {
      const errors = validateFlowStructure(flow);
      if (errors.length > 0) {
        throw new Error(`Invalid flow structure:\n${errors.join('\n')}`);
      }
  
      const formattedFlow = formatFlowJson(flow);
      
      const requestData: FlowCreateRequest = {
        name: flow.name,
        categories: flow.categories || ["OTHER"],
        flow_json: JSON.stringify(formattedFlow),
        publish: true
      };
  
      console.log('Sending flow data:', JSON.stringify(requestData, null, 2));
  
      const response = await axios.post(
        `${BASE_URL}/${WABA_ID}/flows`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data);
        throw new Error(error.response?.data?.error?.message || 'Failed to save flow');
      }
      throw error;
    }
  }
  
  export async function updateFlow(flowId: string, flow: FlowData): Promise<FlowData> {
    try {
      const errors = validateFlowStructure(flow);
      if (errors.length > 0) {
        throw new Error(`Invalid flow structure:\n${errors.join('\n')}`);
      }
  
      const formattedFlow = formatFlowJson(flow);
      
      const requestData: FlowCreateRequest = {
        name: flow.name,
        categories: flow.categories || ["OTHER"],
        flow_json: JSON.stringify(formattedFlow),
        publish: true
      };
  
      console.log('Updating flow data:', JSON.stringify(requestData, null, 2));
  
      const response = await axios.put(
        `${BASE_URL}/${WABA_ID}/flows/${flowId}`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data);
        throw new Error(error.response?.data?.error?.message || 'Failed to update flow');
      }
      throw error;
    }
  }
  
  export const createInitialFlow = (): FlowData => ({
    version: "5.0",
    name: "New Flow",
    categories: ["OTHER"],
    screens: [
      {
        id: "START",
        title: "Start",
        terminal: false,
        layout: {
          type: "Flow.Layout.SingleColumn",
          children: []
        },
        data: {},
      }
    ],
    routing_model: {
      defaultScreen: ["START"],
      edges: []
    }
  });