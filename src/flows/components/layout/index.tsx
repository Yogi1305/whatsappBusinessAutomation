// src/components/whatsapp-flow/components/layout/index.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTION_TYPES } from "../../types";
import type { BaseComponentProps, Action, ListItem } from "../../types";

export function IfComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Condition</Label>
        <Input
          placeholder="Enter condition (e.g., user.age > 18)"
          value={config.condition || ""}
          onChange={(e) => onChange({ ...config, condition: e.target.value })}
          className="mt-2"
        />
        <div className="text-xs text-muted-foreground mt-1">
          Use JavaScript-like expressions with available context variables
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={config.enabled !== false}
            onCheckedChange={(checked) => onChange({ ...config, enabled: checked })}
          />
          <Label>Enabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={config.visible !== false}
            onCheckedChange={(checked) => onChange({ ...config, visible: checked })}
          />
          <Label>Visible</Label>
        </div>
      </div>
    </div>
  );
}

export function SwitchComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Switch Expression</Label>
        <Input
          placeholder="Enter expression (e.g., user.status)"
          value={config.condition || ""}
          onChange={(e) => onChange({ ...config, condition: e.target.value })}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <Label>Cases</Label>
        {Object.entries(config.cases || {}).map(([key], index) => (
          <div key={index} className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-11"
              placeholder="Case value"
              value={key}
              onChange={(e) => {
                const newCases = { ...config.cases };
                const value = newCases[key];
                delete newCases[key];
                newCases[e.target.value] = value;
                onChange({ ...config, cases: newCases });
              }}
            />
            <Button
              size="sm"
              variant="destructive"
              className="col-span-1"
              onClick={() => {
                const newCases = { ...config.cases };
                delete newCases[key];
                onChange({ ...config, cases: newCases });
              }}
            >
              ×
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            const newCases = { ...config.cases };
            newCases[`case${Object.keys(newCases).length + 1}`] = [];
            onChange({ ...config, cases: newCases });
          }}
        >
          Add Case
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={config.enabled !== false}
            onCheckedChange={(checked) => onChange({ ...config, enabled: checked })}
          />
          <Label>Enabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={config.visible !== false}
            onCheckedChange={(checked) => onChange({ ...config, visible: checked })}
          />
          <Label>Visible</Label>
        </div>
      </div>
    </div>
  );
}

export function NavigationListComponent({ config, onChange }: BaseComponentProps) {
  const updateListItems = (items: ListItem[]) => {
    onChange({ ...config, "list-items": items });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>List Items</Label>
        {(config["list-items"] || []).map((item, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={item["main-content"].title || ""}
                  onChange={(e) => {
                    const newItems = [...(config["list-items"] || [])];
                    newItems[index] = {
                      ...item,
                      "main-content": {
                        ...item["main-content"],
                        title: e.target.value,
                      },
                    };
                    updateListItems(newItems);
                  }}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={item["main-content"].description || ""}
                  onChange={(e) => {
                    const newItems = [...(config["list-items"] || [])];
                    newItems[index] = {
                      ...item,
                      "main-content": {
                        ...item["main-content"],
                        description: e.target.value,
                      },
                    };
                    updateListItems(newItems);
                  }}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Image</Label>
                <Input
                  placeholder="Image URL"
                  value={item.start?.image || ""}
                  onChange={(e) => {
                    const newItems = [...(config["list-items"] || [])];
                    newItems[index] = {
                      ...item,
                      start: {
                        ...item.start,
                        image: e.target.value,
                      },
                    };
                    updateListItems(newItems);
                  }}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Image Alt Text</Label>
                <Input
                  placeholder="Alternative text"
                  value={item.start?.["alt-text"] || ""}
                  onChange={(e) => {
                    const newItems = [...(config["list-items"] || [])];
                    newItems[index] = {
                      ...item,
                      start: {
                        ...item.start,
                        "alt-text": e.target.value,
                      },
                    };
                    updateListItems(newItems);
                  }}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>End Title</Label>
                <Input
                  value={item.end?.title || ""}
                  onChange={(e) => {
                    const newItems = [...(config["list-items"] || [])];
                    newItems[index] = {
                      ...item,
                      end: {
                        ...item.end,
                        title: e.target.value,
                      },
                    };
                    updateListItems(newItems);
                  }}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>End Description</Label>
                <Input
                  value={item.end?.description || ""}
                  onChange={(e) => {
                    const newItems = [...(config["list-items"] || [])];
                    newItems[index] = {
                      ...item,
                      end: {
                        ...item.end,
                        description: e.target.value,
                      },
                    };
                    updateListItems(newItems);
                  }}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={item.tags?.join(", ") || ""}
                onChange={(e) => {
                  const newItems = [...(config["list-items"] || [])];
                  newItems[index] = {
                    ...item,
                    tags: e.target.value.split(",").map(tag => tag.trim()),
                  };
                  updateListItems(newItems);
                }}
                className="mt-2"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const newItems = (config["list-items"] || []).filter((_, i) => i !== index);
                  updateListItems(newItems);
                }}
              >
                Remove Item
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            const newItems = [
              ...(config["list-items"] || []),
              {
                "main-content": { title: "", description: "" },
                start: { image: "", "alt-text": "" },
                end: { title: "", description: "" },
                tags: [],
              },
            ];
            updateListItems(newItems);
          }}
        >
          Add List Item
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={config.enabled !== false}
            onCheckedChange={(checked) => onChange({ ...config, enabled: checked })}
          />
          <Label>Enabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={config.visible !== false}
            onCheckedChange={(checked) => onChange({ ...config, visible: checked })}
          />
          <Label>Visible</Label>
        </div>
      </div>
    </div>
  );
}

