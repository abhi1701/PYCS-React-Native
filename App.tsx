import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: DocumentPickerResponse }>({});
  const [selectedFilesDetails, setSelectedFilesDetails] = useState('');

  const addFileDetail = (fileType: string, file: DocumentPickerResponse) => {
    setSelectedFilesDetails((currentDetails) => ${currentDetails}${fileType}: ${file.uri}\n);
  };

  const selectFile = async (fileType: string) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
  
      // Ensure res is a single DocumentPickerResponse object
      const selectedFile = Array.isArray(res) ? res[0] : res;
  
      setSelectedFiles((prevFiles) => ({
        ...prevFiles,
        [fileType]: selectedFile,
      }));
      addFileDetail(fileType, selectedFile);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', There was an error selecting the file for ${fileType}.);
      }
    }
  };
  
  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      
      // Append each selected file to the FormData object
      Object.keys(selectedFiles).forEach((fileType) => {
        formData.append(fileType, {
          uri: selectedFiles[fileType].uri,
          type: selectedFiles[fileType].type,
          name: selectedFiles[fileType].name,
        });
      });
  
      // Make the POST request to the API endpoint
      const response = await fetch('https://pycs3-02674d962d33.herokuapp.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.ok) {
        // Get response data
        const responseData = await response.json();
        // Display response data
        Alert.alert('Upload', Files uploaded successfully. Response: ${JSON.stringify(responseData)});
      } else {
        // Handle error response
        const responseData = await response.json();
        Alert.alert('Error', Failed to upload files: ${responseData.message});
      }
    } catch (error) {
      // Handle network or other errors
      Alert.alert('Error', 'An error occurred while uploading files. Please try again later.');
      console.error('Error uploading files:', error);
    }    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('target_file')}>
          <Text>Select Target File</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('boost_file')}>
          <Text>Select Boost File</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('all_years_file')}>
          <Text>Select All Years File</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('final_year_file')}>
          <Text>Select Final Year File</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('target_year_file')}>
          <Text>Select Target Year File</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={uploadFiles}>
          <Text style={styles.uploadButtonText}>Upload Files</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailsText}>{selectedFilesDetails}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#4591ed',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailContainer: {
    maxHeight: 200,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  detailsText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
});

export default App;