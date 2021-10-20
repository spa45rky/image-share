import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async() =>{
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false){
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true){
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    } 
  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  };

  if (selectedImage !== null){
    return(
      <View style={styles.container}>
        <Image
          source={{uri: selectedImage.localUri}}
          style={styles.thumbnail}
        />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://i.imgur.com/TkIrScD.png"}} style={styles.logo}/>
      <Text style={styles.text}>Press the button below to share a photo from your gallery to your friends!</Text>
      <TouchableOpacity onPress= {openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo!</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'green',
    fontSize: 22,
    textAlign: 'center',
    marginHorizontal: 15,
    margin: 20,
  },
  buttonText:{
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    margin: 3,
  },
  logo: {
    width: 305, 
    height: 159,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 20,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  }
});
