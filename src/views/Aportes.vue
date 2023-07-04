<template>
  <div>
    <SecurityComponent />
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudAportes />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudAportes from "@/components/CrudAportes.vue";
import TitleBar from "@/components/TitleBar.vue";
import SecurityComponent from "@/components/SecurityComponent.vue"
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudAportes,
    SecurityComponent
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
