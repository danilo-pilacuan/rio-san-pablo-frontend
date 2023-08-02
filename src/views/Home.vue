<template>
  <div>
    <title-bar :title-stack="titleStack" />

    <section class="section is-main-section">
      

      <tiles>
        <card-widget
          class="tile is-child"
          type="is-primary"
          icon="account-multiple"
          :number="numSocios"
          label="Socios"
        />
        <card-widget
          class="tile is-child"
          type="is-link"
          icon="bus"
          :number="numUnidades"
          label="Unidades"
        />
        <card-widget
          class="tile is-child"
          type="is-warning"
          icon="table"
          :number="numRutas"
          label="Rutas"
        />
      </tiles>
      <tiles>
        <card-widget
          class="tile is-child"
          type="is-success"
          icon="clock"
          :number="numHorarios"
          label="Horarios"
        />
        <card-widget
          class="tile is-child"
          type="is-info"
          icon="square-inc-cash"
          :number="numAportes"
          label="Aportaciones"
        />
        <card-widget
          class="tile is-child"
          type="is-danger"
          icon="chart-timeline-variant"
          :number="numReportes"
          label="Reportes"
        />
      </tiles>

      <!-- <card-component
        title="Rendimiento General"
        icon="finance" 
      >
        <div
          v-if="chartData"
          class="chart-area"
        >
          <line-chart
            :chart-data="chartData"
            :chart-options="chartOptions"
            :style="{height: '40%'}"
          />
        </div>
      </card-component> -->

     
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api'
import * as chartConfig from '@/components/Charts/chart.config.js'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import Tiles from '@/components/Tiles.vue'
import CardWidget from '@/components/CardWidget.vue'
import CardComponent from '@/components/CardComponent.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import Notification from '@/components/Notification.vue'
import ChartCostos from "@/components/ChartCostos.vue"


export default {
  name: 'Home',
  components: {
    ChartCostos,
    CardComponent,
    CardWidget,
    Tiles,
    HeroBar,
    TitleBar,
    Notification,
    LineChart
  },
  data() {
    return {
      tablaUnidades:[],
      tablaSocios:[],
      tablaRutas:[],
      tablaHorarios:[],
      tablaAportes:[],
      tablaReportes:[],

      numUnidades:0,
      numSocios:0,
      numRutas:0,
      numHorarios:0,
      numAportes:0,
      numReportes:0,


      titleStack:['Admin', 'Inicio'],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            display: false
          },
          x: {
            display: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };
  },
methods: {
    fillChartData () {
      this.chartData = chartConfig.sampleChartData()
    },
    fetchUnidades() {
      try {
        fetch(process.env.VUE_APP_API+"unidads", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaUnidades = data["data"]; this.numUnidades=this.tablaUnidades.length} else { this.tablaUnidades = []; } });
      } catch (e) { }
    },
    fetchSocios() {
      try {
        fetch(process.env.VUE_APP_API+"socios", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaSocios = data["data"]; this.numSocios=this.tablaSocios.length } else { this.tablaSocios = []; } });
      } catch (e) { }
    },
    fetchRutas() {
      try {
        fetch(process.env.VUE_APP_API+"rutas", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaRutas = data["data"]; this.numRutas=this.tablaRutas.length} else { this.tablaRutas = []; } });
      } catch (e) { }
    },
    fetchHorarios() {
      try {
        fetch(process.env.VUE_APP_API+"unidads", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaHorarios = data["data"]; this.numHorarios=this.tablaHorarios.length} else { this.tablaHorarios = []; } });
      } catch (e) { }
    },
    fetchAportaciones() {
      try {
        fetch(process.env.VUE_APP_API+"aportes", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaAportes = data["data"]; this.numAportes=this.tablaAportes.length} else { this.tablaAportes = []; } });
      } catch (e) { }
    },
    fetchReportes() {
      try {
        fetch(process.env.VUE_APP_API+"reportes", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaReportes = data["data"]; this.numReportes=this.tablaReportes.length} else { this.tablaReportes = []; } });
      } catch (e) { }
    }
    
},
mounted() {
  this.fillChartData()
  this.fetchUnidades()
this.fetchSocios()
this.fetchRutas()
this.fetchHorarios()
this.fetchAportaciones()
this.fetchReportes()
  },
  
}
</script>
