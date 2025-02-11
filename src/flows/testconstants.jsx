// components/flow-builder/constants.js
export const COMPONENT_TYPES = {
  TextHeading: "TextHeading",
  TextBody: "TextBody",
  TextSubheading: "TextSubheading",
  TextCaption: "TextCaption",
  TextInput: "TextInput",
  TextArea: "TextArea",
  CheckboxGroup: "CheckboxGroup",
  RadioButtonsGroup: "RadioButtonsGroup",
  Footer: "Footer",
  OptIn: "OptIn",
  Dropdown: "Dropdown",
  EmbeddedLink: "EmbeddedLink",
  DatePicker: "DatePicker",
  Form: "Form",
};

export const ACTION_TYPES = {
  navigate: "navigate",
  data_exchange: "data_exchange",
  complete: "complete",
  update_data: "update_data",
  open_url: "open_url",
};

export const DATA_TYPES = {
  string: "string",
  number: "number",
  boolean: "boolean",
  array: "array",
  object: "object",
};

// components/flow-builder/flow-context.jsx
import { createContext, useContext } from 'react';

export const FlowContext = createContext(null);

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};

// components/flow-builder/flow.jsx
import { useState } from "react";
import { FlowContext } from "./flow-context";
import { FlowEditor } from "./flow-editor";
import { FlowPreview } from "./flow-preview";
import { WhatsAppPreview } from "./whatsapp-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function Flow() {
  const [flow, setFlow] = useState({
    version: "6.3",
    data_api_version: "3.0",
    categories: ["OTHER"],
    screens: [],
    routing_model: {},
  });

  const [activeScreen, setActiveScreen] = useState(null);

  const addScreen = () => {
    const screenId = `SCREEN_${Date.now()}`;
    const newScreen = {
      id: screenId,
      title: "New Screen",
      terminal: false,
      success: true,
      data: {},
      layout: {
        type: "SingleColumnLayout",
        children: [],
      },
    };

    setFlow((prev) => ({
      ...prev,
      screens: [...prev.screens, newScreen],
      routing_model: {
        ...prev.routing_model,
        [screenId]: [],
      },
    }));
    setActiveScreen(screenId);
  };

  const validateFlow = () => {
    // Basic validation
    if (!flow.screens.length) {
      toast({
        title: "Validation Error",
        description: "Flow must have at least one screen",
        variant: "destructive",
      });
      return false;
    }

    // Check if there's at least one terminal screen
    if (!flow.screens.some(screen => screen.terminal)) {
      toast({
        title: "Validation Error",
        description: "Flow must have at least one terminal screen",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const publishFlow = async () => {
    if (!validateFlow()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${process.env.NEXT_PUBLIC_WABA_ID}/flows`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flow),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Flow published successfully",
        });
      } else {
        throw new Error(data.message || "Failed to publish flow");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <FlowContext.Provider value={{ flow, setFlow, activeScreen, setActiveScreen }}>
      <div className="container mx-auto p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">WhatsApp Flow Builder</CardTitle>
              <div className="flex gap-2">
                <Button onClick={addScreen} variant="outline">
                  Add Screen
                </Button>
                <Button onClick={publishFlow}>
                  Publish Flow
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">Flow Name</label>
                <Input 
                  placeholder="Flow Name"
                  value={flow.name || ""}
                  onChange={(e) => setFlow(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categories</label>
                <Input 
                  value={flow.categories.join(", ")}
                  onChange={(e) => setFlow(prev => ({
                    ...prev,
                    categories: e.target.value.split(",").map(c => c.trim())
                  }))}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="editor" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">WhatsApp Preview</TabsTrigger>
                <TabsTrigger value="json">Flow JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="editor">
                <FlowEditor />
              </TabsContent>
              <TabsContent value="preview">
                <WhatsAppPreview />
              </TabsContent>
              <TabsContent value="json">
                <FlowPreview />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </FlowContext.Provider>
  );
}