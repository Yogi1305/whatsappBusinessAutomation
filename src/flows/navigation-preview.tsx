// src/components/whatsapp-flow/components/navigation-preview.tsx

import { ArrowRight } from 'lucide-react';
import { FlowData, Screen, RoutingEdge } from './types';

interface NavigationPreviewProps {
  flow: FlowData;
  currentScreen: Screen;
}

export function NavigationPreview({ flow, currentScreen }: NavigationPreviewProps) {
  const routes = flow?.routing_model?.edges?.filter(
    (edge: RoutingEdge) => edge.from === currentScreen.id
  ) || [];

  if (!flow || !flow.routing_model) {
    return null;
  }

  if (routes.length === 0) {
    return (
      <div className="mt-6 p-4 border rounded-lg bg-muted/5">
        <h4 className="text-sm font-medium mb-2">Navigation Preview</h4>
        <div className="text-sm text-muted-foreground">
          This screen has no navigation paths configured
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 border rounded-lg bg-muted/5">
      <h4 className="text-sm font-medium mb-3">Navigation Preview</h4>
      <div className="space-y-2">
        {routes.map((route, index) => {
          const targetScreen = flow.screens.find(s => s.id === route.to);
          return (
            <div 
              key={index} 
              className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <span className="text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="font-medium">{targetScreen?.title}</span>
              {route.condition && (
                <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                  when {route.condition}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}