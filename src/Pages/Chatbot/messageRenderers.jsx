import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import './messageStyles.css'; // Make sure to create this CSS file

export const renderMessageWithNewLines = (text) => {
  if (!text) return null;
  
  try {
    // Sanitize the text for JSON parsing without logging to console
    const sanitizedText = text.replace(/\\/g, "\\\\");
    
    // Decode Unicode escape sequences
    const decodedText = JSON.parse(`"${sanitizedText}"`);
    
    // Convert Unicode hex codes to actual emoji characters
    const emojiRenderedText = decodedText.replace(/\\u[\dA-F]{4}/gi, 
      match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
    
    // Split by \n and render with line breaks
    return emojiRenderedText.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < emojiRenderedText.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  } catch (error) {
    // Provide a more graceful fallback when parsing fails
    return <div className="message-error">Message could not be displayed properly</div>;
  }
};

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
      // Error handling without console logging
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

export const renderTemplateMessage = (template, isBot) => {
  if (!template || !template.name) {
    return <div className="error">Invalid template message</div>;
  }
  return (
    <div className={`template-message ${isBot ? 'bot-message' : 'user-message'}`}>
      <p className="template-text">Template: {template.name}</p>
    </div>
  );
};

export const renderInteractiveMessage = (parsedMessage, isBot) => {
  let { type, interactive, text, image, template } = parsedMessage;
  const messageClass = isBot ? 'bot-message' : 'user-message';

  if (type === 'interactive') {
    if (interactive.type === 'list') {
      return (
        <div className={`interactive-message list-message ${messageClass}`}>
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
        <div className={`interactive-message button-message ${messageClass}`}>
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
        <div className={`interactive-message product-card ${messageClass}`}>
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
  } else if (type === 'text') {
    // Using renderMessageWithNewLines for text body to handle newlines and emojis consistently
    return <div className={`plain-message ${messageClass}`}>{renderMessageWithNewLines(text.body)}</div>;
  } else if (type === 'image') {
    return (
      <div className={`image-message ${messageClass}`}>
        <img src={image.id} alt="Sent image" className="message-image" />
        {image.caption && <p className="message-caption">{image.caption}</p>}
      </div>
    );
  } else if (type === 'template') {
    return renderTemplateMessage(template, isBot);
  } else if (type === 'document'){
    return (
      <div className={`document-message ${messageClass}`}>
        <PdfViewer document={parsedMessage.document} />
      </div>
    );
  }

  return <p className={`error-message ${messageClass}`}>Unsupported message type</p>;
};

export const renderMessageContent = (message) => {
  // Determine if message is from a bot (assuming sender field is available)
  const isBot = message.sender === 'bot';
  
  if (typeof message.text === 'object' && message.text !== null) {
    // Handle message types
    switch (message.text.type) {
      case 'text':
        // Using renderMessageWithNewLines for text body
        return (
          <div className={`message-container ${isBot ? 'bot-container' : 'user-container'}`}>
            {message.text.body ? 
              <div className={`text-message ${isBot ? 'bot-message' : 'user-message'}`}>
                <span className="message-content">{renderMessageWithNewLines(message.text.body)}</span>
                {message.time && <span className="message-time">{message.time}</span>}
              </div> : 
              <div className={`error ${isBot ? 'bot-message' : 'user-message'}`}>
                <span className="error-content">No text body provided</span>
              </div>
            }
          </div>
        );

      case 'interactive':
        return (
          <div className={`message-container ${isBot ? 'bot-container' : 'user-container'}`}>
            {renderInteractiveMessage(message.text, isBot) || 
              <div className={`error ${isBot ? 'bot-message' : 'user-message'}`}>
                <span className="error-content">Interactive message rendering failed</span>
              </div>
            }
          </div>
        );

      case 'template':
        return (
          <div className={`message-container ${isBot ? 'bot-container' : 'user-container'}`}>
            {renderTemplateMessage(message.text.template, isBot) || 
              <div className={`error ${isBot ? 'bot-message' : 'user-message'}`}>
                <span className="error-content">Template message rendering failed</span>
              </div>
            }
          </div>
        );

      default:
        return (
          <div className={`message-container ${isBot ? 'bot-container' : 'user-container'}`}>
            <div className={`error ${isBot ? 'bot-message' : 'user-message'}`}>
              <span className="error-content">Unknown message type: {message.text.type}</span>
            </div>
          </div>
        );
    }
  } else if (typeof message.text === 'string') {
    // Fallback for plain text messages - using renderMessageWithNewLines
    return (
      <div className={`message-container ${isBot ? 'bot-container' : 'user-container'}`}>
        <div className={`plain-message ${isBot ? 'bot-message' : 'user-message'}`}>
          <span className="message-content">
            {message.text ? 
              renderMessageWithNewLines(message.text) : 
              <span className="error-content">Message content is undefined</span>
            }
          </span>
          {message.time && <span className="message-time">{message.time}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`message-container ${isBot ? 'bot-container' : 'user-container'}`}>
      <div className={`error ${isBot ? 'bot-message' : 'user-message'}`}>
        <span className="error-content">Invalid message format</span>
      </div>
    </div>
  );
};