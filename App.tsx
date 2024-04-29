import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import GraphComponent from './GraphComponent';
import GraphPage from './GraphPage'; // Import the GraphPage component

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: DocumentPickerResponse }>({});
  const [selectedFilesDetails, setSelectedFilesDetails] = useState('');
  const [responseData, setResponseData] = useState<any>(null); // State to hold API response data

  const addFileDetail = (fileType: string, file: DocumentPickerResponse) => {
    setSelectedFilesDetails((currentDetails) => `${currentDetails}${fileType}: ${file.uri}\n`);
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
        Alert.alert('Error', `There was an error selecting the file for ${fileType}.`);
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
      const response = await fetch('https://pycs-3ad83c12399a.herokuapp.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        // Get response data
        const responseData = await response.json();
        // Set the response data to state
        setResponseData(responseData);
        // Display response data
        Alert.alert('Upload', `Files uploaded successfully. Response: ${JSON.stringify(responseData)}`);
      } else {
        // Handle error response
        const responseData = await response.json();
        Alert.alert('Error', `Failed to upload files: ${responseData.message}`);
      }
    } catch (error) {
      // Handle network or other errors
      Alert.alert('Error', 'An error occurred while uploading files. Please try again later.');
      console.error('Error uploading files:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Buttons to select files */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('target_file')}>
          <Text style={styles.buttonText}>Select Target File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('boost_file')}>
          <Text style={styles.buttonText}>Select Boost File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('all_years_file')}>
          <Text style={styles.buttonText}>Select All Years File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('final_year_file')}>
          <Text style={styles.buttonText}>Select Final Year File</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => selectFile('target_year_file')}>
          <Text style={styles.buttonText}>Select Target Year File</Text>
        </TouchableOpacity>
      </View>
      {/* Button to upload files */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={uploadFiles}>
          <Text style={styles.uploadButtonText}>Upload Files</Text>
        </TouchableOpacity>
      </View>
      {/* Display selected file details */}
      <View style={styles.detailContainer}>
        <Text style={styles.detailsText}>{selectedFilesDetails}</Text>
      </View>
      {/* Render the GraphPage component if responseData is available */}
      {responseData && (
        <GraphPage
          adjustedPredictions={responseData.adjusted_predictions}
          predictionTimestamps={responseData.prediction_timestamps}
          allYearsData={responseData.all_years_data}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    width: '48%',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailContainer: {
    maxHeight: 100,
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
