/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      modalChatVisible: false,
      chatListData: [],
      error: '',
      submitted: false,
      modalError: false,
    };
    this.onPressButton = this.onPressButton.bind(this);
  }

  async componentDidMount() {
    // eslint-disable-next-line react/no-unused-class-component-methods
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getChat();
    });
  }

  onPressButton() {
    this.setState({
      submitted: true,
    });

    if (!(this.state.name)) {
      this.setState({ error: 'Enter chat name' });
    } else {
      this.setState({ modalChatVisible: !this.state.modalChatVisible });
      this.createChat();
    }
  }

  async getChat() {
    return fetch('http://localhost:3333/api/1.0.0/chat', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          chatListData: responseJson,
        });
      })
      .catch((error) => {
        this.setState({
        });
        console.log(error);
      });
  }

  async getchatId(id) {
    await AsyncStorage.setItem('chat_id', id);
  }

  async createChat() {
    const toSend = { name: this.state.name };

    return fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })

      .then((response) => {
        if (response.status === 201) {
          this.getChat();
          return response.json();
        } if (response.status === 400) {
          return this.setState({ error: 'Something whent wrong try again', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'Something whent wrong try again', modalError: !this.state.modalError });
      });
  }

  render() {
    return (

      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => this.setState({ modalChatVisible: true })}>
          <View style={[styles.button, { padding: 15 }]}>
            <Text style={styles.buttonText}>Create Chat</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          style={{ marginTop: 10 }}
          data={this.state.chatListData}
          renderItem={({ item }) => (
            <View style={{ marginTop: 10, flexDirection: 'row', flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Text onPress={() => { this.props.navigation.navigate('Message'); this.getchatId(item.chat_id); }}>{item.name}</Text>
              </View>
              <View style={styles.button}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('ChatDetail'); this.getchatId(item.chat_id); }}>
                  <Text style={styles.buttonText}>Chat Details</Text>
                </TouchableOpacity>
              </View>
            </View>

          )}
        />
        {/* create chat modal */}
        <Modal
          animationType="none"
          visible={this.state.modalChatVisible}
          transparent
          onRequestClose={() => { this.setState({ modalChatVisible: !this.state.modalChatVisible }); }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Enter chat name"
                style={{
                  height: 40, borderWidth: 1, width: '100%', marginBottom: 10,
                }}
                onChangeText={(name) => this.setState({ name })}
                defaultValue={this.state.name}
              />
              <Text>
                {this.state.submitted && !this.state.name
                                    && <Text style={styles.error}>*Chat name is required</Text>}
              </Text>
              <TouchableOpacity onPress={() => { this.onPressButton(); }}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Create Chat</Text>
                </View>
              </TouchableOpacity>
              <Text>{this.state.error}</Text>
              <TouchableOpacity onPress={() => {
                this.setState({ modalChatVisible: !this.state.modalChatVisible });
              }}
              >

                <View style={styles.button}>
                  <Text style={styles.buttonText}>Close</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Error handling modal */}
        <Modal
          animationType="none"
          visible={this.state.modalError}
          transparent
          // eslint-disable-next-line max-len
          onRequestClose={() => { this.setState({ modalError: !this.state.modalError }); }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text>{this.state.error}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                this.setState({ modalError: !this.state.modalError });
              }}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Close</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontWeight: '900',
  },

});
