import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const PdfViewer = ({ document }) => {
  // Handle null or undefined document
  if (!document || !document.id) {
    return (
      <Alert variant="destructive" className="w-full max-w-xl">
        <AlertDescription>Invalid document data provided</AlertDescription>
      </Alert>
    );
  }

  const pdfUrl = document.id;

  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf'; // You can customize the filename
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="w-full space-y-2">
      
      <div className="w-full h-screen max-h-[600px] border rounded-lg overflow-hidden">
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full"
          title="PDF viewer"
        />
      </div>
    </div>
  );
};

export default PdfViewer;

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
        <PdfViewer document={parsedMessage.document} />
      { /*<PdfViewer pdfUrl={text} />*/}
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