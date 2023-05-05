/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profile: {},
      error: '',
      modalError: false,
      submitted: false,
      photo: null,
    };
    this.onPressButton = this.onPressButton.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-unused-class-component-methods
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.profileImage();
      this.getUser();
    });
  }

  onPressButton() {
    this.setState({ submitted: true });
    this.setState({ error: '' });

    if (!EmailValidator.validate(this.state.email) && this.state.email !== '') {
      this.setState({ error: 'Must enter valid email' });
      return;
    }

    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!PASSWORD_REGEX.test(this.state.password) && this.state.password !== '') {
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
      return;
    }

    console.log(`Button clicked: ${this.state.submitted}`);
    console.log('Validated and ready to send to the API');
    this.patchUser();
  }

  async getUser() {
    fetch(`http://localhost:3333/api/1.0.0/user/${
      await AsyncStorage.getItem('whatsthat_id')}`, {
      method: 'GET',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return this.setState({ error: 'Something went wrong', modalError: !this.state.modalError });
      })
      .then((rJson) => {
        this.setState({
          profile: rJson,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async profileImage() {
    fetch(`http://localhost:3333/api/1.0.0/user/${
      await AsyncStorage.getItem('whatsthat_id')}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
      },
    })
      .then((response) => response.blob())
      .then((responseBlob) => {
        const data = URL.createObjectURL(responseBlob);
        this.setState({
          photo: data,
        });
      })
      .catch((err) => {
        this.setState({
        });
        console.log(err);
      });
  }

  async patchUser() {
    const toSend = {};

    if (this.state.firstName !== '' && this.state.firstName !== this.state.profile.first_name) {
      toSend.first_name = this.state.firstName;
    }

    if (this.state.lastName !== '' && this.state.lastName !== this.state.profile.last_name) {
      toSend.last_name = this.state.lastName;
    }

    if (this.state.email !== '' && this.state.email !== this.state.profile.email) {
      toSend.email = this.state.email;
    }

    if (this.state.password !== '') {
      toSend.password = this.state.password;
    }

    console.log(toSend);
    return fetch(
      `http://localhost:3333/api/1.0.0/user/${
        await AsyncStorage.getItem('whatsthat_id')}`,
      {
        method: 'PATCH',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toSend),
      },
    )

      .then((response) => {
        if (response.status === 200) {
          return this.getUser();
        } if (response.status === 400) {
          return this.setState({ error: 'Something went wrong please try again', modalError: !this.state.modalError });
        }
        return this.setState({ error: 'Something went wrong please try again', modalError: !this.state.modalError });
      })

      .catch((error) => {
        console.error(error);
      });
  }

  async logout() {
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: { 'X-Authorization': await AsyncStorage.getItem('whatsthat_token') },
    })
      .then(async (response) => {
        if (response.status === 200) {
          AsyncStorage.getAllKeys()
            .then((keys) => AsyncStorage.multiRemove(keys));
          return this.props.navigation.navigate('Login');
        } if (response.status === 401) {
          AsyncStorage.getAllKeys()
            .then((keys) => AsyncStorage.multiRemove(keys));
          return this.props.navigation.navigate('Login');
        }
        return this.setState({ error: 'Something went wrong please try again', modalError: !this.state.modalError });
      });
  }

  render() {
    if (this.state.photo) {
      return (
        <View style={styles.container}>

          <View style={styles.formContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: this.state.photo }} style={{ width: 100, height: 100 }} />
              <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Camera')}>
                  <View style={styles.button}>
                    <Text style={[styles.buttonText, { padding: 5 }]}>Update image</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>
                  First Name:
                </Text>
                <Text>
                  {this.state.profile.first_name}
                </Text>
              </Text>
              <TextInput
                style={{ height: 40, borderWidth: 1, width: '100%' }}
                placeholder="Edit your first name"
                onChangeText={(firstName) => this.setState({ firstName })}
                defaultValue={this.state.profile.first_name}
              />
            </View>

            <View>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>
                  Last Name:
                </Text>
                <Text>
                  {this.state.profile.last_name}
                </Text>
              </Text>

              <TextInput
                style={{ height: 40, borderWidth: 1, width: '100%' }}
                placeholder="Edit your last name"
                onChangeText={(lastName) => this.setState({ lastName })}
                defaultValue={this.state.profile.last_name}
              />

            </View>

            <View style={styles.email}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>
                  Email:
                </Text>
                <Text>
                  {this.state.profile.email}
                </Text>
              </Text>
              <TextInput
                style={{ height: 40, borderWidth: 1, width: '100%' }}
                placeholder="Edit email"
                onChangeText={(email) => this.setState({ email })}
                defaultValue={this.state.profile.email}
              />
            </View>

            <View style={styles.password}>
              <Text style={{ fontWeight: 'bold' }}>Password:</Text>
              <TextInput
                style={{ height: 40, borderWidth: 1, width: '100%' }}
                placeholder="Edit password"
                onChangeText={(password) => this.setState({ password })}
                defaultValue={this.state.password}
                secureTextEntry
              />

            </View>

            <View>
              <TouchableOpacity onPress={this.onPressButton}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Update</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Blocked')}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>View Blocked Users</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => this.logout()}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text>
              {this.state.error
                                && <Text style={styles.error}>{this.state.error}</Text>}
            </Text>
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
        </View>

      );
    }
    return (<Text>loading</Text>);
  }
}

const styles = StyleSheet.create({
  profileImg: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  formContainer: {
    flex: 1,
    width: '80%',
    justifyContent: 'center',
  },
  email: {
    marginBottom: 5,
  },
  password: {
    marginBottom: 10,
  },
  signup: {
    justifyContent: 'center',
    textDecorationLine: 'underline',
  },
  button: {
    marginBottom: 30,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
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
