<template>
  <div>
    <SecurityComponent />
    <title-bar :title-stack="titleStack" />
    <section class="section is-main-section">
      <CrudHorario />
    </section>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import CrudHorario from "@/components/CrudHorario.vue";
import TitleBar from "@/components/TitleBar.vue";
import SecurityComponent from "@/components/SecurityComponent.vue"
export default {
  name: "Tables",
  components: {
    TitleBar,
    Notification,
    CrudHorario,
    SecurityComponent
  },
  data() {
    return {
        titleStack : ['Administración','Horario']
    };
  },
  methods:{

  }
};
</script>
