<template>
    <div>
      <title-bar :title-stack="titleStack" />
      <section class="section is-main-section">
        <CrudFletes />
      </section>
    </div>
  </template>
  
  <script>
  import Notification from "@/components/Notification.vue";
  import CrudFletes from "@/components/CrudFletes.vue";
  import TitleBar from "@/components/TitleBar.vue";
  export default {
    name: "Tables",
    components: {
      TitleBar,
      Notification,
      CrudFletes,
    },
    data() {
      return {
          titleStack : ['Administración','Fletes']
      };
    },
    methods:{
  
    }
  };
  </script>
  