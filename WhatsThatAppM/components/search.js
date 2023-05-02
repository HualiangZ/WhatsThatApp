/* eslint-disable no-use-before-define */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Button, FlatList, StyleSheet, Modal,
} from 'react-native';

export default class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataListData: [],
      search: '',
      offset: 0,
      error: '',
      modalError: false,
    //   photo: null,
    };
  }

  incrementValue = () => {
    if (this.state.dataListData.length === 2) {
      this.setState({ offset: this.state.offset + 2 }, () => {
        this.searchButton();
      });
    }
  };

  decreaseValue = () => {
    if (this.state.offset !== 0) {
      this.setState({ offset: this.state.offset - 2 }, () => {
        this.searchButton();
      });
    }
  };

  async searchButton() {
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search}&limit=2&offset=${this.state.offset}`, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataListData: responseJson,

        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async addContact(userId) {
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          this.setState({ error: 'Can not add yourself', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'unable to  add yourself' });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async blockUser(userId) {
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          return this.setState({ error: 'Can not block yourself', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'unable to block user', modalError: !this.state.modalError });
      });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'column' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TextInput
            style={{ height: 40, borderWidth: 1, width: '100%' }}
            placeholder="search"
            onSelectionChange={() => { this.searchButton(); }}
            onChangeText={(search) => this.setState({ search })}
            defaultValue={this.state.search}
          />
          <Button
            title="Search"
            onPress={() => { this.searchButton(); this.setState({ offset: 0 }); }}
          />
          <View>
            <FlatList
              data={this.state.dataListData}
              renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text>
                      {item.given_name}
                      {' '}
                      {item.family_name}
                      {'\n'}
                      {item.email}
                    </Text>
                  </View>

                  <View style={styles.button}>
                    <TouchableOpacity onPress={() => this.addContact(item.user_id)}>
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.button}>
                    <TouchableOpacity onPress={() => this.blockUser(item.user_id)}>
                      <Text style={styles.buttonText}>Block</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    // flex: 0.2,
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 10,
    color: 'white',
  },
  error: {
    color: 'red',
    fontWeight: '900',
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
