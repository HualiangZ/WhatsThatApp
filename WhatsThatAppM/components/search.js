import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, FlatList,StyleSheet } from 'react-native';

export default class Contact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataListData: [],
            search: ""
        }
    }

    async searchButton() {
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
            .catch((error) => {
                console.log(error);
            });
    }

    async addContact(userId){
        return fetch("http://localhost:3333/api/1.0.0/user/" + userId  + "/contact", {
            method: "POST",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
         })
         .then((response) => {
            if(response.status === 201){
                return response.json();
            }if(response.status === 400){
                  this.setState({error: "error"})
            }       
        })
        .catch((error)=>{
            console.log(error);
        })

    }

    async blockUser(userId){
        return fetch("http://localhost:3333/api/1.0.0/user/"+ userId+"/block",{
            method:"POST",
            headers:{
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
        })
        .then((response) => {
            if(response.status === 201){
                return response.json();
            }if(response.status === 400){
                  this.setState({error: "error"})
            }       
        })
    }



    render() {
        return (
            <View >
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
                <View >
                    <FlatList 
                        data={this.state.dataListData}
                        renderItem={({ item }) => (
                            <View  style={{ flex: 1, flexDirection: "row"}}>
                                <View>
                                    <Text>
                                        {item.given_name} {item.family_name}{"\n"}
                                        {item.email}           
                                    </Text>
                                </View>
                                
                                <View style = {styles.button}>
                                    <TouchableOpacity onPress={() => this.addContact(item.user_id)}>
                                        <Text style={styles.buttonText}>Add to Contact</Text>                  
                                    </TouchableOpacity>
                                </View>  
                                <View style = {styles.button}>
                                    <TouchableOpacity onPress={() => this.blockUser(item.user_id)}>
                                        <Text style={styles.buttonText}>Block User</Text>                  
                                    </TouchableOpacity>
                                </View> 
                            </View>
                        )}
                    />
                </View>
                
            </View>
        )
    };
}

const styles = StyleSheet.create({
    button: {
        flex: 0.2,
        alignItems: 'flex-end',
        marginBottom:10,
        marginLeft:10,
        backgroundColor: '#2196F3'
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
});