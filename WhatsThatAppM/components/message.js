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
      message: '',
      messageId: '',
      messageListData: [],
      modalChatVisible: false,
      modalError: false,
    };
  }

  async componentDidMount() {
    this.getMessages();
    setInterval(() => {
      this.getMessages();
    }, 1000);
  }

  async getMessages() {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chat_id')}`, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          return this.setState({ error: 'Not authenticated', modalError: !this.state.modalError });
        } if (response.status === 403) {
          return this.setState({ error: 'Not allowed', modalError: !this.state.modalError });
        } if (response.status === 404) {
          return this.setState({ error: 'Not there', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'something went wrong', modalError: !this.state.modalError });
      }).then((rjson) => {
        this.setState({
          messageListData: rjson.messages,
        });
      })

      .catch((error) => {
        this.setState({
        });
        console.log(error);
      });
  }

  async updateMessage(messageId) {
    const toSend = {};
    if (this.state.message !== '') {
      toSend.message = this.state.message;
    }
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chat_id')}/message/${messageId}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ message: '' });
          this.getMessages();
          this.setState({ modalChatVisible: !this.state.modalChatVisible });
          return response.json;
        }
        return this.setState({ error: 'Please enter something in the textbox to update ', modalError: !this.state.modalError });
      }).catch((error) => console.log(error));
  }

  async addMessage() {
    const toSend = {};
    if (this.state.message !== '') {
      toSend.message = this.state.message;
    }
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chat_id')}/message`, {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ message: '' });
          this.getMessages();
          return response.json;
        } if (response.status === 400) {
          return this.setState({ error: 'Please enter something in the textbox to send', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'Something went wrong', modalError: !this.state.modalError });
      }).catch((error) => console.log(error));
  }

  // eslint-disable-next-line class-methods-use-this
  dateTime(epoch) {
    const myDate = new Date(epoch * 1000);
    return myDate.toLocaleString();
  }

  async deleteMessage(messageId) {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chat_id')
    }/message/${messageId}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getMessages();
          this.setState({ modalChatVisible: !this.state.modalChatVisible });
          return response.json;
        } if (response.status === 400) {
          return this.setState({ error: 'unable to delete message', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'Something went wrong', modalError: !this.state.modalError });
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ marginTop: 10, marginBottom: 10 }}
          data={this.state.messageListData}
          keyExtractor={({ message_id: messageId }) => messageId}
          inverted
          renderItem={({ item }) => (
            <View>
              <View style={{ marginTop: 10 }}>
                <Text onPress={async () => {
                  // eslint-disable-next-line no-lone-blocks
                  {
                    // eslint-disable-next-line eqeqeq
                    if (item.author.user_id == await AsyncStorage.getItem('whatsthat_id')) {
                      this.setState({
                        modalChatVisible: !this.state.modalChatVisible,
                        messageId: item.message_id,
                      });
                    }
                  }
                }}
                >
                  {item.author.first_name}
                  {' '}
                  {': '}
                  {item.message}
                  {'\n'}
                  {this.dateTime(item.timestamp)}
                </Text>
              </View>

            </View>
          )}
        />

        {/* update/delete message modal */}
        <Modal
          animationType="none"
          visible={this.state.modalChatVisible}
          transparent
          // eslint-disable-next-line max-len
          onRequestClose={() => { this.setState({ modalChatVisible: !this.state.modalChatVisible }); }}
        >

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={{ height: 40, borderWidth: 1, width: '100%' }}
                placeholder="Enter here to update message"
                onChangeText={(message) => this.setState({ message })}
                defaultValue={this.state.message}
              />

              <TouchableOpacity onPress={() => {
                this.updateMessage(this.state.messageId);
              }}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Update</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                this.deleteMessage(this.state.messageId);
              }}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Delete</Text>
                </View>
              </TouchableOpacity>

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
                <Text style={styles.modalText}>{this.state.error}</Text>
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

        <View style={{ flexDirection: 'row' }}>

          <TextInput
            placeholder="Text message"
            style={{
              height: 40, borderWidth: 1, width: '80%', marginBottom: 10, marginLeft: 5,
            }}
            value={this.state.message}
            onChangeText={(message) => this.setState({ message })}
          />
          <View style={styles.button}>
            <TouchableOpacity onPress={() => { this.addMessage(); this.setState({ message: '' }); }}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: '#2196F3',

  },
  buttonText: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
