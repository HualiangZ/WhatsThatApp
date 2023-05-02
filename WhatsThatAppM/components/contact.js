/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Button, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal,
} from 'react-native';

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactListData: [],
      search: '',
      modalError: false,
      searchQ: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    return fetch('http://localhost:3333/api/1.0.0/contacts', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
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

  async searchButton() {
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search}&search_in=contacts`, {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
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
          this.getData();
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
          this.getData();
          return response.json();
        } if (response.status === 400) {
          return this.setState({ error: 'unable to block contact', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'unable to block contact', modalError: !this.state.modalError });
      });
  }

  render() {
    // this.getData()
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View>
        <TextInput
          style={{ height: 40, borderWidth: 1, width: '100%' }}
          placeholder="search"
          onSelectionChange={() => this.searchButton()}
          onChangeText={(search) => this.setState({ search })}
          defaultValue={this.state.search}
        />
        <Button
          title="Search"
          onPress={() => this.searchButton()}
        />

        {this.state.searchQ
          && (
          <FlatList
            data={this.state.contactListData}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row' }}>
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
          )}
        {!this.state.searchQ
          && (
          <FlatList
            data={this.state.contactListData}
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
