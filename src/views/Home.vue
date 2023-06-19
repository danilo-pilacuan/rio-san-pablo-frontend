<template>
  <div>
    <!-- <SecurityComponent/> -->
    <title-bar :title-stack="titleStack" />

    <section class="section is-main-section">
      

      <tiles>
        <card-widget
          class="tile is-child"
          type="is-primary"
          icon="account-multiple"
          :number="numUsuarios"
          label="Socios"
        />
        <card-widget
          class="tile is-child"
          type="is-link"
          icon="bus"
          :number="numActivos"
          label="Unidades"
        />
        <card-widget
          class="tile is-child"
          type="is-warning"
          icon="table"
          :number="numOrdenes"
          label="Rutas"
        />
      </tiles>
      <tiles>
        <card-widget
          class="tile is-child"
          type="is-success"
          icon="clock"
          :number="numUsuarios"
          label="Horarios"
        />
        <card-widget
          class="tile is-child"
          type="is-info"
          icon="square-inc-cash"
          :number="numActivos"
          label="Aportaciones"
        />
        <card-widget
          class="tile is-child"
          type="is-danger"
          icon="chart-timeline-variant"
          :number="numOrdenes"
          label="Reportes"
        />
      </tiles>

      <card-component
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
      </card-component>

     
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
import SecurityComponent from "@/components/SecurityComponent.vue"
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
    SecurityComponent,
    LineChart
  },
  data() {
    return {
      tablaUsuarios:null,
      tablaActivos:null,
      tablaOrdenes:null,
      chartData: null,

      numUsuarios:0,
      numActivos:0,
      numOrdenes:0,


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
    }
    
},
mounted() {
  this.fillChartData()

  },
  
}
</script>
