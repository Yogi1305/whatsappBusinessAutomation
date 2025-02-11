// src/components/whatsapp-flow/components/text/index.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { COMPONENT_TYPES, COMPONENT_CONFIGS } from "../../types";
import type { BaseComponentProps, ComponentType } from "../../types";

interface TextComponentProps extends BaseComponentProps {
  type: ComponentType;
}

export function TextComponent({ type, config, onChange }: TextComponentProps) {
  const maxChars = COMPONENT_CONFIGS[type]?.maxChars || 80;
  
  return (
    <div className="space-y-2">
      <Input
        value={config.text || ""}
        onChange={(e) => onChange({ ...config, text: e.target.value })}
        placeholder={`Enter ${type} text`}
        maxLength={maxChars}
      />
      <div className="text-xs text-muted-foreground">
        {config.text?.length || 0}/{maxChars} characters
      </div>
      {(type === COMPONENT_TYPES.TextBody || type === COMPONENT_TYPES.TextCaption) && (
        <div className="flex items-center gap-2">
          <Switch
            checked={config.markdown || false}
            onCheckedChange={(checked) => onChange({ ...config, markdown: checked })}
          />
          <Label>Enable Markdown</Label>
        </div>
      )}
    </div>
  );
}

export function RichTextComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter markdown text"
        value={Array.isArray(config.text) ? config.text.join('\n') : config.text || ''}
        onChange={(e) => {
          const text = e.target.value;
          const textValue = text.includes('\n') ? text.split('\n') : text;
          onChange({ ...config, text: textValue });
        }}
        className="min-h-[200px] font-mono"
      />
      <div className="text-sm text-muted-foreground">
        Supports: 
        <ul className="list-disc list-inside">
          <li># Heading 1</li>
          <li>## Heading 2</li>
          <li>**bold**, *italic*, ~~strikethrough~~</li>
          <li>- Unordered lists</li>
          <li>1. Ordered lists</li>
          <li>[Link text](URL)</li>
          <li>Tables using | syntax</li>
          <li>![Image alt](base64...)</li>
        </ul>
      </div>
    </div>
  );
}