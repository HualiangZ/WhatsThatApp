/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class BlockUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      blockedListData: [],
      error: '',
      modalError: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    return fetch('http://localhost:3333/api/1.0.0/blocked', {
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          blockedListData: responseJson,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        console.log(error);
      });
  }

  async unblockUser(userId) {
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
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
          return this.setState({ error: 'Unable to unblock user please try again', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'Something went wrong', modalError: !this.state.modalError });
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View>
        <FlatList
          data={this.state.blockedListData}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                  {'\n'}
                  {item.email}
                </Text>
              </View>
              <View style={styles.button}>
                <TouchableOpacity onPress={() => { this.unblockUser(item.user_id); }}>
                  <Text style={styles.buttonText}>Unblock User</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 0.2,
    alignItems: 'flex-end',
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
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
