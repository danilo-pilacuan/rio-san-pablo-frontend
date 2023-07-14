<template>
  <div>
    <SecurityComponent />
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudRuta />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudRuta from "@/components/CrudRuta.vue";
import TitleBar from "@/components/TitleBar.vue";
import SecurityComponent from "@/components/SecurityComponent.vue"
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudRuta,
    SecurityComponent
  },
  data() {
    return {
        titleStack : ['Administración','Ruta']
    };
  },
  methods:{

  }
};
</script>
