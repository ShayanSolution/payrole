import * as moment from "moment";
// import HttpService from "./HttpService";
import axios from "axios";

class AuthService {
  static async signIn(username, password) {
    const data = { username, password };
    console.log("data", data);
    // AUTH BY-PASS
    const response = await axios.post(
      `${process.env.REACT_APP_NODE_API_URL}/employees/login`,
      {
        email: username,
        password: password,
      }
    );
    if (response.data.success) {
      return response.data;
    } else {
      return response.data;
    }
    // if (response.data.success) {
    //   return AuthService.setSession(response.data);
    // } else {
    //   return false;
    // }

    /*    return HttpService.http().post('api:v1:guest://auth/authenticate', data)
    .then(response => {
        AuthService.setSession(response.data);
      return response;
    });*/
  }

  static signOut() {
    return AuthService.clearSession();
  }

  static isAuthenticated() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.token) {
        return user;
      }
    } else return false;

    return false;
  }

  static getTokenExpiration() {
    const expiresAt = localStorage.getItem("expires_at");

    if (expiresAt == null) {
      return null;
    }

    return moment(expiresAt);
  }

  static setSession(accessToken) {
    localStorage.setItem("user", JSON.stringify(accessToken));
  }

  static clearSession() {
    localStorage.removeItem("user");
  }
}

export default AuthService;
