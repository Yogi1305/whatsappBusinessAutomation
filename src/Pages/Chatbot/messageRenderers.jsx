import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download, FileText, Check, Clock } from 'lucide-react';

export const renderMessageWithNewLines = (text, sender) => {
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
    return (
      <div className={`message-bubble ${sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
        {emojiRenderedText.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < emojiRenderedText.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    );
  } catch (error) {
    // Provide a more graceful fallback when parsing fails
    return (
      <div className={`message-bubble ${sender === 'user' ? 'user-bubble error-bubble' : 'bot-bubble error-bubble'}`}>
        Message could not be displayed properly
      </div>
    );
  }
};

const PdfViewer = ({ document, sender }) => {
  // Handle null or undefined document
  if (!document || !document.id) {
    return (
      <Alert variant="destructive" className={`w-full max-w-xl ${sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
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
    <div className={`document-container ${sender === 'user' ? 'user-document' : 'bot-document'}`}>
      <div className="document-header">
        <FileText className="document-icon" />
        <span className="document-title">PDF Document</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="download-button" 
          onClick={handleDownload}
        >
          <Download size={16} />
        </Button>
      </div>
      <div className="document-preview">
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

export const renderTemplateMessage = (template, sender) => {
  if (!template || !template.name) {
    return (
      <div className={`template-message ${sender === 'user' ? 'user-template' : 'bot-template'}`}>
        <div className="error">Invalid template message</div>
      </div>
    );
  }
  return (
    <div className={`template-message ${sender === 'user' ? 'user-template' : 'bot-template'}`}>
      <div className="template-header">Template Message</div>
      <p className="template-name">{template.name}</p>
    </div>
  );
};

export const renderInteractiveMessage = (parsedMessage, sender) => {
  let { type, interactive, text, image, template, document } = parsedMessage;

  const containerClass = `interactive-container ${sender === 'user' ? 'user-interactive' : 'bot-interactive'}`;

  if (type === 'interactive') {
    if (interactive.type === 'list') {
      return (
        <div className={`${containerClass} list-message`}>
          {/* <div className="interactive-header">Interactive Message</div> */}
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
        <div className={`${containerClass} button-message`}>
          {/* <div className="interactive-header">Interactive Message</div> */}
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
        <div className={`${containerClass} product-card`}>
          <div className="interactive-header">Product</div>
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
    return renderMessageWithNewLines(text.body, sender);
  } else if (type === 'image') {
    return (
      <div className={`${containerClass} image-message`}>
        <div className="image-wrapper">
          <img src={image.id} alt="Sent image" className="message-image" />
        </div>
        {image.caption && <p className="message-caption">{image.caption}</p>}
      </div>
    );
  } else if (type === 'template') {
    return renderTemplateMessage(template, sender);
  } else if (type === 'document'){
    return (
      <div className={`${containerClass} document-message`}>
        <PdfViewer document={parsedMessage.document} sender={sender} />
      </div>
    );
  }

  return (
    <div className={`${containerClass} error-message`}>
      Unsupported message type
    </div>
  );
};

export const renderMessageContent = (message) => {
  const sender = message.sender || 'bot';
  
  // Add message status indicators
  const renderMessageStatus = () => {
    if (message.pending) {
      return <Clock size={14} className="message-status-icon pending" />;
    } else if (message.failed) {
      return <div className="message-status-icon failed">!</div>;
    } else if (sender === 'bot') {
      return <Check size={14} className="message-status-icon sent" />;
    }
    return null;
  };
  
  // Wrapper for all message types with proper alignment
  const MessageWrapper = ({ children }) => (
    <div className={`message-wrapper ${sender === 'user' ? 'user-message-wrapper' : 'bot-message-wrapper'}`}>
      {children}
      <div className="message-status">
        {renderMessageStatus()}
        <span className="message-time">
          {message.time ? new Date(message.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
        </span>
      </div>
    </div>
  );

  if (typeof message.text === 'object' && message.text !== null) {
    // Handle message types
    switch (message.text.type) {
      case 'text':
        return (
          <MessageWrapper>
            {message.text.body ? 
              renderMessageWithNewLines(message.text.body, sender) : 
              <div className="error">No text body provided</div>}
          </MessageWrapper>
        );

      case 'interactive':
        return (
          <MessageWrapper>
            {renderInteractiveMessage(message.text.interactive, sender) || 
              <div className="error">Interactive message rendering failed</div>}
          </MessageWrapper>
        );

      case 'template':
        return (
          <MessageWrapper>
            {renderTemplateMessage(message.text.template, sender) || 
              <div className="error">Template message rendering failed</div>}
          </MessageWrapper>
        );

      default:
        return (
          <MessageWrapper>
            <div className="error">Unknown message type: {message.text.type}</div>
          </MessageWrapper>
        );
    }
  } else if (typeof message.text === 'string') {
    // Fallback for plain text messages - using renderMessageWithNewLines
    return (
      <MessageWrapper>
        {message.text ? 
          renderMessageWithNewLines(message.text, sender) : 
          <div className="error">Message content is undefined</div>}
      </MessageWrapper>
    );
  } else if (message.type === 'image') {
    // Handle image messages
    return (
      <MessageWrapper>
        <div className={`image-container ${sender === 'user' ? 'user-image' : 'bot-image'}`}>
          <img src={message.imageUrl} alt="Sent image" className="message-image" />
          {message.caption && <p className="image-caption">{message.caption}</p>}
        </div>
      </MessageWrapper>
    );
  } else if (message.type === 'document') {
    // Handle document messages
    return (
      <MessageWrapper>
        <PdfViewer document={message} sender={sender} />
      </MessageWrapper>
    );
  }

  return (
    <MessageWrapper>
      <div className="error">Invalid message format</div>
    </MessageWrapper>
  );
};