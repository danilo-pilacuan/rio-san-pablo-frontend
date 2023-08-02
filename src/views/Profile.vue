<template>
  <div v-if="userData">
    <title-bar :title-stack="titleStack" />
    <hero-bar>Perfil</hero-bar>
    <section class="section is-main-section">
      <tiles>
        <card-component
          title="Información"
          icon="account"
          class="tile is-child"
        >
          <b-field horizontal label="Nombre">
            <b-input v-model="userData.nombre" name="nombre" disabled />
          </b-field>
          <b-field horizontal label="Correo">
            <b-input v-model="userData.correo" name="etiqueta" disabled />
          </b-field>
          <b-field horizontal label="Tipo de Usuario">
            <b-input :value="userData.tipoUsuario==1?'Administrador':'Trabajador'" name="etiqueta" disabled />
          </b-field>

        </card-component>

        <card-component
          title="Cambiar Contraseña"
          icon="hammer-screwdriver"
          class="tile is-child"
        >
        <b-field horizontal label="Contraseña Anterior">
            <b-input type="password"
                password-reveal
                v-model="inputContraseniaAnterior" name="nombre"/>
          </b-field>
          <b-field horizontal label="Contraseña Nueva"
          :type="{ 'is-danger': errorPass1 }"
          :message="[
              { 'Las contraseñas no coinciden': noMatch },
              { 'La contraseña debe contener al menos 8 caracteres': muycorta1 },
            ]">
            <b-input type="password"
                password-reveal v-model="inputContraseniaNueva" name="nombre" @input="verificarCN"/>
          </b-field>
          <b-field horizontal label="Repetir Contraseña Nueva"
          :type="{ 'is-danger': errorPass2 }"
          :message="[
              { 'Las contraseñas no coinciden': noMatch },
              { 'La contraseña debe contener al menos 8 caracteres': muycorta2 },
            ]">
            <b-input type="password"
                password-reveal v-model="inputContraseniaNueva2" name="etiqueta" @input="verificarCN"/>
          </b-field>
          <b-field horizontal label="">
            <b-button
                rounded
                type="is-primary"
                icon-left="pencil"
                @click="submitCambio"
                :disabled="disableSubmit"
              >
              Enviar
              </b-button>
          </b-field>
          
          

        </card-component>
      </tiles>
      
    </section>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'

import Tiles from '@/components/Tiles.vue'


export default {
  name: 'Profile',
  components: {
    Tiles,
    HeroBar,
    TitleBar,
    CardComponent,
  },
  data() {
    return {
      titleStack : ['Admin', 'Perfil'],
      userData: null,
      inputContraseniaAnterior:"",
      inputContraseniaNueva:"",
      inputContraseniaNueva2:"",
      errorPass1:false,
      errorPass2:false,
      noMatch:false,
      muycorta1:false,
      muycorta2:false,
      disableSubmit:true

    };
  },
  mounted() {
    //this.fetchUsers();
    this.getUserData();
  },
  methods: {
    verificarCN(){
      this.errorPass1=false
      this.errorPass2=false
      this.noMatch=false
      this.muycorta1=false
      this.muycorta2=false
      this.disableSubmit=false
      if(this.inputContraseniaNueva!=this.inputContraseniaNueva2)
      {
        this.noMatch=true
        this.errorPass1=true
        this.errorPass2=true
        this.disableSubmit=true
      }

      if(this.inputContraseniaNueva.length<6)
      {
        this.muycorta1=true
        this.errorPass1=true
        this.disableSubmit=true
      }

      if(this.inputContraseniaNueva2.length<6)
      {
        this.muycorta2=true
        this.errorPass2=true
        this.disableSubmit=true
      }

            
      
    },
    getUserData() {
      try {
        fetch(process.env.VUE_APP_TITLE+"API/usuarios/authLogin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data;
            this.userData=resp["resultado"];
          });
      } catch (e) {
      }
    },
    submitCambio(){
      fetch(process.env.VUE_APP_TITLE+"API/usuarios/cambiarContrasenia/"+ this.userData.id.toString(), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            //agregar campos a crear @todo cambiar11
            contrasenia:this.inputContraseniaAnterior,
            contraseniaNueva:this.inputContraseniaNueva,
            contraseniaNueva2:this.inputContraseniaNueva2
          }),
        })
          .then((response) => response)
          .then((data) => {
            if(data.status==400)
            {
              this.$buefy.dialog.alert("Contraseña Anterior Incorrecta");  
            }
            else
            {
              this.$buefy.dialog.alert("Contraseña Cambiada Correctamente");
            }
            this.inputContraseniaAnterior=""
            this.inputContraseniaNueva="",
            this.inputContraseniaNueva2=""
            this.errorPass1=false
            this.errorPass2=false
            this.noMatch=false
            this.muycorta1=false
            this.muycorta2=false
            this.disableSubmit=true
          });
    }
  }
}
</script>
