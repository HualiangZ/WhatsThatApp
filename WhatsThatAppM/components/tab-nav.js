import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();


import Chat from './chat';
import ContactScreen from './contact';
import SearchScreen from './search';
import ProfileScreen from './profile';


export default class App extends Component {
//screenOptions={{headerShown:false}}
  render(){
    return (
        <Tab.Navigator initialRouteName="Chat">
          <Tab.Screen name="Chat" component={Chat}/>
          <Tab.Screen name="Contact" component={ContactScreen} options={{unmountOnBlur: true}} />
          <Tab.Screen name="Search" component={SearchScreen}/>
          <Tab.Screen name="Profile" component={ProfileScreen}/>
        </Tab.Navigator>
        
      

    )
  }
} 