import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, FlatList } from 'react-native';

export default class Contact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            dataListData:[],
            search:""
        }
    }

    async searchButton(){
        return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.search, {
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
        }
    })
            .then((response) => response.json())
            .then((responseJson) => {

            this.setState({
            isLoading: false,
            dataListData: responseJson,
            });

      })
      .catch((error) =>{
        console.log(error);
      });
    }


    render(){
        return (
    <View>
        <TextInput
            style={{height: 40, borderWidth: 1, width: "100%"}}
            placeholder="search"
            onSelectionChange={() => this.searchButton()}
            onChangeText={search => this.setState({search})}  
            defaultValue={this.state.search}
        />
        <Button 
            title="Search"
            onPress={() => this.searchButton()}
        />

        <FlatList
            data={this.state.dataListData}
            renderItem={({item}) => (
            <View>
                <Text>
                    {item.given_name}
                </Text>
                    
            </View>)}
        />
        
    </View>
    )};
}