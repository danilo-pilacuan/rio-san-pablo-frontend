<template>
  <div>
    <SecurityComponent />
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudTarjeta />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudTarjeta from "@/components/CrudTarjeta.vue";
import TitleBar from "@/components/TitleBar.vue";
import SecurityComponent from "@/components/SecurityComponent.vue"
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudTarjeta,
    SecurityComponent
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
