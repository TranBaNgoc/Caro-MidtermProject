import React from 'react';

const Message = props => {
  const { isOwn, content  } = props;

  return (
    <div style={isOwn === false ?{textAlign: '-webkit-left', marginBottom: '10px'}:{textAlign: '-webkit-right', marginBottom: '10px'}}>
      <div className="message-text" style={isOwn?{}:{background: 'linear-gradient(#02aab0, #00cdac)'}}>{content}</div>
    </div>
  );
};

export default Message;