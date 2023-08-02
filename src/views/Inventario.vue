<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudInventario />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudInventario from "@/components/CrudInventario.vue";
import TitleBar from "@/components/TitleBar.vue";
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudInventario,
  },
  data() {
    return {
        titleStack : ['Administración','Inventario']
    };
  },
  methods:{

  }
};
</script>
