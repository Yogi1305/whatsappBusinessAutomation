
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download, FileText, Check, Clock, ExternalLink, Video } from 'lucide-react';

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

// Rename the parameter from 'document' to 'docData' to avoid conflict
const PdfViewer = ({ document: docData, sender }) => {
  // Handle null or undefined document
  if (!docData || !docData.id) {
    return (
      <Alert variant="destructive" className={`w-full max-w-xl ${sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        <AlertDescription>Invalid document data provided</AlertDescription>
      </Alert>
    );
  }

  // Make sure we have a complete URL
  const getFullUrl = (url) => {
    if (!url) return '';
    
    // If it's already an absolute URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative URL, make it absolute
    const apiBaseUrl = window.location.origin;
    return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const pdfUrl = getFullUrl(docData.id);
  const documentName = docData.filename || 'PDF Document';

  const handleDownload = () => {
    try {
      // Now this will correctly use the global document object
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = documentName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Opening PDF at URL:', pdfUrl);
    } catch (error) {
      console.error('Failed to open document:', error);
    }
  };

  return (
    <div className={`document-container ${sender === 'user' ? 'user-document' : 'bot-document'}`}>
      <div className="document-header">
        <FileText className="document-icon" />
        <span className="document-title">{documentName}</span>
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
        <div className="pdf-container">
          <div className="pdf-placeholder">
            <FileText size={48} className="text-gray-400 mb-2" />
            <p className="text-gray-600 mb-4">PDF Document</p>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="flex items-center"
              >
                <ExternalLink size={16} className="mr-2" />
                Open Document
              </Button>
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add VideoPlayer component
const VideoPlayer = ({ video, sender }) => {
  // Handle null or undefined video
  if (!video || !video.id) {
    return (
      <Alert variant="destructive" className={`w-full max-w-xl ${sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        <AlertDescription>Invalid video data provided</AlertDescription>
      </Alert>
    );
  }

  // Make sure we have a complete URL
  const getFullUrl = (url) => {
    if (!url) return '';
    
    // If it's already an absolute URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative URL, make it absolute
    const apiBaseUrl = window.location.origin;
    return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const videoUrl = getFullUrl(video.id);
  const videoName = video.filename || 'Video';

  

  return (
    <div className={`video-container ${sender === 'user' ? 'user-video' : 'bot-video'}`}>
      <div className="video-header">
        <Video className="video-icon" size={18} />
        <span className="video-title">{videoName}</span>
        
      </div>
      
      <div className="video-preview">
        <video 
          src={videoUrl} 
          controls 
          className="video-player"
          width="100%"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      
      {video.caption && (
        <div className="video-caption">
          {video.caption}
        </div>
      )}
      
      
    </div>
  );
};

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
  let { type, interactive, text, image, template, document, video } = parsedMessage;

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
  } else if (type === 'document') {
    return (
      <div className={`${containerClass} document-message`}>
        <PdfViewer document={parsedMessage.document} sender={sender} />
      </div>
    );
  } else if (type === 'video') {
    return (
      <div className={`${containerClass} video-message`}>
        <VideoPlayer video={parsedMessage.video} sender={sender} />
      </div>
    );
  }

  return (
    <div className={`${containerClass} error-message`}>
      Unsupported message type: {type}
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
  } else if (message.type === 'video') {
    // Handle video messages
    return (
      <MessageWrapper>
        <VideoPlayer video={message} sender={sender} />
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

// Main export
export default PdfViewer;