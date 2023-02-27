import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderInfo } from '../screens/Authenticated/Order/OrderInfo';
import { NewOrder } from '../screens/Authenticated/Order/NewOrder'
import { FinishedOrders } from '../screens/Authenticated/Order/FinishedOrders';

const {Navigator, Screen} = createNativeStackNavigator()

export function FinishedRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2541b2",
        },
        headerTintColor: "#fff",
      }}
    >
      <Screen
        name="Pedidos"
        component={FinishedOrders}
      />
      <Screen
        name="Info"
        component={OrderInfo}
      />
    </Navigator>
  );
}