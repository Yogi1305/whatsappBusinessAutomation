import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { COMPONENT_CONFIGS } from "../../types";
import type { BaseComponentProps, DataSourceItem } from "../../types";

export function TextInputComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Label"
          value={config.label || ""}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
        />
        <Select
          value={config["input-type"] || "text"}
          onValueChange={(value) => onChange({ ...config, "input-type": value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Input Type" />
          </SelectTrigger>
          <SelectContent>
            {COMPONENT_CONFIGS.TextInput.inputTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        placeholder="Helper Text"
        value={config["helper-text"] || ""}
        onChange={(e) => onChange({ ...config, "helper-text": e.target.value })}
      />
      <Input
        placeholder="Pattern (regex)"
        value={config.pattern || ""}
        onChange={(e) => onChange({ ...config, pattern: e.target.value })}
      />
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={config.required || false}
            onCheckedChange={(checked) => onChange({ ...config, required: checked })}
          />
          <Label>Required</Label>
        </div>
        <Input
          placeholder="Field Name"
          value={config.name || ""}
          onChange={(e) => onChange({ ...config, name: e.target.value })}
          className="w-[200px]"
        />
      </div>
    </div>
  );
}

export function TextAreaComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Label"
        value={config.label || ""}
        onChange={(e) => onChange({ ...config, label: e.target.value })}
      />
      <Textarea
        placeholder="Helper Text"
        value={config["helper-text"] || ""}
        onChange={(e) => onChange({ ...config, "helper-text": e.target.value })}
      />
      <div className="flex gap-4">
        <Input
          type="number"
          placeholder="Max Length"
          value={config["max-length"] || ""}
          onChange={(e) => onChange({ ...config, "max-length": parseInt(e.target.value) })}
          className="w-[150px]"
        />
        <div className="flex items-center gap-2">
          <Switch
            checked={config.required || false}
            onCheckedChange={(checked) => onChange({ ...config, required: checked })}
          />
          <Label>Required</Label>
        </div>
        <Input
          placeholder="Field Name"
          value={config.name || ""}
          onChange={(e) => onChange({ ...config, name: e.target.value })}
          className="w-[200px]"
        />
      </div>
    </div>
  );
}

