// src/components/whatsapp-flow/components/screen-editor.tsx

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ComponentFactory } from './component-factory';
import { SortableComponentItem } from './sortable-component-item';
import { createDefaultComponent } from './utils';
import { 
  COMPONENT_TYPES, 
  COMPONENT_GROUPS,
  type Screen, 
  type FlowComponent 
} from './types'; 
import { Search } from 'lucide-react';
import { NavigationManager } from './navigation-manager';
import { NavigationPreview } from './navigation-preview';
import {FlowData} from './types';

interface ScreenEditorProps {
  screen: Screen;
  flow: FlowData;
  onUpdateScreen: (updates: Partial<Screen>) => void;
  onUpdateFlow: (updates: Partial<FlowData>) => void;
  onDeleteScreen: () => void;
}

export function ScreenEditor({ 
  screen, 
  flow, // Add this
  onUpdateScreen, 
  onUpdateFlow, // Add this
  onDeleteScreen 
}: ScreenEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>("Text");
  const [searchTerm, setSearchTerm] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = screen.layout.children.findIndex(
        (_, index) => `component-${index}` === active.id
      );
      const newIndex = screen.layout.children.findIndex(
        (_, index) => `component-${index}` === over.id
      );

      onUpdateScreen({
        layout: {
          ...screen.layout,
          children: arrayMove(screen.layout.children, oldIndex, newIndex),
        },
      });
    }
    setActiveId(null);
  };

  const handleAddComponent = (type: string) => {
    const newComponent = createDefaultComponent(type);
    onUpdateScreen({
      layout: {
        ...screen.layout,
        children: [...screen.layout.children, newComponent],
      },
    });
    setIsDialogOpen(false);
  };

  const filteredComponents = searchTerm
    ? Object.values(COMPONENT_TYPES).filter(type => 
        type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : COMPONENT_GROUPS[selectedGroup as keyof typeof COMPONENT_GROUPS];

  return (
    <Card className="relative">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>
            <Input
              value={screen.title}
              onChange={(e) => onUpdateScreen({ title: e.target.value })}
              placeholder="Screen Title"
              className="max-w-sm"
            />
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="terminal"
                checked={screen.terminal}
                onCheckedChange={(checked) => onUpdateScreen({ terminal: checked })}
              />
              <Label htmlFor="terminal">Terminal Screen</Label>
            </div>
            <Button variant="destructive" size="sm" onClick={onDeleteScreen}>
              Delete Screen
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Component</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add Component</DialogTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </DialogHeader>
              <div className="flex gap-4 p-4">
                {!searchTerm && (
                  <div className="w-48 space-y-2">
                    {Object.keys(COMPONENT_GROUPS).map((group) => (
                      <Button
                        key={group}
                        variant={selectedGroup === group ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedGroup(group)}
                      >
                        {group}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredComponents.map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleAddComponent(type)}
                      >
                        <span>{type}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={screen.layout.children.map((_, index) => `component-${index}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {screen.layout.children.map((component, index) => (
                <SortableComponentItem
                  key={`component-${index}`}
                  id={`component-${index}`}
                  component={component}
                  onChange={(updates) => {
                    const newChildren = [...screen.layout.children];
                    newChildren[index] = { ...component, ...updates };
                    onUpdateScreen({
                      layout: {
                        ...screen.layout,
                        children: newChildren,
                      },
                    });
                  }}
                  onDelete={() => {
                    const newChildren = screen.layout.children.filter(
                      (_, i) => i !== index
                    );
                    onUpdateScreen({
                      layout: {
                        ...screen.layout,
                        children: newChildren,
                      },
                    });
                  }}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="opacity-50">
                <ComponentFactory
                  type={screen.layout.children[parseInt(activeId.split('-')[1])].type}
                  config={screen.layout.children[parseInt(activeId.split('-')[1])]}
                  onChange={() => {}}
                  onDelete={() => {}}
                  onMoveUp={() => {}}
                  onMoveDown={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {screen.layout.children.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No components added yet. Click "Add Component" to start building your screen.
          </div>
        )}
            <div className="pt-6 border-t">
          <NavigationManager
            flow={flow}
            currentScreen={screen}
            onUpdateFlow={onUpdateFlow}
          />
        </div>

        {/* Navigation Preview */}
        <div className="pt-6 border-t">
          <NavigationPreview
            flow={flow}
            currentScreen={screen}
          />
        </div>
      </CardContent>
    </Card>
  );
}