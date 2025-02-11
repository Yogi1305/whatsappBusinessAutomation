// src/components/whatsapp-flow/components/json-preview.jsx
import { Button } from "@/components/ui/button";

export function JsonPreview({ flow, onPublish }) {
  return (
    <div className="space-y-4">
      <pre className="bg-muted p-4 rounded-lg overflow-auto">
        {JSON.stringify(flow, null, 2)}
      </pre>
      <Button onClick={onPublish}>Publish Flow</Button>
    </div>
  );
}