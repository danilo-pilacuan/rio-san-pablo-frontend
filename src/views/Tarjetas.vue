<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <b-button class="noPrint ml-5" type="is-link" @click="$router.go(-1)">Volver</b-button>
    <section class="section is-main-section">
      <CrudTarjeta />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudTarjeta from "@/components/CrudTarjeta.vue";
import TitleBar from "@/components/TitleBar.vue";
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudTarjeta,
  },
  data() {
    return {
        titleStack : ['Administración','Tarjeta']
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