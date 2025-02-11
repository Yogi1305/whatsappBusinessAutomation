// src/components/whatsapp-flow/components/whatsapp-preview.tsx

import { ComponentType, FlowComponent, Screen,FlowData } from "./types";
import { NavigationPreview } from "./navigation-preview";
interface WhatsAppPreviewProps {
  screen: Screen | null;
  flow: FlowData; 
}

export function WhatsAppPreview({ screen, flow }: WhatsAppPreviewProps) {
  if (!screen) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Select a screen to preview</p>
      </div>
    );
  }

  const renderComponent = (element: FlowComponent) => {
    switch (element.type) {
      // Text Components
      case "TextHeading":
        return <h1 className="text-xl font-bold mb-2">{element.text}</h1>;
      
      case "TextSubheading":
        return <h2 className="text-lg font-semibold mb-2">{element.text}</h2>;
      
      case "TextBody":
        return element.markdown ? (
          <p className="text-base mb-2 whitespace-pre-wrap">{element.text}</p>
        ) : (
          <p className="text-base mb-2">{element.text}</p>
        );
      
      case "TextCaption":
        return <p className="text-sm text-gray-600 mb-2">{element.text}</p>;
      
      case "RichText":
        return (
          <div className="prose prose-sm max-w-none mb-2">
            {/* You might want to add a markdown parser here */}
            <pre>{element.text}</pre>
          </div>
        );

      // Input Components
      case "TextInput":
        return (
          <div className="mb-4">
            {element.label && (
              <label className="block text-sm font-medium mb-1">{element.label}</label>
            )}
            <input
              type={element["input-type"] || "text"}
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Enter text..."
              disabled
            />
            {element["helper-text"] && (
              <p className="text-xs text-gray-500 mt-1">{element["helper-text"]}</p>
            )}
          </div>
        );

      case "TextArea":
        return (
          <div className="mb-4">
            {element.label && (
              <label className="block text-sm font-medium mb-1">{element.label}</label>
            )}
            <textarea
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              placeholder="Enter text..."
              disabled
              rows={3}
            />
            {element["helper-text"] && (
              <p className="text-xs text-gray-500 mt-1">{element["helper-text"]}</p>
            )}
          </div>
        );

      case "CheckboxGroup":
      case "RadioButtonsGroup":
        return (
          <div className="mb-4">
            {element.label && (
              <label className="block text-sm font-medium mb-2">{element.label}</label>
            )}
            {element["data-source"]?.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type={element.type === "CheckboxGroup" ? "checkbox" : "radio"}
                  className="mr-2"
                  disabled
                  checked={false}
                />
                <span className="text-sm">{item.title}</span>
              </div>
            ))}
          </div>
        );

      // Interactive Components
      case "Footer":
        return (
          <div className="mt-4 space-y-2">
            {element.label && (
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium">
                {element.label}
              </button>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{element["left-caption"]}</span>
              <span>{element["center-caption"]}</span>
              <span>{element["right-caption"]}</span>
            </div>
          </div>
        );

      case "OptIn":
        return (
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" className="rounded" disabled />
            <label className="text-sm">{element.label}</label>
          </div>
        );

      case "EmbeddedLink":
        return (
          <a href="#" className="text-blue-600 hover:underline mb-2 block">
            {element.text}
          </a>
        );

      // Media Components
      case "Image":
        return (
          <div className="mb-4">
            {element.src && (
              <img
                src={element.src}
                alt={element["alt-text"] || ""}
                className={`rounded-lg ${
                  element["scale-type"] === "cover" ? "object-cover" : "object-contain"
                }`}
                style={{
                  width: element.width || "100%",
                  height: element.height,
                  aspectRatio: element["aspect-ratio"]
                }}
              />
            )}
          </div>
        );

      case "MediaUpload":
        return (
          <div className="mb-4">
            <button className="w-full py-8 border-2 border-dashed rounded-lg text-gray-500 text-sm">
              {element.label || "Upload Media"}
            </button>
          </div>
        );

      // Layout Components
      case "ChipsSelector":
        return (
          <div className="mb-4">
            {element.label && (
              <label className="block text-sm font-medium mb-2">{element.label}</label>
            )}
            <div className="flex flex-wrap gap-2">
              {element["data-source"]?.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        );case "Dropdown":
        return (
          <div className="mb-4">
            {element.label && (
              <label className="block text-sm font-medium mb-1">{element.label}</label>
            )}
            <div className="relative">
              <select
                className="w-full px-3 py-2 border rounded-md bg-gray-50 appearance-none"
                disabled
              >
                <option value="">Select an option...</option>
                {element["data-source"]?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {element["helper-text"] && (
              <p className="text-xs text-gray-500 mt-1">{element["helper-text"]}</p>
            )}
          </div>
        );
  
      case "DatePicker":
        return (
          <div className="mb-4">
            {element.label && (
              <label className="block text-sm font-medium mb-1">{element.label}</label>
            )}
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-md bg-gray-50"
              disabled
            />
            {element["helper-text"] && (
              <p className="text-xs text-gray-500 mt-1">{element["helper-text"]}</p>
            )}
          </div>
        );
  
      case "If":
        return (
          <div className="border-l-2 border-gray-200 pl-3 mb-4">
            <div className="text-xs text-gray-500 mb-2">If: {element.condition}</div>
            {element.then?.map((child, index) => (
              <div key={index}>{renderComponent(child)}</div>
            ))}
          </div>
        );
  
      case "Switch":
        return (
          <div className="border-l-2 border-gray-200 pl-3 mb-4">
            <div className="text-xs text-gray-500 mb-2">Switch: {element.condition}</div>
            {Object.entries(element.cases || {}).map(([key, components], index) => (
              <div key={index} className="mb-2">
                <div className="text-xs text-gray-400">Case: {key}</div>
                {components.map((child, childIndex) => (
                  <div key={childIndex}>{renderComponent(child)}</div>
                ))}
              </div>
            ))}
          </div>
        );
  
      case "NavigationList":
        return (
          <div className="mb-4">
            {element["list-items"]?.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg mb-2">
                {item.start?.image && (
                  <img
                    src={item.start.image}
                    alt={item.start["alt-text"] || ""}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{item["main-content"].title}</div>
                  {item["main-content"].description && (
                    <div className="text-sm text-gray-500">
                      {item["main-content"].description}
                    </div>
                  )}
                </div>
                {item.end && (
                  <div className="text-right">
                    {item.end.title && (
                      <div className="font-medium">{item.end.title}</div>
                    )}
                    {item.end.description && (
                      <div className="text-sm text-gray-500">
                        {item.end.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
  
      default:
        return (
          <div className="p-2 border border-gray-200 rounded mb-2">
            <div className="text-sm text-red-500">Unsupported component: {element.type}</div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-[360px] bg-gray-100 p-4 rounded-lg border border-gray-200">
    <div className="bg-white rounded-lg shadow-sm p-4">
      {screen.layout.children.map((element, index) => (
        <div key={index}>{renderComponent(element)}</div>
      ))}
      
      {/* Only show navigation preview if we have both screen and flow */}
      {screen && flow && <NavigationPreview flow={flow} currentScreen={screen} />}
    </div>
  </div>
  );
}