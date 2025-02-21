// src/components/whatsapp-flow/components/media/index.tsx

import { useState } from "react";
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
import type { BaseComponentProps } from "../../types";

export function ImageComponent({ config, onChange }: BaseComponentProps) {
  const [preview, setPreview] = useState<string>(config.src || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (300KB limit for WhatsApp)
    const maxSize = 300 * 1024; // 300KB in bytes
    if (file.size > maxSize) {
      alert('Image size must be less than 300KB');
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPEG, PNG, and WebP images are supported');
      return;
    }

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange({ ...config, src: base64String });
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    } catch (error) {
    //  console.error('Error processing image:', error);
      alert('Error processing image. Please try another image.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label>Image Upload</Label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="mt-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Maximum size: 300KB. Supported formats: JPEG, PNG, WebP
            </div>
          </div>

          <div>
            <Label>Alt Text</Label>
            <Input
              placeholder="Alternative text for accessibility"
              value={config["alt-text"] || ""}
              onChange={(e) => onChange({ ...config, "alt-text": e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Scale Type</Label>
            <Select
              value={config["scale-type"] || "contain"}
              onValueChange={(value) => onChange({ ...config, "scale-type": value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select scale type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contain">
                  Contain - Maintain aspect ratio
                </SelectItem>
                <SelectItem value="cover">
                  Cover - Fill container
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Preview</Label>
          <div className="mt-2 border rounded-lg overflow-hidden bg-muted aspect-square">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className={`w-full h-full object-${config["scale-type"] || "contain"}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image selected
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Width</Label>
          <Input
            type="number"
            placeholder="Width in pixels"
            value={config.width || ""}
            onChange={(e) => onChange({ ...config, width: parseInt(e.target.value) || undefined })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Height</Label>
          <Input
            type="number"
            placeholder="Height in pixels"
            value={config.height || ""}
            onChange={(e) => onChange({ ...config, height: parseInt(e.target.value) || undefined })}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Aspect Ratio</Label>
          <Input
            type="number"
            step="0.1"
            placeholder="e.g., 1.5"
            value={config["aspect-ratio"] || ""}
            onChange={(e) => 
              onChange({ ...config, "aspect-ratio": parseFloat(e.target.value) || undefined })
            }
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}

export function MediaUploadComponent({ config, onChange }: BaseComponentProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Label</Label>
        <Input
          placeholder="Upload prompt text"
          value={config.label || ""}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Field Name</Label>
        <Input
          placeholder="Field name for form submission"
          value={config.name || ""}
          onChange={(e) => onChange({ ...config, name: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Media Types</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {[
            { key: 'allow-image', label: 'Images' },
            { key: 'allow-document', label: 'Documents' },
            { key: 'allow-video', label: 'Videos' },
            { key: 'allow-audio', label: 'Audio' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <Switch
                checked={config[key as keyof typeof config] !== false}
                onCheckedChange={(checked) => onChange({ ...config, [key]: checked })}
              />
              <Label>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>File Restrictions</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Max file size (MB)"
            value={config["max-size"] || ""}
            onChange={(e) => 
              onChange({ ...config, "max-size": parseInt(e.target.value) || undefined })
            }
          />
          <Input
            placeholder="Allowed extensions (comma-separated)"
            value={config["allowed-extensions"] || ""}
            onChange={(e) => 
              onChange({ ...config, "allowed-extensions": e.target.value })
            }
          />
        </div>
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
            checked={config.enabled !== false}
            onCheckedChange={(checked) => onChange({ ...config, enabled: checked })}
          />
          <Label>Enabled</Label>
        </div>
      </div>

      <div>
        <Label>Helper Text</Label>
        <Input
          placeholder="Additional instructions or requirements"
          value={config["helper-text"] || ""}
          onChange={(e) => onChange({ ...config, "helper-text": e.target.value })}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <Label>On Upload Action</Label>
        <Select
          value={config["on-upload-action"]?.name || ""}
          onValueChange={(value) => {
            onChange({
              ...config,
              "on-upload-action": {
                name: value,
                payload: {},
              },
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
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

// Utility functions for image processing
const validateImageDimensions = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const isValid = img.width <= 1024 && img.height <= 1024; // WhatsApp max dimensions
      URL.revokeObjectURL(img.src);
      resolve(isValid);
    };
    img.onerror = () => resolve(false);
  });
};

const compressImage = async (file: File, maxSizeKB: number): Promise<Blob | null> => {
  // Image compression logic here
  // This is a placeholder - you'd want to implement actual compression
  return file;
};