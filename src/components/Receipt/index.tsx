import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ZigzagLines from 'react-native-zigzag-lines';

export function Receipt({children}) {
  const [width, setWidth] = React.useState<any>()

  return (
    <>
      {typeof width == 'number' && <ZigzagLines
        // position='bottom'
        width={width}
        color="#FAFAD2"
        backgroundColor="#E3F2FD"
      />}
      <View 
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      style={{
        backgroundColor: "#FAFAD2",
        width: width,
        height: "93%",
      }}>
        <View style={{flex: 1,}}>
          {children}
        </View>
      </View>
      {typeof width == 'number' && <ZigzagLines
        position='bottom'
        width={width}
        color="#FAFAD2"
        backgroundColor="#E3F2FD"
        style={{
          marginBottom: 50,
        }}
      />}
    </>
  );
}