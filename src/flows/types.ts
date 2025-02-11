// src/components/whatsapp-flow/types.ts

// WhatsApp Flow Component Types
export const COMPONENT_TYPES = {
  TextHeading: "Flow.Component.TextHeading",
  TextSubheading: "Flow.Component.TextSubheading",
  TextCaption: "Flow.Component.TextCaption",
  TextBody: "Flow.Component.TextBody",
  RichText: "Flow.Component.RichText",
  TextInput: "Flow.Component.TextInput",
  TextArea: "Flow.Component.TextArea",
  Button: "Flow.Component.Button",
  Footer: "Flow.Component.Footer",
  Image: "Flow.Component.Image",
  // Add other WhatsApp-specific component types
} as const;

// Component Configurations
export const COMPONENT_CONFIGS = {
  TextInput: {
    inputTypes: ['text', 'number', 'email', 'password', 'passcode', 'phone'] as const,
    maxChars: 80,
    helperTextMaxChars: 30,
    errorTextMaxChars: 20
  },
  TextArea: {
    maxLength: 600,
    helperTextMaxChars: 80,
    labelMaxChars: 20
  },
  TextHeading: {
    maxChars: 80
  },
  TextSubheading: {
    maxChars: 80
  },
  TextBody: {
    maxChars: 4096
  },
  TextCaption: {
    maxChars: 409
  }
} as const;

// Action Types
export const ACTION_TYPES = {
  navigate: "navigate",
  complete: "complete"
} as const;

// Derived Types
export type ComponentType = keyof typeof COMPONENT_TYPES;
export type ActionType = keyof typeof ACTION_TYPES;
export type InputType = typeof COMPONENT_CONFIGS.TextInput.inputTypes[number];

// DataSource Item Interface
export interface DataSourceItem {
  id: string;
  title: string;
  description?: string;
  enabled?: boolean;
}

// Action Interface
export interface Action {
  name: ActionType;
  payload: {
    screen?: string;
    [key: string]: any;
  };
}

// List Item Interface
export interface ListItem {
  'main-content': {
    title: string;
    description?: string;
  };
  start?: {
    image: string;
    'alt-text'?: string;
  };
  end?: {
    title?: string;
    description?: string;
  };
  tags?: string[];
  badge?: string;
  'on-click-action'?: Action;
}

// Flow Component Interface
export interface FlowComponent {
  type: `Flow.Component.${string}`;
  text?: string;
  label?: string;
  "on-click-action"?: {
    name: ActionType;
    payload: {
      screen?: string;
    };
  };
  name?: string;
  description?: string;
  required?: boolean;
  enabled?: boolean;
  visible?: boolean;
  markdown?: boolean;
  pattern?: string;
  
  // Data source
  'data-source'?: DataSourceItem[];
  
  // Input properties
  'helper-text'?: string;
  'input-type'?: InputType;
  'max-length'?: number;
  
  // Selection properties
  'min-selected-items'?: number;
  'max-selected-items'?: number;
  
  // Media properties
  'media-size'?: 'regular' | 'large';
  src?: string;
  width?: number;
  height?: number;
  'aspect-ratio'?: number;
  'scale-type'?: 'contain' | 'cover';
  'alt-text'?: string;
  
  // Actions
  'on-select-action'?: Action;
  'on-unselect-action'?: Action;
  'on-upload-action'?: Action;
  
  // Footer properties
  'left-caption'?: string;
  'center-caption'?: string;
  'right-caption'?: string;
  
  // Media upload properties
  'allow-image'?: boolean;
  'allow-document'?: boolean;
  'allow-video'?: boolean;
  'allow-audio'?: boolean;
  'max-size'?: number;
  'allowed-extensions'?: string;
  
  // Conditional rendering
  condition?: string;
  then?: FlowComponent[];
  else?: FlowComponent[];
  
  // Switch case
  cases?: Record<string, FlowComponent[]>;
  
  // Navigation list
  'list-items'?: ListItem[];
}

