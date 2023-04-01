import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalChatVisible: false,
            chatListData: [],
            error: "",
            submitted: false
        }
    }


    async getMessages() {
        return fetch("http://localhost:3333/api/1.0.0/chat", {
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    chatListData: responseJson,
                });

            })
            .catch((error) => {
                this.setState({
                });
                console.log(error);
            });
    }

    render() {
        return (
            <View>
            <Text>Test</Text>
            </View>
        )
    }
}