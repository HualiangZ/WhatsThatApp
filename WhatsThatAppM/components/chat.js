import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            modalChatVisible: false,
            chatListData: [],
            error: "",
            submitted: false
        }
        this._onPressButton = this._onPressButton.bind(this)
    }

    async getChat() {
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

    componentDidMount() {
        this.getChat();
    }

    async createChat() {
        let to_send = { name: this.state.name };

        return fetch("http://localhost:3333/api/1.0.0/chat", {
            method: "POST",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(to_send)
        })

            .then((response) => {
                if (response.status === 200) {
                    return response.json;
                } if (response.status === 400) {
                    this.setState({ error: "Something whent wrong try again" })
                }


            })


    }

    _onPressButton() {
        this.setState({
            submitted: true,
            error: "",
        })

        if (!(this.state.name)) {
            this.setState({ error: "Enter chat name" })
        }

        this.createChat()
        this.getChat()
    }

    render() {
        return (
            <View>
                <Modal animationType="none"
                    visible={this.state.modalChatVisible}
                    transparent={true}
                    onRequestClose={() => { this.setState({ modalChatVisible: !this.state.modalChatVisible }) }}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TextInput
                                style={{ height: 40, borderWidth: 1, width: "100%", marginBottom: 10,}}
                                placeholder="Enter chat name"
                                onChangeText={name => this.setState({ name })}
                                defaultValue={this.state.name}
                            />

                            <TouchableOpacity onPress={() => {this.getChat(), this._onPressButton(), this.setState({ modalChatVisible: !this.state.modalChatVisible })}}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Create Chat</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { this.setState({ modalChatVisible: !this.state.modalChatVisible }) }}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </View>
                            </TouchableOpacity>

                            <>
                                {this.state.error &&
                                    <Text style={styles.error}>{this.state.error}</Text>
                                }
                            </>

                        </View>
                    </View>

                </Modal>
                <TouchableOpacity onPress={() => this.setState({ modalChatVisible: true })}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Create Chat</Text>
                    </View>
                </TouchableOpacity>
      
                <FlatList
                    style={{marginTop:10}}
                    data={this.state.chatListData}
                    renderItem={({ item }) => (
                        <View>
                            <Text padding>{item.name}</Text>
                        </View>)}
                />

            </View>
        )
    }

}

const styles = StyleSheet.create({
    button: {
        marginBottom:10,
        backgroundColor: '#2196F3'
    },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'white'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 80,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    error: {
        color: "red",
        fontWeight: '900'
    },
})