// src/components/whatsapp-flow/component-factory.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { COMPONENT_TYPES } from "./types";
import type { ComponentFactoryProps } from "./types";

// Import components from their respective folders
import { TextComponent, RichTextComponent } from "./components/text";
import { 
  TextInputComponent, 
  TextAreaComponent,
  CheckboxGroupComponent,
  RadioButtonsGroupComponent,
  DropdownComponent,
  DatePickerComponent
} from "./components/input";
import {
  FooterComponent,
  OptInComponent,
  EmbeddedLinkComponent
} from "./components/interactive";
import {
  ImageComponent,
  MediaUploadComponent
} from "./components/media";
import {
  IfComponent,
  SwitchComponent,
  NavigationListComponent,
  ChipsSelectorComponent
} from "./components/layout";

export function ComponentFactory({ 
  type, 
  config, 
  onChange, 
  onDelete, 
  onMoveUp, 
  onMoveDown 
}: ComponentFactoryProps) {
  const renderComponent = () => {
    switch (type) {
      // Text Components
      case COMPONENT_TYPES.TextHeading:
      case COMPONENT_TYPES.TextSubheading:
      case COMPONENT_TYPES.TextBody:
      case COMPONENT_TYPES.TextCaption:
        return <TextComponent type={type} config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.RichText:
        return <RichTextComponent config={config} onChange={onChange} />;
      
      // Input Components
      case COMPONENT_TYPES.TextInput:
        return <TextInputComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.TextArea:
        return <TextAreaComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.CheckboxGroup:
        return <CheckboxGroupComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.RadioButtonsGroup:
        return <RadioButtonsGroupComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.Dropdown:
        return <DropdownComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.DatePicker:
        return <DatePickerComponent config={config} onChange={onChange} />;
      
      // Interactive Components
      case COMPONENT_TYPES.Footer:
        return <FooterComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.OptIn:
        return <OptInComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.EmbeddedLink:
        return <EmbeddedLinkComponent config={config} onChange={onChange} />;
      
      // Media Components
      case COMPONENT_TYPES.Image:
        return <ImageComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.MediaUpload:
        return <MediaUploadComponent config={config} onChange={onChange} />;
      
      // Layout Components
      case COMPONENT_TYPES.If:
        return <IfComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.Switch:
        return <SwitchComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.NavigationList:
        return <NavigationListComponent config={config} onChange={onChange} />;
      
      case COMPONENT_TYPES.ChipsSelector:
        return <ChipsSelectorComponent config={config} onChange={onChange} />;
      
      default:
        return <div>Unsupported component type: {type}</div>;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">{type}</Label>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onMoveUp}
                title="Move Up"
              >
                ↑
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onMoveDown}
                title="Move Down"
              >
                ↓
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={onDelete}
                title="Delete Component"
              >
                Delete
              </Button>
            </div>
          </div>
          {renderComponent()}
        </div>
      </CardContent>
    </Card>
  );
}