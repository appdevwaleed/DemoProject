import React, { Component } from 'react';  
import { StyleSheet, Text, View, Image } from 'react-native';  
//import { GiftedChat } from 'react-native-gifted-chat';

class ChatBot extends Component {  

  constructor(props) {
    // Required step: always call the parent class' constructor
    super(props);

    // Set the state directly. Use props if necessary.
    this.state = {
      messages: [
        {
          _id: 1,
          text: `Hi! I am the FAQ bot 🤖 from Jscrambler.\n\nHow may I help you with today?`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'FAQ Bot',
            avatar: 'https://i.imgur.com/7k12EPD.png'
          }
        }
      ]
    };
  
  }

 
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        /> */}
      </View>
    );
  }
}

export default ChatBot;  
