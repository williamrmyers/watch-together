import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class NameModal extends React.Component {

  handleSetName = (e) => {
    e.preventDefault();

    const nickName = e.target.elements.nickName.value.trim();
    const error = false;

    if (nickName) {
      this.props.handleSetName( nickName );
    }

    if (!error) {
      e.target.elements.nickName.value = '';
    }
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h4>Enter your chat nickname</h4>
          <p>{this.props.modalMessage}</p>
          <form onSubmit={this.handleSetName}>
            <input autoComplete="off" type="text" name="nickName" autoFocus/>
            <button>Submit</button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default NameModal;
