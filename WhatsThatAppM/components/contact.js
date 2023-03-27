import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

export default class Contact extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      contactListData: [],
      search: "",
      searchQ: false
    }
  }


  async searchButton() {
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.search + "&search_in=contacts", {
      headers: {
        "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {

          this.setState({
            isLoading: false,
            contactListData: responseJson,
            searchQ: true

          });
        


      })
      .catch((error) => {
        console.log(error);
      });
  }


  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/contacts", {
      headers: {
        "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
      }
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
  componentDidMount() {
    this.getData();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <View>
        <TextInput
          style={{ height: 40, borderWidth: 1, width: "100%" }}
          placeholder="search"
          onSelectionChange={() => this.searchButton()}
          onChangeText={search => this.setState({ search })}
          defaultValue={this.state.search}
        />
        <Button
          title="Search"
          onPress={() => this.searchButton()}
        />

        {this.state.searchQ && <FlatList
          data={this.state.contactListData}
          renderItem={({ item }) => (
            <View>
              <Text>{item.given_name}</Text>
            </View>)}
        />}

        <FlatList
          data={this.state.contactListData}
          renderItem={({ item }) => (
            <View>
              <Text>{item.first_name}</Text>
            </View>)}
        />

      </View>
    )
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});