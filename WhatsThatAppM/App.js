/* eslint-disable linebreak-style */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import Tab from './components/tab-nav';
import Blocked from './components/blockUsers';
import Message from './components/message';
import ChatDetail from './components/chatDetail';
import Camera from './components/camera';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Tab" component={Tab} />
          <Stack.Screen name="Blocked" component={Blocked} />
          <Stack.Screen name="Message" component={Message} />
          <Stack.Screen name="ChatDetail" component={ChatDetail} />
          <Stack.Screen name="Camera" component={Camera} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
