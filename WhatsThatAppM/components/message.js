import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: "",
            messageId: "",
            messageListData: [],
            modalChatVisible: false,
            error: "",
            contactListData: [],
            search: "",
            searchQ: false,
            submitted: false,
            modalChatVisible: false
        }
    }

    async addMessage() {
        let to_send = { message: this.state.message };
        return fetch("http://localhost:3333/api/1.0.0/chat/" + await AsyncStorage.getItem("chat_id") + "/message", {
            method: "POST",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(to_send)
        })
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ message: "" })
                    this.getMessages()
                } else {
                    this.setState({ error: "err" })
                }
            }).catch((error) => console.log(error))
    }

    async updateMessage(messageId) {
        let to_send = {};
        if (this.state.message != "") {
            to_send["message"] = this.state.message
        }
        return fetch("http://localhost:3333/api/1.0.0/chat/" + await AsyncStorage.getItem("chat_id") + "/message/" + messageId, {
            method: "PATCH",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(to_send)
        })
            .then((response) => {
                if (response.status === 200) {
                    this.setState({ message: "" })
                    this.getMessages()
                } else {
                    this.setState({ error: "err" })
                }
            }).catch((error) => console.log(error))
    }


    async getMessages() {
        return fetch("http://localhost:3333/api/1.0.0/chat/" + await AsyncStorage.getItem("chat_id"), {
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 401) {
                    this.setState({ error: "Not authenticated" })
                } else if (response.status === 403) {
                    this.setState({ error: "Not allowed" })
                }
                else if (response.status === 404) {
                    this.setState({ error: "Not there" })
                } else {
                    this.setState({ error: "something went wrong" })
                }
            }).then((rjson) => {
                this.setState({
                    messageListData: rjson.messages
                })
            })

            .catch((error) => {
                this.setState({
                });
                console.log(error);
            });
    }

    async componentDidMount() {
        this.getMessages()
        console.log(this.state.messageListData)
    }

    dateTime(epoch){
        var myDate = new Date( epoch *1000);
        return myDate.toLocaleString();
    }

    async deleteMessage(messageId){
        return fetch("http://localhost:3333/api/1.0.0/chat/" + await AsyncStorage.getItem("chat_id")+ 
        "/message/" + messageId, {
            method:"DELETE",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
        })
        .then((response) => {
            if (response.status === 200) {
              this.getMessages();
              return response.json();
            } if (response.status === 400) {
              this.setState({ error: "error" })
            }
          })
    }

    

    render() {
        return (
            <View style={{ flex: 1}}>
                
                <FlatList
                    style={{ marginTop: 10,marginBottom: 10 }}
                    data={this.state.messageListData}
                    keyExtractor={({ message_id }) => message_id}
                    inverted={true}
                    renderItem={({ item }) => (
                        <View>
                            <View style={{ marginTop: 10}}>
                                <Text onPress={async () => { {if(item.author.user_id == await AsyncStorage.getItem("whatsthat_id")){
                                    this.setState({ modalChatVisible: !this.state.modalChatVisible, 
                                        messageId: item.message_id })
                                }} }}>
                                    {item.author.first_name} {": "}{item.message}{'\n'}{this.dateTime(item.timestamp)}
                                </Text>
                            </View>
                            
                        </View>
                    )}

                />
                <Modal animationType="none"
                                visible={this.state.modalChatVisible}
                                transparent={true}
                                onRequestClose={() => { this.setState({ modalChatVisible: !this.state.modalChatVisible }) }}>
                                
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <TextInput
                                            style={{ height: 40, borderWidth: 1, width: "100%" }}
                                            placeholder={""}
                                            onChangeText={message => this.setState({ message })}
                                            defaultValue={this.state.message}
                                        />

                                        <TouchableOpacity onPress={() => {
                                            this.updateMessage(this.state.messageId),
                                            this.setState({ modalChatVisible: !this.state.modalChatVisible })
                                        }}>
                                            <View style={styles.button}>
                                                <Text style={styles.buttonText}>Update</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            this.deleteMessage(this.state.messageId),
                                            this.setState({ modalChatVisible: !this.state.modalChatVisible })
                                        }}>
                                            <View style={styles.button}>
                                                <Text style={styles.buttonText}>Delete</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            this.setState({ modalChatVisible: !this.state.modalChatVisible })
                                        }}>
                                            <View style={styles.button}>
                                                <Text style={styles.buttonText}>Close</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                <View style={{ flexDirection: "row" }}>
                    <TextInput
                        placeholder="Text message"
                        style={{ height: 40, borderWidth: 1, width: "80%", marginBottom: 10, marginLeft: 5 }}
                        onChangeText={message => this.setState({ message })}
                        defaultValue={this.state.message}
                    />
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => { this.addMessage(), this.setState({ message: "" }) }}>
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                

            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        marginBottom: 10,
        marginLeft: 10,
        backgroundColor: '#2196F3',

    },
    buttonText: {
        textAlign: 'center',
        padding: 10,
        color: 'white'
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
});