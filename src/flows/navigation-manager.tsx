// src/components/whatsapp-flow/components/navigation-manager.tsx

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, ArrowRight, AlertCircle } from 'lucide-react';
import type { FlowData, Screen, RoutingEdge } from './types';

interface NavigationManagerProps {
  flow?: FlowData; // Make flow optional
  currentScreen: Screen;
  onUpdateFlow: (updates: Partial<FlowData>) => void;
}

export function NavigationManager({
  flow,
  currentScreen,
  onUpdateFlow,
}: NavigationManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState<string>("");
  const [condition, setCondition] = useState("");

  // If flow is undefined, show loading state
  if (!flow) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Navigation Routes</h3>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Initialize routing model if it doesn't exist
  useEffect(() => {
    if (flow && !flow.routing_model) {
      onUpdateFlow({
        routing_model: {
          edges: [],
          defaultScreen: currentScreen.id,
        },
      });
    }
  }, [flow, currentScreen.id, onUpdateFlow]);

  const addRoute = () => {
    if (!selectedScreenId || !flow) return;

    const currentRoutingModel = flow.routing_model || {
      edges: [],
      defaultScreen: currentScreen.id,
    };

    const newEdge: RoutingEdge = {
      from: currentScreen.id,
      to: selectedScreenId,
      condition: condition || undefined,
      action: {
        name: 'navigate',
        next: { type: 'screen', name: selectedScreenId },
      },
    };

    onUpdateFlow({
      routing_model: {
        ...currentRoutingModel,
        edges: [...(currentRoutingModel.edges || []), newEdge],
      },
    });

    setIsOpen(false);
    setSelectedScreenId("");
    setCondition("");
  };

  const removeRoute = (targetScreenId: string) => {
    if (!flow?.routing_model) return;

    onUpdateFlow({
      routing_model: {
        ...flow.routing_model,
        edges: (flow.routing_model.edges || []).filter(
          edge => !(edge.from === currentScreen.id && edge.to === targetScreenId)
        ),
      },
    });
  };

  const currentRoutes = flow?.routing_model?.edges?.filter(
    edge => edge.from === currentScreen.id
  ) || [];

  const availableScreens = (flow?.screens || []).filter(
    screen => screen.id !== currentScreen.id &&
    !currentRoutes.some(route => route.to === screen.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Navigation Routes</h3>
          <p className="text-sm text-muted-foreground">
            Configure where users can navigate from this screen
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button disabled={availableScreens.length === 0}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Route
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Navigation Route</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Target Screen</Label>
                <Select
                  value={selectedScreenId}
                  onValueChange={setSelectedScreenId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target screen" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableScreens.map(screen => (
                      <SelectItem key={screen.id} value={screen.id}>
                        {screen.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Condition (optional)
                  <span className="text-muted-foreground ml-2 text-sm">
                    JavaScript expression
                  </span>
                </Label>
                <Input
                  placeholder="e.g., user.age >= 18"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="w-full"
                onClick={addRoute}
                disabled={!selectedScreenId}
              >
                Add Route
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {currentRoutes.map((route, index) => {
          const targetScreen = flow?.screens?.find(s => s.id === route.to);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg bg-muted/5"
            >
              <div className="flex items-center gap-3">
                <div className="font-medium">
                  {targetScreen?.title || 'Unknown Screen'}
                </div>
                {route.condition && (
                  <>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="text-sm px-2 py-1 bg-muted rounded-md font-mono">
                      {route.condition}
                    </div>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRoute(route.to)}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          );
        })}

        {currentRoutes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border rounded-lg bg-muted/5">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>No routes configured</p>
            <p className="text-sm">Add a route to enable navigation from this screen</p>
          </div>
        )}
      </div>
    </div>
  );
}