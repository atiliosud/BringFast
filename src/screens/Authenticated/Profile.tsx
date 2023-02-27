import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { Avatar } from "react-native-paper";
import functions from "../../firebase/functions";
import { MaterialIcons } from "@expo/vector-icons";

export function Profile() {
  const { employee, handleLogout } = useContext(AuthContext);
  const [company, setCompany] = useState<any>({});
  useEffect(() => {
    (async () => {
      let companyData = await functions.getDocById({
        collectionName: "companies",
        id: employee.company,
      });
      setCompany(companyData);
    })();
  }, []);

  const logout = async () => {
    let succesfully = await handleLogout();

    if (succesfully) {
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#E3F2FD" }}>
      <View
        style={{ width: "100%", alignItems: "center", paddingVertical: 40 }}
      >
        <Avatar.Image size={150} source={{ uri: employee.photo }} />
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Nome: {employee.fullName}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Email: {employee.email}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Telefone/Celular:{employee.phone}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Empresa: {company.company_name}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            height: 40,
            width: 250,
            backgroundColor: "#e84141",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            flexDirection: "row",
          }}
          onPress={logout}
        >
          <MaterialIcons
            name="logout"
            style={{ color: "#fff", fontSize: 20 }}
          />
          <Text style={{ color: "#fff", fontSize: 16, marginLeft: 10 }}>
            Sair da conta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
