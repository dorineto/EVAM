import {View, Text} from 'react-native';
import React from 'react';

function Estoque() {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        minWidth: '100%',
      }}>
      <Text style={{fontSize: 32}}>Estoque</Text>
    </View>
  );
}

export default Estoque;
