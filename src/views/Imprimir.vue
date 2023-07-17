<template>
    <div>
      <SecurityComponent />
      <title-bar :title-stack="titleStack" />
      <section class="section is-main-section">
        <ComponentImprimir />
      </section>
    </div>
  </template>
  
  <script>
  import Notification from "@/components/Notification.vue";
  import ComponentImprimir from "@/components/ComponentImprimir.vue";
  import TitleBar from "@/components/TitleBar.vue";
  import SecurityComponent from "@/components/SecurityComponent.vue"
  export default {
    name: "Tables",
    components: {
      TitleBar,
      Notification,
      ComponentImprimir,
      SecurityComponent
    },
    data() {
      return {
          titleStack : ['Administración','Reporte']
      };
    },
    methods:{
  
    }
  };
  </script>
  