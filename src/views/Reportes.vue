<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudReporte />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudReporte from "@/components/CrudReporte.vue";
import TitleBar from "@/components/TitleBar.vue";

export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudReporte,
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
