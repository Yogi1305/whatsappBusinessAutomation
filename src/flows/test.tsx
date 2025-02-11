  // src/components/whatsapp-flow/flow-builder.tsx

  import { useState } from "react";
  import { Card, CardContent } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { ScreenEditor } from "./screen-editor";
  import { WhatsAppPreview } from "./whatsapp-preview";
  import { FlowData, Screen } from "./types";
  import { saveFlow, updateFlow } from './api';
  import { Loader2 } from "lucide-react";


  interface FlowBuilderProps {
    initialFlow?: FlowData;
    onChange?: (flow: FlowData) => void;
    onSave?: (savedFlow: FlowData) => void;
  }

  const createInitialFlow = (): FlowData => ({
    version: "5.0",
    data_api_version: "1.0", // Added missing required field
    name: "New Flow",
    categories: ["OTHER"],
    screens: [
      {
        id: "START",
        title: "Start",
        terminal: false,
        success: false, // Added for consistency
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

  export function FlowBuilderfb({ initialFlow, onChange, onSave }: FlowBuilderProps) {
    const [flow, setFlow] = useState<FlowData>(() => 
      initialFlow ? { ...createInitialFlow(), ...initialFlow } : createInitialFlow()
    );
    
    const [activeScreenId, setActiveScreenId] = useState<string>("START");
    const [isSaving, setIsSaving] = useState(false);


    const handleAddScreen = () => {
      const newId = `SCREEN_${Date.now()}`.replace(/[^A-Z_]/g, '_');
      const newScreen: Screen = {
        id: newId,
        title: "New Screen",
        terminal: false, // Don't include success for non-terminal screens
        layout: {
          type: "SingleColumnLayout",
          children: []
        },
        data: {},
      };
    
      handleUpdateFlow({
        screens: [...flow.screens, newScreen],
      });
      setActiveScreenId(newId);
    };
    
    const handleMakeTerminal = (screenId: string, isTerminal: boolean) => {
      handleUpdateScreen(screenId, {
        terminal: isTerminal,
        success: isTerminal ? false : undefined // Remove success when not terminal
      });
    };

    const handleUpdateFlow = (updates: Partial<FlowData>) => {
      const newFlow = { ...flow, ...updates };
      setFlow(newFlow);
      onChange?.(newFlow);
    };

    const handleUpdateScreen = (screenId: string, updates: Partial<Screen>) => {
      const newScreens = flow.screens.map((screen) =>
        screen.id === screenId ? { ...screen, ...updates } : screen
      );
      handleUpdateFlow({ screens: newScreens });
    };

    const handleDeleteScreen = (screenId: string) => {
      if (flow.screens.length <= 1) {
        alert({
          title: "Error",
          description: "Cannot delete the last screen",
          variant: "destructive",
        });
        return;
      }

      const newScreens = flow.screens.filter((screen) => screen.id !== screenId);
      handleUpdateFlow({ screens: newScreens });
      setActiveScreenId(newScreens[0].id);
    };

    const handleSaveFlow = async () => {
      try {
        setIsSaving(true);
        
        if (flow.screens.length === 0) {
          throw new Error('Flow must have at least one screen');
        }

        const flowData = {
          ...flow,
          metadata: {
            ...flow.metadata,
            updated_at: new Date().toISOString(),
          },
        };

        const savedFlow = flow.id 
          ? await updateFlow(flow.id, flowData)
          : await saveFlow(flowData);

        setFlow(savedFlow);
        onSave?.(savedFlow);

        alert({
          title: "Success",
          description: "Flow saved successfully",
        });
      } catch (error) {
        console.error('Failed to save flow:', error);
        alert({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to save flow",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    };

    const activeScreen = flow.screens.find((screen) => screen.id === activeScreenId);

    return (
      <div className="h-full flex flex-col" style={{marginTop:'100px'}}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleAddScreen}>
              Add Screen
            </Button>
            <Button 
              onClick={handleSaveFlow} 
              disabled={isSaving}
              className="ml-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Flow'
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-4 p-4">
          <div className="col-span-3 overflow-auto">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {flow.screens.map((screen) => (
                    <Button
                      key={screen.id}
                      variant={screen.id === activeScreenId ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setActiveScreenId(screen.id)}
                    >
                      {screen.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-6">
            <Tabs defaultValue="editor">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="editor">
                {activeScreen && (
                  <ScreenEditor
                    screen={activeScreen}
                    flow={flow}
                    onUpdateScreen={(updates) => 
                      handleUpdateScreen(activeScreen.id, updates)
                    }
                    onUpdateFlow={handleUpdateFlow}
                    onDeleteScreen={() => handleDeleteScreen(activeScreen.id)}
                  />
                )}
              </TabsContent>
              <TabsContent value="json">
                <Card>
                  <CardContent className="p-4">
                    <pre className="text-xs">
                      {JSON.stringify(flow, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="col-span-3">
            <Card>
              <CardContent className="p-4">
                <WhatsAppPreview screen={activeScreen || null} flow={flow} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }