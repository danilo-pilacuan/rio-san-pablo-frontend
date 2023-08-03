<template>
    <div id="users" class="home">
        <hero-bar>
            

            
            <div v-if="objCalendario" style="font-size: 22px;">
                Horario: {{ objCalendario.descripcion }}
            </div>
            <vue-excel-xlsx
                :data="data"
                :columns="columns"
                :file-name="nombreArchivo"
                :file-type="'xlsx'"
                :sheet-name="nombreArchivo"
                class="button is-link"
                slot="right"
                >
                Exportar
            </vue-excel-xlsx>
            <!-- <b-button  class="m-2 noPrint" type="is-link" @click="exportFunction">Imprimir</b-button> -->
            <b-button slot="right" type="is-primary ml-3" @click="createFunction">Crear</b-button>
        </hero-bar>
        <div class="container-fluid ml-1 mr-1" style="max-width: 100%">
            <div class="block" v-if="tablaRutasCalendario">
                <div class="container-fluid  table-container">
                    <div class="columns" style="margin-bottom: 0px;">
                            <div class="column is-2 ml-3" style="padding-bottom: 0px;">
                                
                            </div>
                            <div class="column is-10" v-if="diasCalendario"  style="display: flex; padding-bottom: 0px;">
                                <!-- <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/> -->
                                <input style="margin-bottom: 0px;" type="text" disabled  v-for="diaCa in diasCalendario" :key="diaCa.valor" :value="diaCa.label" size="2"/>
                                
                            </div>
                        </div>
                    <div class="columns" style="margin-bottom: 0px;">
                            <div class="column is-2 ml-3">
                                <b>Frecuencia</b>
                            </div>
                            <div class="column is-10" v-if="diasCalendario"  style="display: flex;">
                                <!-- <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/> -->
                                <input style="margin-bottom: 0px;" type="text" disabled  v-for="diaCa in diasCalendario" :key="diaCa.valor" :value="diaCa.valor" size="2"/>
                                
                            </div>
                        </div>
                    <div class="row" v-for="ruta in tablaRutasCalendario">
                        <div class="columns">
                            <div class="column is-2 ml-3">
                                {{ ruta.nombre }}
                            </div>
                            <div class="column is-10" style="display: flex;">
                                <!-- <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/>
                                <CellComponent :rutaCalendario="null" key="rutaCa.id"/> -->
                            
                                <CellComponent v-for="rutaCa in ruta.rutasCalendario" :rutaCalendario="rutaCa" :key="rutaCa.id"/>
                                <b-button class="ml-3 mr-3" slot="right" size="is-small" type="is-danger" @click="deleteFunction(ruta.id)">Borrar</b-button>
                            </div>
                        </div>
                    </div>
                </div>

      <b-modal v-model="showModalCreateEdit">
      <form @submit.prevent="submit">
        <!-- <b-checkbox v-model="hasError">Show errors</b-checkbox> -->
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Agregar {{ nombreEntidad }}</p>
            <button
              type="button"
              class="delete"
              @click="showModalCreateEdit = false"
            />
          </header>
          <section class="modal-card-body">
            <div class="row">
           
                        
                        <div class="columns">
                          <b-field label="Ruta">
                            <b-select placeholder="Seleccionar Ruta" v-model="calendarioRuta.rutaId">
                              <option
                                  v-for="option in tablaRutas"
                                  :value="option.id"
                                  :key="option.id">
                                  {{ option.nombre}}
                              </option>
                            </b-select>
                          </b-field>
                        </div>

            </div>
          </section>
          <footer class="modal-card-foot">
            <div class="columns">
              <div class="column">
                <b-button
                  type="is-primary"
                  v-if="isAdd"
                  @click="submit"
                  label="Crear"
                />
                <b-button
                  type="is-primary"
                  v-else
                  @click="submit"
                  label="Editar"
                />
              </div>
              <div class="column">
                <b-button type="is-danger" @click="showModalCreateEdit=false" label="Cancelar" />
              </div>
            </div>
          </footer>
        </div>
      </form>
    </b-modal>

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
            nombreArchivo:'horario',
            cedula: '0400423158',
            resultado: '',

            columns:[],    
            data:[],
            diasCalendario:[                
            ],

            tipoUsuario: 1,
            idSeleccionado: 0,
            
            calendarioRuta:{
                dia: 0,
                valor: 0,
                calendarioId: this.$route.params.id,
                rutaId: 0,
            },
  
            aporte: null,
  
            //info entidad
            nombreEntidad: "Ruta",
            baseUri: process.env.VUE_APP_API + "calendarioRutas",
            //tablas Datos
            //tablaDatos: [],
            //tablaTarjetas: [],
            tablaRutas: [],
            tablaRutasCalendario: [],
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
        this.resetForm();
        
    },
    methods: {
      resetForm(){
        
        this.fetchRutas();
        this.fetchRutasCalendario();
        this.isAdd=false;
        this.isEdit=false;
        this.showModalCreateEdit=false;
      },
      fetchHorario() {
          axios
        .get(process.env.VUE_APP_API+"calendarios/"+this.$route.params.id)
        .then(response => {
            this.objCalendario  = response.data["data"]
            let numDias=30;

            this.nombreArchivo='horario -'+this.objCalendario.mes+'-'+this.objCalendario.anio;

            switch(this.objCalendario.mes)
            {
                case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                    numDias=31;
                    break;
                case 2:
                    if(this.objCalendario.anio%4==0)
                    {
                        numDias=29;
                    }
                    else
                    {
                        numDias=28;
                    }
                    break;
            }

            for(let i=1;i<=numDias;i++)
            {
                console.log("///////////////////////////")
                this.diasCalendario.push({valor:i});
            }

            const dateCalendario = new Date(this.objCalendario.anio,this.objCalendario.mes-1,1);
            let diaInicial=dateCalendario.getDay();
            

            for(let i=0;i<numDias;i++)
            {
                switch(diaInicial)
                {
                    case 0:
                    this.diasCalendario[i].label="D";
                    break;
                    case 1:
                    this.diasCalendario[i].label="L";
                    break;
                    case 2:
                    this.diasCalendario[i].label="M";
                    break;
                    case 3:
                    this.diasCalendario[i].label="X";
                    break;
                    case 4:
                    this.diasCalendario[i].label="J";
                    break;
                    case 5:
                    this.diasCalendario[i].label="V";
                    break;
                    case 6:
                    this.diasCalendario[i].label="S";
                    break;
                }
                diaInicial=diaInicial+1;
                if(diaInicial>6)
                {
                    diaInicial=0;
                }
            }

            

        })
        .catch(error => console.log("Error"))
      },
      fetchRutasCalendario() {
          axios
        .get(process.env.VUE_APP_API+"rutas/getByCalendarioId/"+this.$route.params.id)
        .then(response => {
            let listaRutas=[];


            let arrayColumns=[];
            arrayColumns.push({
                label: "Frecuencia",
                field: "descripcion",
            })

            for(let i=0;i<this.diasCalendario.length;i++)
            {
                arrayColumns.push({
                    label: this.diasCalendario[i].label,
                    field: this.diasCalendario[i].valor.toString(),
                })
                //objDataAux[i.toString()]=this.diasCalendario[i].label;
            }

            //listaRutas.push(objDataAux);

            this.columns=arrayColumns;

            // let objDataAux={
            //     descripcion:""
            // }
            // for(let i=0;i<this.diasCalendario.length;i++)
            // {
            //     objDataAux[i.toString()]=this.diasCalendario[i].label;
            // }

            // listaRutas.push(objDataAux);

            let objDataFrec={
                descripcion:""
            }
            for(let i=0;i<this.diasCalendario.length;i++)
            {
                objDataFrec[(i+1).toString()]=this.diasCalendario[i].valor;
            }

            listaRutas.push(objDataFrec);


            this.tablaRutasCalendario  = response.data["data"]
            this.tablaRutasCalendario.forEach(element => {
                let objData={
                    descripcion:element.nombre
                }

                for(let i=0;i<element.rutasCalendario.length;i++)
                {
                    objData[(i+1).toString()]=element.rutasCalendario[i].valor;
                }
                listaRutas.push(objData);
            });
            this.data=listaRutas;
        })
        .catch(error => console.log("Error"))
      },
      fetchRutas() {
          axios
        .get(process.env.VUE_APP_API+"rutas")
        .then(response => (this.tablaRutas  = response.data["data"]))
        .catch(error => console.log("Error"))
      },

      createFunction()
      {
         this.showModalCreateEdit=true;
         this.isAdd=true;
      },
      submit()
      {
        if(this.isAdd)
        {
            axios.post(process.env.VUE_APP_API+'calendarioRutas/createCalendarioRutaBatch',this.calendarioRuta)
            .then(response => 
            {
                this.$buefy.dialog.alert("Ruta agregada a horario correctamente");
                this.resetForm();
            })
            .catch(error => console.log("Error"))
        }
      },
      deleteFunction(rutaId)
      {
        this.calendarioRuta.rutaId=rutaId;

        axios.delete(process.env.VUE_APP_API+'calendarioRutas/deleteBatch',{data:this.calendarioRuta})
            .then(response => 
            {
                this.$buefy.dialog.alert("Ruta eliminada del horario correctamente");
                this.resetForm();
            })
            .catch(error => console.log("Error"))
      },
      verificarCedula() {
            if (this.cedula.length !== 10 || isNaN(this.cedula)) {
                this.resultado = 'La cédula ingresada no es válida';
                return;
            }

            const cedulaArray = this.cedula.split('').map(Number);
            const impares = [];
            const pares = [];

            for (let i = 0; i < cedulaArray.length; i++) {
                if (i % 2 === 0) {
                    impares.push(cedulaArray[i] * 2 > 9 ? cedulaArray[i] * 2 - 9 : cedulaArray[i] * 2);
                } else {
                    pares.push(cedulaArray[i]);
                }
            }

            const sumaImpares = impares.reduce((acc, val) => acc + val, 0);
            const sumaPares = pares.reduce((acc, val) => acc + val, 0);
            const sumaTotal = sumaImpares + sumaPares;

            const digitoVerificador = sumaTotal % 10 === 0 ? 0 : 10 - (sumaTotal % 10);

            this.resultado = `Dígito verificador calculado: ${digitoVerificador}`;
        }

      
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