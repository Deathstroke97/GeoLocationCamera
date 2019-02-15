import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, PermissionsAndroid, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Make a Photo' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  maxWidth: 8000, 
  maxHeight: 8000,
};




class GeolocationExample extends Component {
  state = {
    latitude: '',
    longitude: '',
    images: []

  }

  componentDidMount() {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
      PermissionsAndroid.PERMISSIONS.CAMERA, 
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]).then((result) => {
      console.log('result', result);
    })
  }
  

  requestGeolocation = (callback) => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('first position: ', position)
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }, ( ) => {
          callback()
        })
      },
      (error) => {
          console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }
      

  handlePress = () => {
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('res: ', response)
        const source = { uri: response.uri };
        let image = {
          source: {uri: response.uri}
        }
        const coords = this.requestGeolocation(() => {
          image.latitude = this.state.latitude
          image.longitude = this.state.longitude
          let newState = {...this.state}
          newState.images.splice(0, 0, image)
          this.setState({
            images: newState.images,
          })
        })
      }
    });
  } 

  render() {
    let images;
    if (this.state.images.length !== 0) {
      images = this.state.images.map(img => (
        <ScrollView>
          <Image source={img.source} style={{width: 250, height: 250}} />
          <Text>{img.latitude}</Text>
          <Text>{img.longitude}</Text>
        </ScrollView>
      ))
    }

    return (
      <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 50}}>
        <ScrollView>
        {images}
        </ScrollView>
        <TouchableOpacity onPress={this.handlePress} style={{alignItems: 'center', backgroundColor: '#DDDDDD', padding: 10}}>
            <Text>Upload a photo</Text>
        </TouchableOpacity>
      </View>
      )
  }
}

export default GeolocationExample;