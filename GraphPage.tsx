import React from 'react';
import { View, StyleSheet } from 'react-native';
import GraphComponent from './GraphComponent';

interface Props {
  adjustedPredictions: number[];
  allYearsData: { index: number; yield: number }[];
  predictionTimestamps: number[];
}

const GraphPage: React.FC<Props> = ({ adjustedPredictions, allYearsData, predictionTimestamps }) => {
  return (
    <View style={styles.container}>
      <GraphComponent
        adjustedPredictions={adjustedPredictions}
        allYearsData={allYearsData}
        predictionTimestamps={predictionTimestamps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default GraphPage;
