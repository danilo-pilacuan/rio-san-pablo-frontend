<template>
    <div id="users" class="home">
        <hero-bar>
            Horario
            
        </hero-bar>
        <div class="container-fluid ml-1 mr-1" style="max-width: 100%">
            <div class="block" v-if="tablaRutas">
                <div class="container-fluid  table-container">
                    <div class="columns">
                            <div class="column is-3">
                                Ruta
                            </div>
                            <div class="column is-9" v-if="diasCalendario"  style="display: flex;">
                                <!-- <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/> -->
                                <input type="text" disabled  v-for="diaCa in diasCalendario" :key="diaCa.valor" :value="diaCa.valor" size="3"/>
                                
                            </div>
                        </div>
                    <div class="row" v-for="ruta in tablaRutas">
                        <div class="columns">
                            <div class="column is-3">
                                {{ ruta.nombre }}
                            </div>
                            <div class="column is-9" style="display: flex;">
                                <!-- <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/> -->
                            
                                <CellComponent v-for="rutaCa in ruta.rutasCalendario" :rutaCalendario="rutaCa" :key="rutaCa.id"/>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <b-table :data="tablaRutas">
                
                    <template v-for="column in columns[1]">
                        <b-table-column :key="column.id" v-bind="column">
                            <template v-slot="props">
                                <div v-if="typeof props.row[column.field] === 'object'">
                                    <span v-for="subfieldIter in column.subField">
                                      {{ props.row[column.field][subfieldIter] }}
                                    </span>
                                </div>
                                <div v-else>
                                    {{ props.row[column.field] }}
                                </div>
                            </template>
                        </b-table-column>
                    </template>

                </b-table> -->
                <!-- <b-table :data="tablaDatos" :bordered="true" :striped="true" :narrowed="false" :hoverable="false"
                    :loading="false" :focusable="true" :mobile-cards="false" :searchable="true" :paginated="true"
                    :per-page="20">
                    <template v-for="column in columns">
                        <b-table-column :key="column.id" v-bind="column">
                            <template v-slot="props">
                                <div v-if="typeof props.row[column.field] === 'object'">
                                    <span v-for="subfieldIter in column.subField">
                                      {{ props.row[column.field][subfieldIter] }}
                                    </span>
                                </div>
                                <div v-else>
                                    {{ props.row[column.field] }}
                                </div>
                            </template>
                        </b-table-column>
                    </template>
                    <b-table-column field="actions" label="Acciones" v-slot="props" cell-class="noPrint" header-class="noPrint">
                        <div class="buttons">
                            <slot name="addButtons"></slot>
                            <b-button rounded type="is-danger" icon-left="delete" label="Borrar" @click="deleteFunction(props.row)"
                                :disabled="tipoUsuario == 2"/>
                        </div>
                    </b-table-column>
                </b-table> -->




            </div>
        </div>
  
    </div>
  </template>
  
  <script>
  import HeroBar from '@/components/HeroBar.vue'
  import axios from "axios";

  import CellComponent from './CellComponent.vue';

  export default {
    components: {
        HeroBar,
        CellComponent
    },
    data() {
        return {
            diasCalendario:[
                {valor:1},
                {valor:2},
                {valor:3},
                {valor:4},
                {valor:5},
                {valor:6},
                {valor:7},
                {valor:8},
                {valor:9},
                {valor:10},
                {valor:11},
                {valor:12},
                {valor:13},
                {valor:14},
                {valor:15},
                {valor:16},
                {valor:17},
                {valor:18},
                {valor:19},
                {valor:20},
                {valor:21},
                {valor:22},
                {valor:23},
                {valor:24},
                {valor:25},
                {valor:26},
                {valor:27},
                {valor:28},
                {valor:29},
                {valor:30},
                {valor:31},
                
            ],

            data: [
                    { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': {'SubG':'Male'} },
                    { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
                    { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
                    { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
                    { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' }
                ],
                columns: [
                    {
                        field: 'nombre',
                        label: 'Nombre',
                    },
                    {
                        field: 'rutasCalendario',
                        label: 'Dia',
                    },
                    // {
                    //     field: 'first_name',
                    //     label: 'First Name',
                    // },
                    // {
                    //     field: 'last_name',
                    //     label: 'Last Name',
                    // },
                    // {
                    //     field: 'date',
                    //     label: 'Date',
                    //     centered: true
                    // },
                    // {
                    //     field: 'gender.SubG',
                    //     label: 'Gender',
                    // }
                ],

            tipoUsuario: 1,
            idSeleccionado: 0,
  
            aporte: null,
  
            //info entidad
            nombreEntidad: "Aporte",
            baseUri: process.env.VUE_APP_API + "calendarios",
            //tablas Datos
            //tablaDatos: [],
            //tablaTarjetas: [],
            tablaRutas: [],
            objCalendario:null,
            //columnas tabla Datos

            //tablas auxiliares
  
            //auxiliares modal
            isAdd: false,
            isEdit: false,
  
            showModalCreateEdit: false,
            showModalDelete: false,
  
            //control errores validacion
  
  
        };
    },
    mounted() {
        console.log("id::::: "+this.$route.params.id)
        this.fetchHorario();
        this.fetchRutas();
        
    },
    methods: {
  
      fetchHorario() {
          axios
        .get(process.env.VUE_APP_API+"calendarios/"+this.$route.params.id)
        .then(response => (this.objCalendario  = response.data["data"]))
        .catch(error => console.log("Error"))
      },
      fetchRutas() {
          axios
        .get(process.env.VUE_APP_API+"rutas/getByCalendarioId/"+this.$route.params.id)
        .then(response => (this.tablaRutas  = response.data["data"]))
        .catch(error => console.log("Error"))
      },

  
      
    },
  };
  </script>
  
  <style>
  @media print{
    .noPrint { display: none !important; }
    .level-right
    {
      display: none;
    }
  }
  </style>