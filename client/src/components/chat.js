import React, { Component } from 'react';
// [{ nickName: "William", text: "Hi test message",  }, { nickName: "Other Guy", text: "Hi test message 2",  }]

  class Chat extends Component {
    handelAddNickname = (e) => {
      e.preventDefault();
      const nickName = e.target.elements.nickName.value.trim();
      if (nickName) {
        this.props.setNickname(nickName);
      }
      e.target.elements.nickName.value = '';
    }
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
        <chat className="chat">
          <ul>
          {
            this.props.messages.map((message) => ( <li key={message.index}>{message.from}: {message.text}</li> ))
          }
        </ul>
        { this.props.nickNameIsSet?
          (<form onSubmit={this.handelAddNickname}>
            <input autoComplete="off" type="text" name="nickName" autoFocus/>
            <button>Add Chat Nick Name</button>
          </form>)
          :
          (<form onSubmit={this.handelSubmitMessage}>
            <input autoComplete="off" placeholder="Enter Message" type="text" name="message" autoFocus/>
            <button>Submit</button>
          </form>)
        }
        </chat>
      );
    }
  }

  export default Chat;
