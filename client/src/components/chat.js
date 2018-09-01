import React, { Component } from 'react';
// [{ nickName: "William", text: "Hi test message",  }, { nickName: "Other Guy", text: "Hi test message 2",  }]

  class Chat extends Component {
    handelSubmitMessage = (e) => {
      e.preventDefault();
      const message = e.target.elements.message.value.trim();
      if (message) {
        this.props.sendMessage(message);
      }
      e.target.elements.message.value = '';
    }

    render() {
      return (
          <aside className="flex-aside video-aside">
            <ul className="chat-box">
              {
                this.props.messages.map((message) => ( <li key={message.index}> {message.from}{message.text}</li> ))
              }
            </ul>
            <form onSubmit={this.handelSubmitMessage}>
                  <input autoComplete="off" placeholder="Type a Message!" type="text" name="message" autoFocus/>
                  <button>Chat</button>
            </form>
          </aside>
      );
    }
  }

  export default Chat;
