<template>
    <div>
      <title-bar :title-stack="titleStack" />
      <b-button class="noPrint ml-5" type="is-link" @click="$router.go(-1)">Volver</b-button>
      <section class="section is-main-section">
        <CalendarioComponent />
      </section>
    </div>
  </template>
  
  <script>
  import Notification from "@/components/Notification.vue";
  import CalendarioComponent from "@/components/CalendarioComponent.vue";
  import TitleBar from "@/components/TitleBar.vue";
  export default {
    name: "Tables",
    components: {
      TitleBar,
      Notification,
      CalendarioComponent,
    },
    data() {
      return {
          titleStack : ['Administración','Horario']
      };
    },
    methods:{
  
    }
  };
  </script>
<style>
@media print{
    .noPrint { display: none !important; }
    .level-right
    {
      display: none;
    }
  }
</style>