<template>
  <div>
    <SecurityComponent />
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudReportes />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudReportes from "@/components/CrudReportes.vue";
import TitleBar from "@/components/TitleBar.vue";
import SecurityComponent from "@/components/SecurityComponent.vue"
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudReportes,
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
