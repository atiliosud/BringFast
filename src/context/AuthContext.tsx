import React, { useEffect } from "react";

export const AuthContext = React.createContext<any | null>(null);
import AsyncStorage from "@react-native-async-storage/async-storage";
interface Props {
  children: React.ReactNode;
  authenticateUser: () => boolean;
  handleLogout: () => boolean;
  isAuthenticated: boolean;
  employee: {} | EmployeeType;
}

type EmployeeType = {
  _id: string;
  company: string;
  email: string;
  fullName: string;
  login: string;
  phone: string;
  photo: string;
};

type AuthenticateUserType = {
  employee: EmployeeType;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [employee, setEmployee] = React.useState<EmployeeType | {}>({});

  //autentica o usuario no app
  async function authenticateUser({ employee }: AuthenticateUserType) {
    try {
      //salva o employee logado em um state e no async storage
      setEmployee(employee);
      await AsyncStorage.setItem("employee", JSON.stringify(employee));

      //salva se o employee esta autenticado ou nao em state e no async storage
      setIsAuthenticated(true);
      await AsyncStorage.setItem(
        "isAuthenticated",
        JSON.stringify(isAuthenticated)
      );

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //verificar no async storage se existe employee e isAuthenticated e loga o employee
  async function autoLogin() {
    try {
      let employeeString = await AsyncStorage.getItem("employee");
      let isAuthenticatedString = await AsyncStorage.getItem("isAuthenticated");

      //retorna falso se nao possuir as keys
      if (!employeeString || !isAuthenticatedString) {
        console.log("Usuario nao autenticado.");
        return false;
      } else {
        let employee = JSON.parse(employeeString);
        if (await authenticateUser({ employee })) {
          console.log("auto login success");
          return true;
        } else {
          console.log("auto login failed");
          return false;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //desloga o usuario apagando os dados do async storage e limpando os states
  async function handleLogout() {
    try {
      //limpa tudo do async storage
      await AsyncStorage.clear();

      //apagando os states
      setIsAuthenticated(false);
      setEmployee({});
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    (async () => {
      //Realizar auto login
      autoLogin();
    })();
  }, []);
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, authenticateUser, employee, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
