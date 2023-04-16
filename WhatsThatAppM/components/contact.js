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

  async removeUser(userId) {
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/contact", {
      method: "DELETE",
      headers: {
        "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
      }
    })
    .then((response) => {
      if (response.status === 200) {
        this.getData();
        return response.json();
      } if (response.status === 400) {
        this.setState({ error: "error" })
      }
    })
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

  async blockUser(userId) {
    return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/block", {
      method: "POST",
      headers: {
        "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
      }
    })
      .then((response) => {
        if (response.status === 201) {
          this.getData();
          return response.json();
        } if (response.status === 400) {
          this.setState({ error: "error" })
        }
      })
  }


  componentDidMount() {
    this.getData();
  }

  render() {
    //this.getData()
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      )
    }
    return (
      <View 
      >
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

        {this.state.searchQ &&
          <FlatList
            data={this.state.contactListData}
            renderItem={({ item }) => (
              <View style={{flexDirection: "row" }}>
                <Text style={{ flex: 1 }}>
                  {item.given_name} {item.family_name}{"\n"}
                  {item.email}
                </Text>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => { this.getData(), this.blockUser(item.user_id) }}>
                    <Text style={styles.buttonText}>Block User</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => { this.getData(), this.removeUser(item.user_id) }}>
                    <Text style={styles.buttonText}>Remove User</Text>
                  </TouchableOpacity>
                </View>
              </View>)}
          />}
        {!this.state.searchQ &&
          <FlatList
            data={this.state.contactListData}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: "row" }}>
                  <Text style={{ flex: 1 }}>
                    {item.first_name} {item.last_name}{"\n"}
                    {item.email}
                  </Text>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => { this.getData(), this.blockUser(item.user_id) }}>
                    <Text style={styles.buttonText}>Block User</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => { this.getData(), this.removeUser(item.user_id) }}>
                    <Text style={styles.buttonText}>Remove User</Text>
                  </TouchableOpacity>
                </View>
              </View>)}
          />}

      </View>
    )
  };
}


const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
    marginLeft: 10,
    backgroundColor: '#2196F3'
  },
  buttonText: {
    textAlign: 'center',
    padding: 5,
    color: 'white'
  },
});