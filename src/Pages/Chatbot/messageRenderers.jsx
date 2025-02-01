import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { getFilePlugin } from "@react-pdf-viewer/get-file";

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const PdfViewer = ({ pdfUrl }) => {
  const toolbarPluginInstance = toolbarPlugin();
  const getFilePluginInstance = getFilePlugin();
  
  return (
    <div className="flex flex-col md:flex-row items-end md:items-center">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "5px" }}>
        <getFilePluginInstance.Download />
      </div>
      <div style={{ display: "flex", height: "400px", width: "600px" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
          <Viewer 
            fileUrl={pdfUrl}
            plugins={[toolbarPluginInstance, getFilePluginInstance]} 
          />
        </Worker>
      </div>
    </div>
  );
};

export const renderTemplateMessage = (template) => {
  if (!template || !template.name) {
    return <div className="error">Invalid template message</div>;
  }
  return (
    <div className="template-message">
      <p>Template: {template.name}</p>
    </div>
  );
};

export const renderInteractiveMessage = (parsedMessage) => {
  let { type, interactive, text, image, template } = parsedMessage;

  if (type === 'interactive') {
    if (interactive.type === 'list') {
      return (
        <div className="interactive-message list-message">
          <p className="message-text">{interactive.body.text}</p>
          <ul className="message-list">
            {interactive.action.sections.map((section, sectionIndex) => (
              <li key={sectionIndex} className="list-section">
                {section.title && <h4 className="section-title">{section.title}</h4>}
                <ul>
                  {section.rows.map((row) => (
                    <li key={row.id} className="list-item">
                      {row.title}
                      {row.description && <p className="item-description">{row.description}</p>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (interactive.type === 'button') {
      return (
        <div className="interactive-message button-message">
          <p className="message-text">{interactive.body.text}</p>
          <div className="message-buttons">
            {interactive.action.buttons.map((button, buttonIndex) => (
              <button key={buttonIndex} className="interactive-button">
                {button.reply.title}
              </button>
            ))}
          </div>
        </div>
      );
    } 
    else if (interactive.type === 'product') {
      return (
        <div className='interactive-message product-card'>
          <div className='product-image'>
            <img 
              src={interactive.action.product_details.image_link} 
              alt={interactive.action.product_details.title}
              className='product-img'
            />
          </div>
          <div className='product-info'>
            <h3 className='product-title'>{interactive.action.product_details.title}</h3>
            <p className='product-price'>Rs. {interactive.action.product_details.price}</p>
            <p className='product-quantity'>In Stock: {interactive.action.product_details.quantity}</p>
          </div>
        </div>
      );
    }
  }else if (type === 'text') {
    return <p className="plain-message">{text.body}</p>;
  } else if (type === 'image') {
    return (
      <div className="image-message">
        <img src={image.id} alt="Sent image" className="message-image" />
        {image.caption && <p className="message-caption">{image.caption}</p>}
      </div>
    );
  } else if (type === 'template') {
    return renderTemplateMessage(template);
  } else if (type === 'document'){
    text = parsedMessage?.document?.id
    console.log("Document url: ", text)
    return (
      <div className="image-message">
        <PdfViewer pdfUrl={text} />
      </div>
    )
  }

  return <p className="error-message">Unsupported message type</p>;
};

export const renderMessageContent = (message) => {
  if (typeof message.text === 'object' && message.text !== null) {
    // Handle message types
    switch (message.text.type) {
      case 'text':
        return message.text.body || <div className="error">No text body provided</div>;

      case 'interactive':
        return renderInteractiveMessage(message.text.interactive) || <div className="error">Interactive message rendering failed</div>;

      case 'template':
        return renderTemplateMessage(message.text.template) || <div className="error">Template message rendering failed</div>;

      default:
        return <div className="error">Unknown message type: {message.text.type}</div>;
    }
  } else if (typeof message.text === 'string') {
    // Fallback for plain text messages
    return message.text || <div className="error">Message content is undefined</div>;
  }

  return <div className="error">Invalid message format</div>;
};