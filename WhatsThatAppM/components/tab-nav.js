import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import ContactScreen from './contact';
import SearchScreen from './search';
import ProfileScreen from './profile';

export default class App extends Component {

  render(){
    return (

        <Tab.Navigator screenOptions={{headerShown:false}} initialRouteName="Contact">
          <Tab.Screen name="Contact" component={ContactScreen}/>
          <Tab.Screen name="Search" component={SearchScreen}/>
          <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
    )
  }
} 