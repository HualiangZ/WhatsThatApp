/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Button, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
  Modal, Image,
} from 'react-native';

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      offset: 0,
      contactListData: [],
      search: '',
      modalError: false,
      photo: {},
      searchQ: false,
    };
  }

  componentDidMount() {
    this.getContact();
  }

  async getContact() {
    return fetch('http://localhost:3333/api/1.0.0/contacts', {
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
        this.setState({
          isLoading: false,
        });
        console.log(error);
      });
  }

  incrementValue() {
    if (this.state.contactListData.length === 2) {
      this.setState({ offset: this.state.offset + 2, isLoading: true }, () => {
        this.searchButton();
      });
    }
  }

  decreaseValue() {
    if (this.state.offset !== 0) {
      this.setState({ offset: this.state.offset - 2, isLoading: true }, () => {
        this.searchButton();
      });
    }
  }

  async profileImage(userId) {
    fetch(`http://localhost:3333/api/1.0.0/user/${
      userId}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.blob())
      .then((responseBlob) => {
        const data = URL.createObjectURL(responseBlob);
        this.setState((prevState) => ({
          photo: {
            ...prevState.photo,
            [userId]: data,
          },
          isLoading: false,
        }));
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        console.log(err);
      });
  }

  async searchButton() {
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search}&search_in=contacts&limit=2&offset=${this.state.offset}`, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          contactListData: responseJson,
          searchQ: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async removeUser(userId) {
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          this.getContact();
          return response.json();
        } if (response.status === 400) {
          return this.setState({ error: 'unable to remove contact', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'unable to remove contact', modalError: !this.state.modalError });
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
          this.getContact();
          return response.json();
        } if (response.status === 400) {
          return this.setState({ error: 'unable to block contact', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'unable to block contact', modalError: !this.state.modalError });
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <FlatList
            data={this.state.contactListData}
            renderItem={({ item }) => {
              this.profileImage(item.user_id);
            }}
          />
          <Text>No contacts</Text>
        </View>

      );
    }
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
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

        {this.state.searchQ
          && (
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <FlatList
              data={this.state.contactListData}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={{ uri: this.state.photo[item.user_id] }}
                    style={{ width: 60, height: 60 }}
                  />
                  <Text style={{ flex: 1 }}>
                    {item.given_name}
                    {' '}
                    {item.family_name}
                    {'\n'}
                    {item.email}
                  </Text>
                  <View style={styles.button}>
                    <TouchableOpacity onPress={() => { this.blockUser(item.user_id); }}>
                      <Text style={styles.buttonText}>Block</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.button}>
                    <TouchableOpacity onPress={() => { this.removeUser(item.user_id); }}>
                      <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.button}>
                <TouchableOpacity onPress={() => {
                  this.decreaseValue();
                }}
                >
                  <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.button}>
                <TouchableOpacity onPress={() => {
                  this.incrementValue();
                }}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          )}
        {!this.state.searchQ
          && (
          <FlatList
            data={this.state.contactListData}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Image
                  source={{ uri: this.state.photo[item.user_id] }}
                  style={{ width: 60, height: 60 }}
                />
                <Text style={{ flex: 1 }}>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                  {'\n'}
                  {item.email}
                </Text>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => { this.blockUser(item.user_id); }}>
                    <Text style={styles.buttonText}>Block</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => { this.removeUser(item.user_id); }}>
                    <Text style={styles.buttonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          )}
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
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 5,
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
