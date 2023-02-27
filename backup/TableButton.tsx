import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';

export default function Card({order, onPress}) {
    
    const statusHandling: Function = (status: number) => {
        let statusColor: string
    
        switch(status) {
        case 100:
          statusColor = "#00ff7f"
          break;
        case 102:
          statusColor = "#ffd700"
          break;
        case 999:
          statusColor = "#dc143c"
          break;
        }
    
        return <View style={{
          width: "50%",
          height: "50%",
          borderRadius: 50,
          backgroundColor: statusColor,
        }}/>
      }

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardSection}>
        {statusHandling(order.status)}
      </View>
      <View style={styles.cardSectionLarge}><Text>Mesa: {order.table}</Text></View>
      <View style={styles.cardSection}><Text>{order.table}</Text></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        width: "100%",
        height: 80,
        marginBottom: 20,
        borderRadius: 5,
      },
      cardSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      cardSectionLarge: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
      }
})