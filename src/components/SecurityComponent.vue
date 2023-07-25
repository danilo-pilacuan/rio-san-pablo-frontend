<template>
  <div id="users" class="home" style="display: none;">
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  mounted() {
    //this.fetchUsers();
    console.log("SecComp")
    console.log("Route Name")
    console.log(this.$route.name)
    this.authLogin();
  },
  methods: {
    authLogin() {
      try {
          /*
           fetch(process.env.VUE_APP_TITLE+"API/"+this.prefixRuta, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            //agregar campos a crear @todo cambiar11
            nombre: this.inputNombre,
            correo: this.inputCorreo,
            tipoUsuario: this.inputTipoUsuario,
            contrasenia: "",
          }),
        })
          */
        fetch(process.env.VUE_APP_TITLE+"API/usuarios/authLogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data;
            console.log("Authlogin ")
            console.log(resp);
            if (resp.resultado.id) {
              console.log("hello " + resp.resultado.nombre);
              // if(resp.resultado.tipoUsuario==2)
              // {
              //   if(this.$route.name!="home")
              //   {
              //     this.$router.push("/");
              //   }
              // }



            //   if (data.userType) {
            //     this.$store.dispatch("setUserType", data.userType);
            //   }
            //   this.$store.dispatch("setAuth", true);
            } else {
              //this.$router.push("/login");
            }
          });
      } catch (e) {
        //this.$store.dispatch("setAuth", false);
      }
    },
    
  },
};
</script>

<style>
</style>