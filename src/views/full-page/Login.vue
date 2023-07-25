<template>
  <card-component
    title="Login"
    icon="lock"
  >
    <router-link
      slot="button"
      to="/"
      class="button is-small"
    >
      Dashboard
    </router-link>

    <form
      method="POST"
      @submit.prevent="submit"
    >
      <b-field label="Correo Electrónico"
      :type="{ 'is-danger': loginHasErrors }"
                  :message="[
                    { 'Credenciales no válidas': loginHasErrors },
                  ]"
                  >
        <b-input
          v-model="inputCorreo"
          name="email"
          type="email"
          required
          autofocus
        />
      </b-field>


      <b-field label="Contraseña"
      :type="{ 'is-danger': loginHasErrors }"
                  :message="[
                    { 'Credenciales no válidas': loginHasErrors },
                  ]">
        <b-input
          v-model="inputContrasenia"
          type="password"
          name="password"
          required
        />
      </b-field>

      <b-field>
        <b-checkbox
          v-model="remember"
          type="is-black"
          class="is-thin"
        >
          Recordarme
        </b-checkbox>
      </b-field>

      <hr>

      <b-field grouped>
        <div class="control">
          <b-button
            native-type="submit"
            type="is-black"
            :loading="isLoading"
          >
            Ingresar
          </b-button>
        </div>
        <!-- <div class="control">
          <router-link
            to="/"
            class="button is-outlined is-black"
          >
            Dashboard
          </router-link>
        </div> -->
      </b-field>
    </form>
  </card-component>
</template>

<script>
import { reactive, ref } from '@vue/composition-api'
import { useRouter } from '@/router'
import CardComponent from '@/components/CardComponent.vue'
import User from '../../models/user';

export default {
  name: 'Login',
  components: { CardComponent },
  computed: {
    // loggedIn() {
    //   return this.$store.state.auth.status.loggedIn;
    // }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  data(){
    return {
      isLoading: false,
      inputCorreo: '',
      inputContrasenia: '',
      remember: false,
      loginHasErrors: false,
      user:{
        username:"kenyn.pilaguano@gmail.com",
        password:"121221",
        email:"kenyn.pilaguano@gmail.com"
      }
    }
  },
  methods:{
    submit2() {
      console.log("pppppppppppppppppppppppppppppppppppppppppppp")
      this.loading = true;

        if (this.user.username && this.user.password) {
          console.log("333333333333333333333333333333333333333333")

          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/');
            },
            error => {
              this.loading = false;
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
        }
      
    },
    submit(){
      this.isLoading = true
      fetch(process.env.VUE_APP_API+"users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            
            correo: this.inputCorreo,
            clave: this.inputContrasenia,
            nombres: "",
            apellidos: "",
            activo: true,
            tipo: 1,

          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            var resp = data.usuario;
            if(resp!=null)
            {
              this.$store.dispatch("setUser", resp);
              this.$store.dispatch("setAuth", true);
              this.$router.push('/')
              
            }
            else
            {
              this.isLoading=false
              this.loginHasErrors=true
            }
        
            
          });

    }
  },
  
}
</script>
