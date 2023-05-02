/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
import {
  Camera, CameraType,
} from 'expo-camera';
import { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraSendToServer() {
  const [type, setType] = useState(CameraType.back);
  const [permission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      // eslint-disable-next-line no-unused-vars
      const data = await camera.takePictureAsync(options);
    }
  }

  async function sendToServer(data) {
    console.log('HERE', data.uri);

    const res = await fetch(data.uri);
    const blob = await res.blob();
    return fetch(`http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('whatsthat_id')}/photo`, {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('whatsthat_token'),
        'Content-Type': 'image/png',
      },
      body: blob,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('done');
          navigation.navigate('Profile');
        }
      });
    // network request here
  }

  if (!permission || !permission.granted) {
    return (<Text>No access to camera</Text>);
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 5,
    margin: 5,
    backgroundColor: 'steelblue',
  },
  button: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ddd',
  },
});
