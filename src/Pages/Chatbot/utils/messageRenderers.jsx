export const renderInteractiveMessage = (messageData) => {
    switch (messageData.type) {
      case 'button':
        return (
          <div className="interactive-message button-message">
            <h4 className="button-header">{messageData.header}</h4>
            <p className="button-text">{messageData.text}</p>
            <div className="button-container">
              {messageData.buttons.map((btn, index) => (
                <button key={index} className="message-button">
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="interactive-message list-message">
            <h4 className="list-header">{messageData.header}</h4>
            <p className="list-text">{messageData.text}</p>
            <div className="list-options">
              {messageData.items.map((item, index) => (
                <div key={index} className="list-item">
                  {item.title}
                  <p className="item-description">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="unknown-message">[Unsupported message format]</div>;
    }
  };