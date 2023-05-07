/* eslint-disable react/prop-types */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ChatDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalChatVisible: false,
      error: '',
      contactListData: [],
      MembersListData: [],
      search: '',
      offset: '',
      limit: 4,
      name: '',
    };
    this.onPressButton = this.onPressButton.bind(this);
  }

  async componentDidMount() {
    this.getMember();
  }

  onPressButton() {
    this.setState({
      error: '',
    });

    if (!(this.state.name)) {
      this.setState({ error: 'Enter chat name' });
    } else {
      this.upateName();
      this.props.navigation.navigate('Chat');
    }
  }

  async getMember() {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chat_id')}`, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          return this.setState({ error: 'Not authenticated' });
        } if (response.status === 403) {
          return this.setState({ error: 'Not allowed' });
        } if (response.status === 404) {
          return this.props.navigation.navigate('Chat');
        }
        return this.setState({ error: 'something went wrong' });
      }).then((rjson) => {
        this.setState({
          MembersListData: rjson.members,
        });
      })

      .catch((error) => {
        this.setState({
        });
        console.log(error);
      });
  }

  incrementValue = () => {
    if (this.state.contactListData.length === this.state.limit) {
      this.setState({ offset: this.state.offset + this.state.limit }, () => {
        this.searchButton();
      });
    }
  };

  decreaseValue = () => {
    if (this.state.offset !== 0) {
      this.setState({ offset: this.state.offset - this.state.limit }, () => {
        this.searchButton();
      });
    }
  };

  async removeMember(userId) {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chat_id')}/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          if (userId === await AsyncStorage.getItem('whatsthat_id')) {
            return this.props.navigation.navigate('Chat');
          }
          return this.getMember();
        } if (response.status === 400) {
          return this.setState({ error: 'something went wrong' });
        }
        return this.setState({ error: 'something went wrong' });
      });
  }

  async upateName() {
    const toSend = {};

    if (this.state.name !== '') {
      toSend.name = this.state.name;
    }
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chat_id')}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 401) {
          return this.setState({ error: 'Not authenticated' });
        } if (response.status === 403) {
          return this.setState({ error: 'Not allowed' });
        } if (response.status === 404) {
          return this.setState({ error: 'Not there' });
        }
        return this.setState({ error: 'something went wrong' });
      }).then((rjson) => {
        this.setState({
          MembersListData: rjson.members,
        });
      })

      .catch((error) => {
        this.setState({
        });
        console.log(error);
      });
  }

  async addToChat(userId) {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chat_id')}/user/${userId}`, {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })

      .then((response) => {
        if (response.status === 200) {
          return this.getMember();
        } if (response.status === 400) {
          return this.setState({ error: 'user does not exist' });
        }
        return this.setState({ error: 'user does not exist' });
      })

      .catch((error) => {
        console.error(error);
      });
  }

  async searchButton() {
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search}&search_in=contacts&limit=${this.state.limit}&offset=${this.state.offset}`, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          contactListData: responseJson,

        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => { this.setState({ modalChatVisible: true }); }}>
            <Text style={styles.buttonText}>Add User</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder="Edit chat name"
            style={{
              height: 40, borderWidth: 1, width: '80%', marginBottom: 10, marginLeft: 5,
            }}
            onChangeText={(name) => this.setState({ name })}
            defaultValue={this.state.name}
          />
          <View style={styles.button}>
            <TouchableOpacity onPress={() => { this.onPressButton(); this.setState({ name: '' }); }}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={this.state.MembersListData}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ flex: 1 }}>
                {item.first_name}
                {' '}
                {item.last_name}
                {'\n'}
                {item.email}
              </Text>

              <View style={styles.button}>
                <TouchableOpacity onPress={() => { this.removeMember(item.user_id); }}>
                  <Text style={styles.buttonText}>Remove User</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
                placeholder="search"
                onSelectionChange={() => { this.searchButton(); this.setState({ offset: 0 }); }}
                onChangeText={(search) => this.setState({ search })}
                defaultValue={this.state.search}
              />
              <Button
                title="Search"
                onPress={() => this.searchButton()}
              />

              <FlatList
                data={this.state.contactListData}
                renderItem={({ item }) => (
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ flex: 1 }}>
                      {item.given_name}
                      {' '}
                      {item.family_name}
                      {'\n'}
                      {item.email}
                    </Text>
                    <View style={styles.button}>
                      <TouchableOpacity onPress={() => this.addToChat(item.user_id)}>
                        <Text style={styles.buttonText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                    <Text>{this.state.error}</Text>
                  </View>
                )}
              />
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => { this.decreaseValue(); }}>
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => { this.incrementValue(); }}>
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
