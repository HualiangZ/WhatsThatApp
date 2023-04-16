import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import Tab from './components/tab-nav'
import Blocked from './components/blockUsers';
import Message from "./components/message"
import ChatDetail from './components/chatDetail';
export default class App extends Component {

  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Signup" component={SignupScreen}/>
          <Stack.Screen name="Tab" component={Tab}/>
          <Stack.Screen options={{headerShown: true}} name="Blocked" component={Blocked}/>
          <Stack.Screen options={{headerShown: true}} name="Message" component={Message}/>
          <Stack.Screen options={{headerShown: true}} name="ChatDetail" component={ChatDetail}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});