import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class blockUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            blockedListData: [],
            search: "",
            searchQ: false
        }
    }

    async getData() {
        return fetch("http://localhost:3333/api/1.0.0/blocked", {
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    blockedListData: responseJson,
                });

            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                });
                console.log(error);
            });
    }

    async unblockUser(userId) {
        return fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/block", {
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
                <FlatList
                    data={this.state.blockedListData}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={{ flex: 1 }}>
                                <Text>
                                    {item.first_name} {item.last_name}{"\n"}
                                    {item.email}
                                </Text>
                            </View>
                            <View style={styles.button}>
                                <TouchableOpacity onPress={() => {this.unblockUser(item.user_id)}}>
                                    <Text style={styles.buttonText}>Unblock User</Text>
                                </TouchableOpacity>
                            </View>
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
    button: {
        flex: 0.2,
        alignItems: 'flex-end',
        marginBottom: 10,
        marginLeft: 10,
        backgroundColor: '#2196F3'
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
});