export function CheckboxGroupComponent({ config, onChange }: BaseComponentProps) {
  const updateDataSource = (items: DataSourceItem[]) => {
    onChange({ ...config, "data-source": items });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Label"
        value={config.label || ""}
        onChange={(e) => onChange({ ...config, label: e.target.value })}
      />
      <Input
        placeholder="Description"
        value={config.description || ""}
        onChange={(e) => onChange({ ...config, description: e.target.value })}
      />
      <div className="space-y-2">
        <Label>Options</Label>
        {(config["data-source"] || []).map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-4"
              placeholder="Title"
              value={item.title || ""}
              onChange={(e) => {
                const newItems = [...(config["data-source"] || [])];
                newItems[index] = { 
                  ...item, 
                  title: e.target.value, 
                  id: e.target.value.toLowerCase().replace(/\s+/g, '_') 
                };
                updateDataSource(newItems);
              }}
            />
            <Input
              className="col-span-4"
              placeholder="Description"
              value={item.description || ""}
              onChange={(e) => {
                const newItems = [...(config["data-source"] || [])];
                newItems[index] = { ...item, description: e.target.value };
                updateDataSource(newItems);
              }}
            />
            <div className="col-span-3 flex items-center gap-2">
              <Switch
                checked={item.enabled !== false}
                onCheckedChange={(checked) => {
                  const newItems = [...(config["data-source"] || [])];
                  newItems[index] = { ...item, enabled: checked };
                  updateDataSource(newItems);
                }}
              />
              <Label>Enabled</Label>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="col-span-1"
              onClick={() => {
                const newItems = (config["data-source"] || []).filter((_, i) => i !== index);
                updateDataSource(newItems);
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
              { id: "", title: "", enabled: true }
            ];
            updateDataSource(newItems);
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
              placeholder="Min Selected"
              value={config["min-selected-items"] || ""}
              onChange={(e) => onChange({ ...config, "min-selected-items": parseInt(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Max Selected"
              value={config["max-selected-items"] || ""}
              onChange={(e) => onChange({ ...config, "max-selected-items": parseInt(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <Label>Media Size</Label>
          <Select
            value={config["media-size"] || "regular"}
            onValueChange={(value) => onChange({ ...config, "media-size": value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
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
        <Input
          placeholder="Field Name"
          value={config.name || ""}
          onChange={(e) => onChange({ ...config, name: e.target.value })}
          className="w-[200px]"
        />
      </div>
    </div>
  );
}

export function RadioButtonsGroupComponent({ config, onChange }: BaseComponentProps) {
  const updateDataSource = (items: DataSourceItem[]) => {
    onChange({ ...config, "data-source": items });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Label"
        value={config.label || ""}
        onChange={(e) => onChange({ ...config, label: e.target.value })}
      />
      <Input
        placeholder="Description"
        value={config.description || ""}
        onChange={(e) => onChange({ ...config, description: e.target.value })}
      />
      <div className="space-y-2">
        <Label>Options</Label>
        {(config["data-source"] || []).map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-4"
              placeholder="Title"
              value={item.title || ""}
              onChange={(e) => {
                const newItems = [...(config["data-source"] || [])];
                newItems[index] = { 
                  ...item, 
                  title: e.target.value, 
                  id: e.target.value.toLowerCase().replace(/\s+/g, '_') 
                };
                updateDataSource(newItems);
              }}
            />
            <Input
              className="col-span-4"
              placeholder="Description"
              value={item.description || ""}
              onChange={(e) => {
                const newItems = [...(config["data-source"] || [])];
                newItems[index] = { ...item, description: e.target.value };
                updateDataSource(newItems);
              }}
            />
            <div className="col-span-3 flex items-center gap-2">
              <Switch
                checked={item.enabled !== false}
                onCheckedChange={(checked) => {
                  const newItems = [...(config["data-source"] || [])];
                  newItems[index] = { ...item, enabled: checked };
                  updateDataSource(newItems);
                }}
              />
              <Label>Enabled</Label>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="col-span-1"
              onClick={() => {
                const newItems = (config["data-source"] || []).filter((_, i) => i !== index);
                updateDataSource(newItems);
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
              { id: "", title: "", enabled: true }
            ];
            updateDataSource(newItems);
          }}
        >
          Add Option
        </Button>
      </div>
      <div>
        <Label>Media Size</Label>
        <Select
          value={config["media-size"] || "regular"}
          onValueChange={(value) => onChange({ ...config, "media-size": value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={config.required || false}
            onCheckedChange={(checked) => onChange({ ...config, required: checked })}
          />
          <Label>Required</Label>
        </div>
        <Input
          placeholder="Field Name"
          value={config.name || ""}
          onChange={(e) => onChange({ ...config, name: e.target.value })}
          className="w-[200px]"
        />
      </div>
    </div>
  );
}

// continuing src/components/whatsapp-flow/components/input/index.tsx

// ... continuing DropdownComponent
export function DropdownComponent({ config, onChange }: BaseComponentProps) {
  const updateDataSource = (items: DataSourceItem[]) => {
    onChange({ ...config, "data-source": items });
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Label"
        value={config.label || ""}
        onChange={(e) => onChange({ ...config, label: e.target.value })}
      />
      <div className="space-y-2">
        <Label>Options</Label>
        {(config["data-source"] || []).map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2">
            <Input
              className="col-span-4"
              placeholder="Title"
              value={item.title || ""}
              onChange={(e) => {
                const newItems = [...(config["data-source"] || [])];
                newItems[index] = { 
                  ...item, 
                  title: e.target.value, 
                  id: e.target.value.toLowerCase().replace(/\s+/g, '_') 
                };
                updateDataSource(newItems);
              }}
            />
            <Input
              className="col-span-4"
              placeholder="Description"
              value={item.description || ""}
              onChange={(e) => {
                const newItems = [...(config["data-source"] || [])];
                newItems[index] = { ...item, description: e.target.value };
                updateDataSource(newItems);
              }}
            />
            <div className="col-span-3 flex items-center gap-2">
              <Switch
                checked={item.enabled !== false}
                onCheckedChange={(checked) => {
                  const newItems = [...(config["data-source"] || [])];
                  newItems[index] = { ...item, enabled: checked };
                  updateDataSource(newItems);
                }}
              />
              <Label>Enabled</Label>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="col-span-1"
              onClick={() => {
                const newItems = (config["data-source"] || []).filter((_, i) => i !== index);
                updateDataSource(newItems);
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
              { id: "", title: "", enabled: true }
            ];
            updateDataSource(newItems);
          }}
        >
          Add Option
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={config.required || false}
            onCheckedChange={(checked) => onChange({ ...config, required: checked })}
          />
          <Label>Required</Label>
        </div>
        <Input
          placeholder="Field Name"
          value={config.name || ""}
          onChange={(e) => onChange({ ...config, name: e.target.value })}
          className="w-[200px]"
        />
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

export function DatePickerComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Label"
        value={config.label || ""}
        onChange={(e) => onChange({ ...config, label: e.target.value })}
      />
      <Input
        placeholder="Helper Text"
        value={config["helper-text"] || ""}
        onChange={(e) => onChange({ ...config, "helper-text": e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Date</Label>
          <Input
            type="date"
            value={config["min-date"] || ""}
            onChange={(e) => onChange({ ...config, "min-date": e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Max Date</Label>
          <Input
            type="date"
            value={config["max-date"] || ""}
            onChange={(e) => onChange({ ...config, "max-date": e.target.value })}
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
        <Input
          placeholder="Field Name"
          value={config.name || ""}
          onChange={(e) => onChange({ ...config, name: e.target.value })}
          className="w-[200px]"
        />
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
      <div className="space-y-2">
        <Label>On Change Action</Label>
        <Select
          value={config["on-change-action"]?.name || ""}
          onValueChange={(value) => {
            onChange({
              ...config,
              "on-change-action": {
                name: value,
                payload: {},
              },
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="data_exchange">Data Exchange</SelectItem>
            <SelectItem value="update_data">Update Data</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Helper functions
function createDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDefaultDateRange() {
  const today = new Date();
  const minDate = new Date();
  const maxDate = new Date();
  
  minDate.setDate(today.getDate() - 30); // 30 days ago
  maxDate.setDate(today.getDate() + 365); // 1 year ahead
  
  return {
    min: createDateString(minDate),
    max: createDateString(maxDate),
  };
}