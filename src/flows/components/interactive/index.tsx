// src/components/whatsapp-flow/components/interactive/index.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTION_TYPES } from "../../types";
import type { BaseComponentProps, Action } from "../../types";

export function FooterComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Primary Button</Label>
        <Input
          placeholder="Label"
          value={config.label || ""}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          maxLength={35} // WhatsApp limit
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label>Left Caption</Label>
          <Input
            placeholder="Left Caption"
            value={config["left-caption"] || ""}
            onChange={(e) => onChange({ ...config, "left-caption": e.target.value })}
            maxLength={15} // WhatsApp limit
            className="mt-2"
          />
        </div>
        <div>
          <Label>Center Caption</Label>
          <Input
            placeholder="Center Caption"
            value={config["center-caption"] || ""}
            onChange={(e) => onChange({ ...config, "center-caption": e.target.value })}
            maxLength={15}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Right Caption</Label>
          <Input
            placeholder="Right Caption"
            value={config["right-caption"] || ""}
            onChange={(e) => onChange({ ...config, "right-caption": e.target.value })}
            maxLength={15}
            className="mt-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>On Click Action</Label>
        <Select
          value={config["on-click-action"]?.name || ""}
          onValueChange={(value) => {
            const newAction: Action = {
              name: value as keyof typeof ACTION_TYPES,
              ...(value === "navigate"
                ? { next: { type: "screen", name: "" }, payload: {} }
                : value === "open_url"
                ? { url: "" }
                : { payload: {} }),
            };
            onChange({
              ...config,
              "on-click-action": newAction
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ACTION_TYPES).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {config["on-click-action"]?.name === "open_url" && (
          <Input
            placeholder="URL"
            value={config["on-click-action"]?.url || ""}
            onChange={(e) =>
              onChange({
                ...config,
                "on-click-action": {
                  ...config["on-click-action"],
                  url: e.target.value,
                },
              })
            }
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={config.enabled !== false}
          onCheckedChange={(checked) => onChange({ ...config, enabled: checked })}
        />
        <Label>Enabled</Label>
      </div>
    </div>
  );
}

export function OptInComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Opt-In Text</Label>
        <Input
          placeholder="Label"
          value={config.label || ""}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          maxLength={120} // WhatsApp limit
          className="mt-2"
        />
      </div>

      <Input
        placeholder="Field Name"
        value={config.name || ""}
        onChange={(e) => onChange({ ...config, name: e.target.value })}
      />

      <div className="space-y-2">
        <Label>On Click Action (Read More)</Label>
        <Select
          value={config["on-click-action"]?.name || ""}
          onValueChange={(value) => {
            const newAction: Action = {
              name: value as keyof typeof ACTION_TYPES,
              ...(value === "navigate"
                ? { next: { type: "screen", name: "" }, payload: {} }
                : value === "open_url"
                ? { url: "" }
                : { payload: {} }),
            };
            onChange({
              ...config,
              "on-click-action": newAction
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="navigate">Navigate</SelectItem>
            <SelectItem value="data_exchange">Data Exchange</SelectItem>
            <SelectItem value="open_url">Open URL</SelectItem>
          </SelectContent>
        </Select>

        {config["on-click-action"]?.name === "open_url" && (
          <Input
            placeholder="URL"
            value={config["on-click-action"]?.url || ""}
            onChange={(e) =>
              onChange({
                ...config,
                "on-click-action": {
                  ...config["on-click-action"],
                  url: e.target.value,
                },
              })
            }
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={config.required || false}
            onCheckedChange={(checked) => onChange({ ...config, required: checked })}
          />
          <Label>Required</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={config.visible !== false}
            onCheckedChange={(checked) => onChange({ ...config, visible: checked })}
          />
          <Label>Visible</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Selection Actions</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">On Select</Label>
            <Select
              value={config["on-select-action"]?.name || ""}
              onValueChange={(value) => {
                onChange({
                  ...config,
                  "on-select-action": {
                    name: value as keyof typeof ACTION_TYPES,
                    payload: {},
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update_data">Update Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">On Unselect</Label>
            <Select
              value={config["on-unselect-action"]?.name || ""}
              onValueChange={(value) => {
                onChange({
                  ...config,
                  "on-unselect-action": {
                    name: value as keyof typeof ACTION_TYPES,
                    payload: {},
                  },
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update_data">Update Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmbeddedLinkComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Link Text</Label>
        <Input
          placeholder="Text"
          value={config.text || ""}
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          maxLength={25} // WhatsApp limit
          className="mt-2"
        />
        <div className="text-xs text-muted-foreground mt-1">
          {config.text?.length || 0}/25 characters
        </div>
      </div>

      <div className="space-y-2">
        <Label>On Click Action</Label>
        <Select
          value={config["on-click-action"]?.name || ""}
          onValueChange={(value) => {
            const newAction: Action = {
              name: value as keyof typeof ACTION_TYPES,
              ...(value === "navigate"
                ? { next: { type: "screen", name: "" }, payload: {} }
                : value === "open_url"
                ? { url: "" }
                : { payload: {} }),
            };
            onChange({
              ...config,
              "on-click-action": newAction
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="navigate">Navigate</SelectItem>
            <SelectItem value="data_exchange">Data Exchange</SelectItem>
            <SelectItem value="open_url">Open URL</SelectItem>
          </SelectContent>
        </Select>

        {config["on-click-action"]?.name === "open_url" && (
          <Input
            placeholder="URL"
            value={config["on-click-action"]?.url || ""}
            onChange={(e) =>
              onChange({
                ...config,
                "on-click-action": {
                  ...config["on-click-action"],
                  url: e.target.value,
                },
              })
            }
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={config.visible !== false}
          onCheckedChange={(checked) => onChange({ ...config, visible: checked })}
        />
        <Label>Visible</Label>
      </div>
    </div>
  );
}