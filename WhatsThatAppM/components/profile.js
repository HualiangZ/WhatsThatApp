import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            photo: null,
            isLoading: true
        }
    }

    componentDidMount() {
        this.profileImage();
    }

    async profileImage(){
        fetch("http://localhost:3333/api/1.0.0/user/" + 
            await AsyncStorage.getItem("whatsthat_id") + "/photo", {
                method:"GET",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
                }
        })
            .then((res) => {
                return res.blob();
            })
            .then((resBlob) => {
                let data = URL.createObjectURL(resBlob);
                this.setState({
                    photo: data,
                    isLoading: false
                })
                console.log(photo)
            })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                  });
                console.log(err)
            })


    }

    

    render() {
        if (this.state.photo){
        return (
            
            <View>
                <Image sourse={{ url: this.state.photo }} style={{width: 100, height: 100}} /> 
            </View>
        )} else {
            return(<Text>loading</Text>)
        }

    };
}

const styles = StyleSheet.create({
    profileImg: {
        height: 80,
        width: 80,
        borderRadius: 40,
    },
});