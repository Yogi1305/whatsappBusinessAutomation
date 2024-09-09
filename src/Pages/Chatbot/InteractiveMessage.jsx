import React, { useState } from 'react';

const InteractiveMessage = ({ message }) => {
  const [isListVisible, setIsListVisible] = useState(false);

  const handleButtonClick = () => {
    setIsListVisible(!isListVisible);
  };

  const { type, interactive, text } = message;

  if (type === 'interactive') {
    if (interactive.type === 'list') {
      return (
        <div className="interactive-message">
          <div className="message-text">{interactive.body.text}</div>
          <button className="choose-option-button" onClick={handleButtonClick}>
            {interactive.action.button}
          </button>
          {isListVisible && (
            <div className="message-buttons">
              {interactive.action.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="section">
                  {section.rows.map((row) => (
                    <button key={row.id} className="button">
                      {row.title}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else if (interactive.type === 'button') {
      return (
        <div className="interactive-message">
          <div className="message-text">{interactive.body.text}</div>
          <div className="message-buttons">
            {interactive.action.buttons.map((button, buttonIndex) => (
              <button key={buttonIndex} className="button">
                {button.reply.title}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (interactive.type === 'text') {
      return (
        <div className="interactive-message">
          <div className="message-text">
            {interactive.text.body}
          </div>
        </div>
      );
    }
  } else if (type === 'text') {
    return (
      <div className="plain-message">
        {text.body}
      </div>
    );
  }

  return <div className="error">Unsupported message type</div>;
};

export default InteractiveMessage;
