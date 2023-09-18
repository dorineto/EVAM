import {View, Text} from 'react-native';
import React from 'react';

function Dashboard() {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        minWidth: '100%',
      }}>
      <Text style={{fontSize: 32}}>Dashboard</Text>
    </View>
  );
}

export default Dashboard;
