import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import * as EmailValidator from 'email-validator';

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            error: "",
            submitted: false
        }

        this._onPressButton = this._onPressButton.bind(this)
    }

    addUser() {
        let to_send = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password
        };
        return fetch("http://localhost:3333/api/1.0.0/user",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(to_send)
            })

            .then((response) => {
                if (response.status === 201) {
                    return response.json();
                } if (response.status === 400) {
                    this.setState({ error: "Email alread used or password not strong enough" })
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

        if (!(this.state.first_name)) {
            this.setState({ error: "Must enter first name" })
            return;
        }

        if (!(this.state.last_name)) {
            this.setState({ error: "Must enter last name" })
            return;
        }

        if (!(this.state.email && this.state.password)) {
            this.setState({ error: "Must enter email and password" })
            return;
        }

        if (!EmailValidator.validate(this.state.email)) {
            this.setState({ error: "Must enter valid email" })
            return;
        }

        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if (!PASSWORD_REGEX.test(this.state.password)) {
            this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" })
            return;
        }



        console.log("Button clicked: " + this.state.submitted)
        console.log("Validated and ready to send to the API")
        this.addUser();
        this.props.navigation.navigate("Login");

    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.formContainer}>
                    <View>
                        <Text>First Name:</Text>
                        <TextInput
                            style={{ height: 40, borderWidth: 1, width: "100%" }}
                            placeholder="Enter your first name"
                            onChangeText={first_name => this.setState({ first_name })}
                            defaultValue={this.state.first_name}
                        />
                        <>
                            {this.state.submitted && !this.state.first_name &&
                                <Text style={styles.error}>*First name is required</Text>
                            }
                        </>
                    </View>

                    <View>
                        <Text>Last Name:</Text>
                        <TextInput
                            style={{ height: 40, borderWidth: 1, width: "100%" }}
                            placeholder="Enter your last name"
                            onChangeText={last_name => this.setState({ last_name })}
                            defaultValue={this.state.last_name}
                        />
                        <>
                            {this.state.submitted && !this.state.last_name &&
                                <Text style={styles.error}>*Last name is required</Text>
                            }
                        </>
                    </View>


                    <View style={styles.email}>
                        <Text>Email:</Text>
                        <TextInput
                            style={{ height: 40, borderWidth: 1, width: "100%" }}
                            placeholder="Enter email"
                            onChangeText={email => this.setState({ email })}
                            defaultValue={this.state.email}
                        />

                        <>
                            {this.state.submitted && !this.state.email &&
                                <Text style={styles.error}>*Email is required</Text>
                            }
                        </>
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

                        <>
                            {this.state.submitted && !this.state.password &&
                                <Text style={styles.error}>*Password is required</Text>
                            }
                        </>
                    </View>

                    <View>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                        {this.state.error &&
                            <Text style={styles.error}>{this.state.error}</Text>
                        }
                    </>

                    <View>
                        <Text onPress={() => this.props.navigation.navigate("Login")} style={styles.signup}>Login Here</Text>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
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