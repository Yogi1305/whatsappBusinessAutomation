// src/flows/sortable-component-item.tsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ComponentFactory } from "./component-factory";
import type { FlowComponent } from "./types";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableComponentItemProps {
  id: string;
  component: FlowComponent;
  onChange: (updates: Partial<FlowComponent>) => void;
  onDelete: () => void;
}

export function SortableComponentItem({
  id,
  component,
  onChange,
  onDelete,
}: SortableComponentItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? "z-50" : ""}`}
    >
      <div className="group relative border rounded-lg hover:border-primary transition-colors">
        {/* Drag Handle */}
        <div
          className="absolute left-0 top-0 h-full w-10 cursor-move flex items-center justify-center bg-muted rounded-l-lg border-r"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Component Content */}
        <div className={`ml-10 ${isDragging ? "opacity-50" : ""}`}>
          <ComponentFactory
            type={component.type}
            config={component}
            onChange={onChange}
            onDelete={onDelete}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
          />
        </div>

        {/* Delete Button */}
      
        {/* Component Type Label */}
        <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {component.type}
          </span>
        </div>
      </div>
    </div>
  );
}