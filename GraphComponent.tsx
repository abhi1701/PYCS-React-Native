import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface Props {
  adjustedPredictions: number[];
  allYearsData: { index: number; yield: number }[];
  predictionTimestamps: number[];
}

const GraphComponent: React.FC<Props> = ({ adjustedPredictions, allYearsData, predictionTimestamps }) => {
  // Extract yields and generate labels for all year data
  const allYearsYields = new Array(allYearsData.length).fill(null);
  const labels = new Array(allYearsData.length).fill('');

  allYearsData.forEach((data, idx) => {
    allYearsYields[idx] = data.yield;
    // Display labels every fourth index starting from the first index
    if (idx % 4 === 0) {
      labels[idx] = data.index.toString();
    }
  });

  // Initialize prediction array with null to fill the graph up to the first prediction point
  const predictionYields = new Array(allYearsData.length).fill(null);
  // Map predictions to their respective timestamps in the graph data
  adjustedPredictions.forEach((prediction, idx) => {
    const timestampIndex = predictionTimestamps[idx] - 1;  // Convert 1-based index to 0-based
    predictionYields[timestampIndex] = prediction;
    // Set label for prediction points every fourth index
    if (timestampIndex % 4 === 0) {
      labels[timestampIndex] = predictionTimestamps[idx].toString();
    }
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: allYearsYields,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // blue for historical data
      },
      {
        data: predictionYields,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // red for predictions
      }
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width}
        height={220}
        yAxisLabel="Yield"
        yAxisSuffix="k"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default GraphComponent;