// Component Props Interfaces
export interface ComponentFactoryProps {
  type: ComponentType;
  config: FlowComponent;
  onChange: (updates: Partial<FlowComponent>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export interface BaseComponentProps {
  config: FlowComponent;
  onChange: (updates: Partial<FlowComponent>) => void;
}

// Screen Interface
export interface Screen {
  id: string;
  title: string;
  terminal: boolean;
  success?: boolean; // Only allowed when terminal is true
  layout: {
    type: "SingleColumnLayout"; // Changed from "Flow.Layout.SingleColumn"
    children: FlowComponent[];
  };
  data: Record<string, any>;
}

// Update the RoutingEdge interface
export interface RoutingEdge {
  // Change from object to string
  from: string;
  to: string;
}

// Flow Data Interface
export interface FlowData {
  id?: string;
  version: string;
  data_api_version: string;
  name: string;
  categories: string[];
  screens: Screen[];
  routing_model: {
    defaultScreen: string[];
    edges: RoutingEdge[];
  };
  metadata?: {
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
    description?: string;
    tags?: string[];
  };
}

// Validation Interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface WhatsAppValidation {
  isValid: boolean;
  errors: {
    code?: number;
    message: string;
    screen_id?: string;
  }[];
}

// Component Config Interface
export interface ComponentConfig {
  maxLength?: number;
  required?: boolean;
  pattern?: string;
  minSelected?: number;
  maxSelected?: number;
  allowedTypes?: string[];
  maxSize?: number;
}

// WhatsApp Component Configuration
export interface WhatsAppComponentConfig {
  type: string;
  maxLength?: number;
  allowedActions: ActionType[];
  requiredProperties: string[];
}

// WhatsApp Component Configurations
export const WHATSAPP_COMPONENT_CONFIGS: Record<string, WhatsAppComponentConfig> = {
  "Flow.Component.TextHeading": {
    type: "Flow.Component.TextHeading",
    maxLength: 80,
    allowedActions: [],
    requiredProperties: ["text"]
  },
  "Flow.Component.Button": {
    type: "Flow.Component.Button",
    maxLength: 20,
    allowedActions: ["navigate"],
    requiredProperties: ["label", "on-click-action"]
  },
  "Flow.Component.Footer": {
    type: "Flow.Component.Footer",
    maxLength: 20,
    allowedActions: ["complete"],
    requiredProperties: ["label", "on-click-action"]
  }
};

// Component Groups
export const COMPONENT_GROUPS = {
  Text: [
    COMPONENT_TYPES.TextHeading,
    COMPONENT_TYPES.TextSubheading,
    COMPONENT_TYPES.TextBody,
    COMPONENT_TYPES.TextCaption,
    COMPONENT_TYPES.RichText,
  ],
  Input: [
    COMPONENT_TYPES.TextInput,
    COMPONENT_TYPES.TextArea,
  ],
  Interactive: [
    COMPONENT_TYPES.Button,
    COMPONENT_TYPES.Footer,
  ],
  Media: [
   COMPONENT_TYPES.Image,
  ],
} as const;

// Navigation related types
export interface NavigationState {
  currentScreenId: string;
  history: string[];
  data: Record<string, any>;
}

export interface NavigationOptions {
  condition?: string;
  payload?: Record<string, any>;
  skipValidation?: boolean;
}

// Flow validation types
export interface FlowValidation {
  isValid: boolean;
  errors: {
    screen_id?: string;
    message: string;
  }[];
}

// Utility function to create default flow
export const createDefaultFlow = (): FlowData => ({
  version: "5.0",
  data_api_version: "1.0",
  name: "more flow",
  categories: ["OTHER"],
  screens: [
    {
      id: "START",
      title: "Start",
      terminal: false,
      success: false,
      layout: {
        type: "Flow.Layout.SingleColumn",
        children: []
      },
      data: {},
    }
  ],
  routing_model: {
    defaultScreen: ["START"],
    edges: []
  }
});

// Action result type
export interface ActionResult {
  success: boolean;
  error?: string;
  data?: Record<string, any>;
  nextScreen?: string;
}

// Flow context type
export interface FlowContext {
  currentScreen: Screen;
  data: Record<string, any>;
  history: string[];
  actions: Record<string, ActionHandler>;
}

// Template types
export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  flow: Omit<FlowData, 'metadata'>;
  category: string;
  tags?: string[];
}

// Helper Types
export type ComponentGroup = keyof typeof COMPONENT_GROUPS;
export type ComponentValidationFn = (config: FlowComponent) => ValidationResult;
export type ActionHandler = (action: Action, context: any) => Promise<void>;