export function ChipsSelectorComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Label</Label>
          <Input
            placeholder="Chips label"
            value={config.label || ""}
            onChange={(e) => onChange({ ...config, label: e.target.value })}
            className="mt-2"
            maxLength={80}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Input
            placeholder="Helper text"
            value={config.description || ""}
            onChange={(e) => onChange({ ...config, description: e.target.value })}
            className="mt-2"
            maxLength={300}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Options</Label>
        {(config["data-source"] || []).map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="Title"
              value={item.title || ""}
              onChange={(e) => {
                const newItems = [...(config["data-source"] || [])];
                newItems[index] = {
                  ...item,
                  title: e.target.value,
                  id: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                };
                onChange({ ...config, "data-source": newItems });
              }}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={item.enabled !== false}
                onCheckedChange={(checked) => {
                  const newItems = [...(config["data-source"] || [])];
                  newItems[index] = { ...item, enabled: checked };
                  onChange({ ...config, "data-source": newItems });
                }}
              />
              <Label>Enabled</Label>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const newItems = (config["data-source"] || []).filter((_, i) => i !== index);
                onChange({ ...config, "data-source": newItems });
              }}
            >
              ×
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            const newItems = [
              ...(config["data-source"] || []),
              { id: "", title: "", enabled: true },
            ];
            onChange({ ...config, "data-source": newItems });
          }}
        >
          Add Option
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Selection Limits</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="number"
              placeholder="Min"
              value={config["min-selected-items"] || ""}
              onChange={(e) => 
                onChange({ ...config, "min-selected-items": parseInt(e.target.value) || undefined })
              }
              min={2}
              max={20}
            />
            <Input
              type="number"
              placeholder="Max"
              value={config["max-selected-items"] || ""}
              onChange={(e) => 
                onChange({ ...config, "max-selected-items": parseInt(e.target.value) || undefined })
              }
              min={2}
              max={20}
            />
          </div>
        </div>
        <div>
          <Label>Field Name</Label>
          <Input
            placeholder="Field name"
            value={config.name || ""}
            onChange={(e) => onChange({ ...config, name: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={config.required || false}
            onCheckedChange={(checked) => onChange({ ...config, required: checked })}
          />
          <Label>Required</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={config.enabled !== false}
            onCheckedChange={(checked) => onChange({ ...config, enabled: checked })}
          />
          <Label>Enabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={config.visible !== false}
            onCheckedChange={(checked) => onChange({ ...config, visible: checked })}
          />
          <Label>Visible</Label>
        </div>
      </div>
    </div>
  );
}

// Utility functions for layout components
const validateCondition = (condition: string): boolean => {
  try {
    // Basic syntax validation
    Function(`"use strict"; return (${condition});`);
    return true;
  } catch (e) {
    return false;
  }
};

const formatCondition = (condition: string): string => {
  try {
    const formatted = condition
      .replace(/([><=!]+)/g, ' $1 ')
      .replace(/\s+/g, ' ')
      .trim();
    return formatted;
  } catch (e) {
    return condition;
  }
};