<template>
    <div>
      <title-bar :title-stack="titleStack" />
      <section class="section is-main-section">
        <CrudUsuarios />
      </section>
    </div>
  </template>
  
  <script>
  import Notification from "@/components/Notification.vue";
  import CrudUsuarios from "@/components/CrudUsuarios.vue";
  import TitleBar from "@/components/TitleBar.vue";
  export default {
    name: "Tables",
    components: {
      TitleBar,
      Notification,
      CrudUsuarios,
    },
    data() {
      return {
          titleStack : ['Administración','Usuarios']
      };
    },
    methods:{
  
    }
  };
  </script>
  