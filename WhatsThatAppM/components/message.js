import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: "",
            messageListData:[],
            error: "",
            submitted: false
        }
    }

    async addMessage(){
        let to_send = { message: this.state.message };
        return fetch("http://localhost:3333/api/1.0.0/chat/"  + await AsyncStorage.getItem("chat_id")+ "/message", {
            method: "POST",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
            if(response.status === 200){
                this.setState({message:""})
                this.getMessages()
            }else{
                this.setState({error:"err"})
            }
        }).catch((error)=>console.log(error))
    }

    async getMessages() {
        return fetch("http://localhost:3333/api/1.0.0/chat/"  + await AsyncStorage.getItem("chat_id"), {
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
        })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                    this.setState({error:"Not authenticated"})
                }else if(response.status === 403){
                    this.setState({error:"Not allowed"})
                }
                else if(response.status === 404){
                    this.setState({error:"Not there"})
                }else{
                    this.setState({error:"something went wrong"})
                }
            }).then((rjson)=>{
                this.setState({
                    messageListData:rjson.messages
                })
            })

            .catch((error) => {
                this.setState({
                });
                console.log(error);
            });
    }

    async componentDidMount(){
        this.getMessages()
        console.log(this.state.messageListData)
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection:"column"}}>
                
                <FlatList
                    style={{marginTop:10}}
                    data={this.state.messageListData}
                    keyExtractor={({message_id}) =>message_id}
                    renderItem={({ item }) => (
                        <View style={{marginTop:10}}>
                            <Text>{item.message}</Text>
                        </View>)}
                />

                <View style={{flexDirection:"row"}}>
                    <TextInput
                        placeholder="Text message"
                        style={{ height: 40, borderWidth: 1, width: "80%", marginBottom: 10, marginLeft:5 }}
                        onChangeText={message => this.setState({ message })}
                        defaultValue={this.state.message}
                    />
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => {this.addMessage(), this.setState({message:""})}}>
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
        padding:10,
        color: 'white'
    },
});