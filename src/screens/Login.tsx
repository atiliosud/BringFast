import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import functions from "../firebase/functions";
import { comparePassword } from "../utils/bcrypt";

export function Login() {
  const [code, setCode] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { authenticateUser } = useContext(AuthContext);

  const handleLogin = async () => {
    //pegar a compania
    let companyArray = await functions.getDocsByCollection({
      collectionName: "companies",
      query: {
        field: "company_code",
        operator: "==",
        value: code,
      },
    });
    let company = companyArray[0];
    if (!company) {
      setError("Não foi possivel encontrar uma empresa com esse CNPJ.");
      console.log("Não foi possivel encontrar uma empresa com esse CNPJ");
      return;
    }

    //pegar funcionario pelo id da compania
    let employees = await functions.getDocsByCollection({
      collectionName: "employees",
      query: {
        field: "company",
        operator: "==",
        value: company._id,
      },
    });
    //pegar funcionario pelo login
    let employee = employees.filter((employee) => employee.login === login)[0];
    if (!employee) {
      setError("Não foi possivel encontrar uma conta com esse login ou senha!");
      console.log(
        "Nenhum funcionario encontrado com o login " +
          login +
          " na empresa " +
          company._id
      );
      return;
    }
    //verificar se a senha esta incorreta
    if (!(await comparePassword(password, employee.password))) {
      setError("Não foi possivel encontrar uma conta com esse login ou senha!");
      console.log("Senha incorreta!");
      return;
    } else {
      //caso esteja correta logar o usuario;
      delete employee.password;
      console.log("Usuario logado - ", employee);
      setError("");
      authenticateUser({ employee });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.head}>
          <Text
            style={{
              fontSize: 24,
              color: "#fff",
            }}
          >
            Entrar
          </Text>
        </View>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            onChangeText={setCode}
            value={code}
            placeholder="CNPJ"
          />
          <TextInput
            style={styles.input}
            onChangeText={setLogin}
            value={login}
            placeholder="Login"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Senha"
            secureTextEntry
          />
          <View style={{ paddingHorizontal: 10 }}>
            {!!error && <Text style={{ color: "red" }}>{error}</Text>}
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E3F2FD",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  main: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 300,
    height: 240,
  },
  head: {
    flex: 0.4,
    paddingLeft: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    width: 300,
    backgroundColor: "#2541b2",
  },
  inputSection: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 200,
    height: 40,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2541b2",
    width: 200,
    height: 50,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 24,
    color: "#fff",
  },
});
