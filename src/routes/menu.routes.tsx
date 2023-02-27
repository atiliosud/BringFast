import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Login } from "../screens/Login";
import { AuthContext } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { OrderRoutes } from "./order.routes";
import { FinishedRoutes } from "./finished.routes";
import { Profile } from "../screens/Authenticated/Profile";

const { Screen, Navigator } = createBottomTabNavigator();

export function MenuRoutes() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        name="Order"
        component={OrderRoutes}
        options={{
          tabBarLabel: "Mesas",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="restaurant" color={color} size={size} />
          ),
        }}
      />
      <Screen
        name="Finished"
        component={FinishedRoutes}
        options={{
          tabBarLabel: "Pedidos finalizados",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt" color={color} size={size} />
          ),
        }}
      />
      <Screen
        name="Perfil"
        component={Profile}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#2541b2",
          },
          headerTintColor: "#fff",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Navigator>
  );
}
