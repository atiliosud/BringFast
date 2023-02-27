import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderInfo } from '../screens/Authenticated/Order/OrderInfo';
import { TablesList } from '../screens/Authenticated/Order/TablesList'
import { NewOrder } from '../screens/Authenticated/Order/NewOrder'

const {Navigator, Screen} = createNativeStackNavigator()

export function OrderRoutes() {
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
        name="Mesas"
        component={TablesList}
      />
      <Screen
        name="Pedido"
        component={NewOrder}
      />
      <Screen
        name="Info"
        component={OrderInfo}
      />
    </Navigator>
  );
}