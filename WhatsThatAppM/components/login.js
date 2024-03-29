/* eslint-disable react/prop-types */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      submitted: false,
    };

    this.onPressButton = this.onPressButton.bind(this);
  }

  onLogin() {
    const toSend = {
      email: this.state.email,
      password: this.state.password,
    };
    return fetch(
      'http://localhost:3333/api/1.0.0/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSend),
      },
    )

      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          return this.setState({ error: 'Email or Password incorrect' });
        }
        return this.setState({ error: 'Email or Password incorrect' });
      })
      .then(async (rJson) => {
        try {
          await AsyncStorage.setItem('whatsthat_id', rJson.id);
          await AsyncStorage.setItem('whatsthat_token', rJson.token);
          this.setState({ submitted: false });
          this.props.navigation.navigate('Tab');
        } catch {
          return this.setState({ error: 'Email or Password incorrect' });
        }
        return 0;
      })

      .catch((error) => {
        console.error(error);
      });
  }

  onPressButton() {
    this.setState({ submitted: true });
    this.setState({ error: '' });

    if (!(this.state.email && this.state.password)) {
      this.setState({ error: 'Must enter email and password' });
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Must enter valid email' });
      return;
    }

    console.log('Validated and ready to send to the API');
    this.onLogin();
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.formContainer}>
          <View style={styles.email}>
            <Text>Email:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter email"
              onChangeText={(email) => this.setState({ email })}
              defaultValue={this.state.email}
            />

            <Text>
              {this.state.submitted && !this.state.email
                            && <Text style={styles.error}>*Email is required</Text>}
            </Text>
          </View>

          <View style={styles.password}>
            <Text>Password:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter password"
              onChangeText={(password) => this.setState({ password })}
              defaultValue={this.state.password}
              secureTextEntry
            />

            <Text>
              {this.state.submitted && !this.state.password
                            && <Text style={styles.error}>*Password is required</Text>}
            </Text>
          </View>

          <View style={styles.loginbtn}>
            <TouchableOpacity onPress={this.onPressButton}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text>
            {this.state.error
                        && <Text style={styles.error}>{this.state.error}</Text>}
          </Text>

          <View>
            <Text onPress={() => this.props.navigation.navigate('Signup')} style={styles.signup}>Need an account?</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  loginbtn: {

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
});
