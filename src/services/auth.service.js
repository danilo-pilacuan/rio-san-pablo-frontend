import axios from 'axios';

//const API_URL = 'http://localhost:8080/api/auth/';
const API_URL = process.env.VUE_APP_API;

class AuthService {
  login(user) {
    console.log("--------*********************-------------------66---------")
      console.log("--------------------------------------------------6666-------")
      console.log("-------------------------------------------------4--------")
      console.log("------------------------------------------------3---------")
      console.log("-------------------------------------------------4--8------")
      console.log("---------------------------------------------------8------")
      console.log("------------------------------66---------------------------")
      console.log("-------------------------------------------------79448--------")
      console.log("----------------------------ttt-----------------------------")
      
      console.log(API_URL + 'users/login')
    return axios
      .post(API_URL + 'users/login', {
        correo: user.username,
        clave: user.password,
        "nombres": "nombres",
        "apellidos": "apellidos",
        "activo": true,
        "tipo": 1
      })
      .then(response => {
        console.log("-------------------------------------------------9-9-------")
      console.log("--------------------------------------------------8-------")
      console.log("-------------------------------------------------8--------")
      console.log(response.data["usuario"])
      console.log("------------------------------------------------5---------")
      console.log("----------------------------------------------55-----------")
    //   localStorage.setItem('usuario', JSON.stringify({
    //     status: { loggedIn: true }, user:response.data["usuario"]
    //   }));  
    
    
    // if (response.data.accessToken) {
            
        //     console.log(response.data["usuario"])
        //   localStorage.setItem('usuario', JSON.stringify(response.data["usuario"]));
        // }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();