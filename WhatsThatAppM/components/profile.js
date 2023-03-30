import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';

export default class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            error: "",
            submitted: false,
            photo: null,
            isLoading: true
        }
        this._onPressButton = this._onPressButton.bind(this)
    }

    componentDidMount() {
        this.profileImage();
    }

    async profileImage() {
        fetch("http://localhost:3333/api/1.0.0/user/" +
            await AsyncStorage.getItem("whatsthat_id") + "/photo", {
            method: "GET",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_token")
            }
        })
            .then((response) => {
                return response.blob();
            })
            .then((responseBlob) => {
                let data = URL.createObjectURL(responseBlob);
                this.setState({
                    photo: data,
                    isLoading: false
                });
            })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                });
                console.log(err)
            })


    }

    async patchUser() {
        let to_send = {};

        if(this.state.first_name != ""){
            to_send["first_name"] = this.state.first_name
        }

        if(this.state.last_name != ""){
            to_send["last_name"] = this.state.last_name
        }

        if(this.state.email != ""){
            to_send["email"] = this.state.email
        }

        if(this.state.password != ""){
            to_send["password"] = this.state.password
        }

        console.log(to_send)
        return fetch("http://localhost:3333/api/1.0.0/user/"+
        await AsyncStorage.getItem("whatsthat_id"),
            {
                method: "PATCH",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_token"),
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(to_send)
            })

            .then((response) => {
                if (response.status === 201) {
                    return response.json();
                } if (response.status === 400) {
                    this.setState({ error: "Something went wrong" })
                }
            })

            .catch((error) => {
                console.error(error);
                return;
            });
    }

    _onPressButton() {
        this.setState({ submitted: true })
        this.setState({ error: "" })

        if (!EmailValidator.validate(this.state.email)) {
            this.setState({ error: "Must enter valid email" })
            return;
        }

        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if (PASSWORD_REGEX.test(this.state.password) != "") {
            this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" })
            return;
        }



        console.log("Button clicked: " + this.state.submitted)
        console.log("Validated and ready to send to the API")
        this.patchUser();

    }

    render() {
        if (this.state.photo) {
            return (
                <View style={styles.container}>

                    <View style={styles.formContainer}>
                        <View>
                            <Image source={{ uri: this.state.photo }} style={{ width: 100, height: 100 }} />
                        </View>
                        <View>
                            <Text>First Name:</Text>
                            <TextInput
                                style={{ height: 40, borderWidth: 1, width: "100%" }}
                                placeholder="Enter your first name"
                                onChangeText={first_name => this.setState({ first_name })}
                                defaultValue={this.state.first_name}
                            />
                        </View>

                        <View>
                            <Text>Last Name:</Text>
                            <TextInput
                                style={{ height: 40, borderWidth: 1, width: "100%" }}
                                placeholder="Enter your last name"
                                onChangeText={last_name => this.setState({ last_name })}
                                defaultValue={this.state.last_name}
                            />

                        </View>


                        <View style={styles.email}>
                            <Text>Email:</Text>
                            <TextInput
                                style={{ height: 40, borderWidth: 1, width: "100%" }}
                                placeholder="Enter email"
                                onChangeText={email => this.setState({ email })}
                                defaultValue={this.state.email}
                            />
                        </View>

                        <View style={styles.password}>
                            <Text>Password:</Text>
                            <TextInput
                                style={{ height: 40, borderWidth: 1, width: "100%" }}
                                placeholder="Enter password"
                                onChangeText={password => this.setState({ password })}
                                defaultValue={this.state.password}
                                secureTextEntry
                            />

                        </View>
                        
                        <View>
                            <TouchableOpacity onPress={this._onPressButton}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Update</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Blocked")}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>View Blocked Users</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <>
                            {this.state.error &&
                                <Text style={styles.error}>{this.state.error}</Text>
                            }
                        </>

                        

                    </View>
                </View>

            )
        } else {
            return (<Text>loading</Text>)
        }

    };
}

const styles = StyleSheet.create({
    profileImg: {
        height: 80,
        width: 80,
        borderRadius: 40,
    },
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"

    },
    formContainer: {
        flex: 1,
        width: "80%",
        justifyContent: "center"
    },
    email: {
        marginBottom: 5
    },
    password: {
        marginBottom: 10
    },
    signup: {
        justifyContent: "center",
        textDecorationLine: "underline"
    },
    button: {
        marginBottom: 30,
        backgroundColor: '#2196F3'
    },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'white'
    },
    error: {
        color: "red",
        fontWeight: '900'
    }
});