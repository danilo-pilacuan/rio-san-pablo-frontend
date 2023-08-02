<template>
  <div>
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
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudRuta,
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
