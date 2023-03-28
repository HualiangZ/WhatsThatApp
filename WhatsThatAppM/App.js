import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import Tab from './components/tab-nav'

export default class App extends Component {

  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Signup" component={SignupScreen}/>
          <Stack.Screen name="Tab" component={Tab}/>
          
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