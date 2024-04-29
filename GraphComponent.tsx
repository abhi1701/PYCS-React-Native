import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface Props {
  adjustedPredictions: number[];
  allYearsData: { index: number; yield: number }[];
  predictionTimestamps: number[];
}

const GraphComponent: React.FC<Props> = ({ adjustedPredictions, allYearsData, predictionTimestamps }) => {
  // The starting index for the adjusted predictions
  const startIndexOfPredictions = allYearsData.length - adjustedPredictions.length;

  // Create labels for the x-axis with a label for every fourth index
  const labels = allYearsData.map((_, idx) => ((idx % 4 === 0) ? (idx + 1).toString() : ''));

  // Extract just the yield values from all years data
  const allYearsYields = allYearsData.map(data => data.yield);

  // Padding the start of the predictions array with null values so they start at the correct index on the graph
  const predictionsWithPadding = new Array(startIndexOfPredictions).fill(null).concat(adjustedPredictions);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: allYearsYields,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Color for all years data, e.g., blue
      },
      {
        data: predictionsWithPadding,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Color for adjusted predictions, e.g., red
      }
    ],
  };

  // Use the full width of the device and a fixed height for the chart
  return (
    <View style={{ flex: 1 }}>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width}
        height={350}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // Interval for Y-axis labels
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
