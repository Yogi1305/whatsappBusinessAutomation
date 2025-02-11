// src/components/whatsapp-flow/utils.ts

import { COMPONENT_TYPES } from './types';
import type { FlowComponent } from './types';

export function createDefaultComponent(type: string): FlowComponent {
  const baseComponent = { type: type as keyof typeof COMPONENT_TYPES };
  const timestamp = Date.now();

  switch (type) {
    case COMPONENT_TYPES.TextHeading:
    case COMPONENT_TYPES.TextSubheading:
    case COMPONENT_TYPES.TextBody:
    case COMPONENT_TYPES.TextCaption:
      return {
        ...baseComponent,
        text: "New Text",
      };

    case COMPONENT_TYPES.TextInput:
      return {
        ...baseComponent,
        label: "New Input",
        name: `field_${timestamp}`,
        "input-type": "text",
        required: false,
      };

    case COMPONENT_TYPES.TextArea:
      return {
        ...baseComponent,
        label: "New Text Area",
        name: `field_${timestamp}`,
        required: false,
      };

    case COMPONENT_TYPES.CheckboxGroup:
    case COMPONENT_TYPES.RadioButtonsGroup:
      return {
        ...baseComponent,
        label: "New Group",
        name: `field_${timestamp}`,
        "data-source": [],
        required: false,
      };

    case COMPONENT_TYPES.Dropdown:
      return {
        ...baseComponent,
        label: "New Dropdown",
        name: `field_${timestamp}`,
        "data-source": [],
        required: false,
      };

    case COMPONENT_TYPES.Footer:
      return {
        ...baseComponent,
        label: "Continue",
        "on-click-action": {
          name: "navigate",
          next: { type: "screen", name: "" },
          payload: {},
        },
      };

    case COMPONENT_TYPES.OptIn:
      return {
        ...baseComponent,
        label: "I agree to the terms",
        name: `optin_${timestamp}`,
        required: false,
      };

    case COMPONENT_TYPES.DatePicker:
      return {
        ...baseComponent,
        label: "Select Date",
        name: `date_${timestamp}`,
        required: false,
      };

    case COMPONENT_TYPES.Image:
      return {
        ...baseComponent,
        "alt-text": "",
        "scale-type": "contain",
      };

    case COMPONENT_TYPES.MediaUpload:
      return {
        ...baseComponent,
        label: "Upload Media",
        name: `media_${timestamp}`,
        "allow-image": true,
        "allow-document": true,
        "max-size": 5, // 5MB default
      };

    case COMPONENT_TYPES.EmbeddedLink:
      return {
        ...baseComponent,
        text: "Click here",
        "on-click-action": {
          name: "open_url",
          url: "",
        },
      };

    case COMPONENT_TYPES.ChipsSelector:
      return {
        ...baseComponent,
        label: "Select Options",
        name: `chips_${timestamp}`,
        "data-source": [],
        "min-selected-items": 1,
        "max-selected-items": 3,
      };

    case COMPONENT_TYPES.If:
      return {
        ...baseComponent,
        condition: "",
        then: [],
        else: [],
      };

    case COMPONENT_TYPES.Switch:
      return {
        ...baseComponent,
        condition: "",
        cases: {},
      };

    case COMPONENT_TYPES.NavigationList:
      return {
        ...baseComponent,
        "list-items": [],
      };

    default:
      return baseComponent;
  }
}