<template>
  <div>
    
    <title-bar :title-stack="titleStack" />
    <b-button class="ml-5 noPrint" type="is-link" @click="$router.go(-1)">Volver</b-button>
    <section class="section is-main-section">
      <CrudAportes />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudAportes from "@/components/CrudAportes.vue";
import TitleBar from "@/components/TitleBar.vue";

export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudAportes,
    
  },
  data() {
    return {
        titleStack : ['Administración','Aporte']
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