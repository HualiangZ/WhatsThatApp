import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            modalChatVisible: false,
            chatListData:[]
        }

    }

    async getData() {
        return fetch("http://localhost:3333/api/1.0.0/chat", {
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    chatListData: responseJson,
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

    async createChat(){

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
                <Modal animationType="none"
                    visible={this.state.modalChatVisible}
                    transparent={true}
                    onRequestClose={() => { this.setState({ modalChatVisible: !this.state.modalChatVisible }) }}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Hello World!</Text>

                            <TouchableOpacity onPress={() => this.setState({ modalChatVisible: !this.state.modalChatVisible })}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Create Chat</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Modal>
                <TouchableOpacity onPress={() => this.setState({ modalChatVisible: true })}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Create Chat</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    button: {
        marginBottom: 30,
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
        padding: 35,
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
})