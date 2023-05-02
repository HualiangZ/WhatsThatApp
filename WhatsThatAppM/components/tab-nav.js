/* eslint-disable linebreak-style */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Chat from './chat';
import ContactScreen from './contact';
import SearchScreen from './search';
import ProfileScreen from './profile';

const Tab = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      <Tab.Navigator initialRouteName="Chat">
        <Tab.Screen name="Chat" component={Chat} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="Contact" component={ContactScreen} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="Search" component={SearchScreen} options={{ unmountOnBlur: true }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ unmountOnBlur: true }} />
      </Tab.Navigator>

    );
  }
}
