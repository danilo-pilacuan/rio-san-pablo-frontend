<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudSocios />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudSocios from "@/components/CrudSocios.vue";
import TitleBar from "@/components/TitleBar.vue";
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudSocios,
  },
  data() {
    return {
        titleStack : ['Administración','Socios y Colaboradores']
    };
  },
  methods:{

  }
};
</script>
