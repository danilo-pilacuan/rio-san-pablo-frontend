<template>
  <div>
    <SecurityComponent />
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudUnidades />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudUnidades from "@/components/CrudUnidades.vue";
import TitleBar from "@/components/TitleBar.vue";
import SecurityComponent from "@/components/SecurityComponent.vue"
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudUnidades,
    SecurityComponent
  },
  data() {
    return {
        titleStack : ['Administración','Unidades']
    };
  },
  methods:{

  }
};
</script>
