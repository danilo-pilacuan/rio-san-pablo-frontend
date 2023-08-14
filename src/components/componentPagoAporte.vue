<template>
    <div id="users" class="home">
        <hero-bar>
            Aportes
            <b-button slot="right" class="m-2 noPrint" type="is-link" @click="globalPrint">Imprimir</b-button>
            <b-button slot="right" type="is-primary" @click="createAporte">Crear</b-button>
        </hero-bar>
        <div class="container ml-1 mr-1" style="max-width: 100%">
            <div class="block">
  
                <b-table :data="tablaDatos" :bordered="true" :striped="true" :narrowed="false" :hoverable="false"
                    :loading="false" :focusable="false" :mobile-cards="false" :searchable="true" :paginated="true"
                    :per-page="20">
                    <template v-for="column in columns">
                        <b-table-column :key="column.id" v-bind="column">
                            <!-- <template v-if="column.searchable && !column.numeric" #searchable="props">
                                <b-input v-model="props.filters[props.column.field]" placeholder="Buscar..." icon="magnify"
                                    size="is-small" />
                            </template> -->
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
                            <!-- <b-button rounded type="is-warning" icon-left="pencil" @click="editFunction(props.row)"
                                :disabled="tipoUsuario == 2"/> -->
                            <!-- <b-button rounded type="is-link" icon-left="eye" label="Aportes" @click="editFunction(props.row)"
                                :disabled="tipoUsuario == 2"/> -->
                            <b-button rounded type="is-danger" icon-left="delete" label="Borrar" @click="deleteFunction(props.row)"
                                :disabled="tipoUsuario == 2"/>
                        </div>
                    </b-table-column>
                </b-table>
            </div>
        </div>
  
        <b-modal v-model="showModalAporte">
            <form @submitAporte.prevent="submitAporte" v-if="aporte">
                <!-- <b-checkbox v-model="hasError">Show errors</b-checkbox> -->
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Crear {{ nombreEntidad }}</p>
                        <!-- <button type="button" class="delete" @click="showModalAporte = false"> </button> -->
                        <b-button type="is-danger" @click="showModalAporte = false" icon-left="close" rounded />
                    </header>
                    <section class="modal-card-body">
                        <div class="row">
                            <div class="columns">
                                <div class="column is-6">
                                  <b-field label="N° Disco">
                                      <b-numberinput v-model="aporte.numDisco" step="1" min-step="1" min="1"/>
                                  </b-field>
                                </div>
                                <div class="column is-6">
                                        <b-field label="Cantidad">
                                          <b-numberinput v-model="aporte.cantidad" step="0.1" min-step="0.01" min="0"/>
                                        </b-field>
                                    </div>
                             </div>   
                                    
                                    
                                    <div class="columns">
                                        <div class="column is-6">
                                            <b-field label="Tarjeta Actual">
                                              <b-numberinput v-model="aporte.tarjetaActual" step="0.1" min-step="0.01" min="0"/>
                                            </b-field>
                                        </div>
                                        <div class="column is-6">
                                            <b-field label="Adicional">
                                              <b-numberinput v-model="aporte.adicional" step="0.1" min-step="0.01" min="0"/>
                                            </b-field>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column is-6">
                                            <b-field label="Otros">
                                              <b-numberinput v-model="aporte.otros" step="0.1" min-step="0.01" min="0"/>
                                            </b-field>
                                        </div>
                                        <div class="column is-6">
                                            <b-field label="mcAct">
                                              <b-numberinput v-model="aporte.mcAct" step="0.1" min-step="0.01" min="0"/>
                                            </b-field>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column is-6">
                                            <b-field label="mcAnt">
                                              <b-numberinput v-model="aporte.mcAnt" step="0.1" min-step="0.01" min="0"/>
                                            </b-field>
                                        </div>
                                        <div class="column is-6">
                                            <b-field label="Multas">
                                              <b-numberinput v-model="aporte.multas" step="0.1" min-step="0.01" min="0"/>
                                            </b-field>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column is-6">
                                            <b-field label="Total">
                                              <b-numberinput v-model="aporte.total" step="0.1" min-step="0.01" min="0"/>
                                            </b-field>
                                        </div>
                                        <div class="column is-6">
                                          <b-field label="Socio">
                                              <b-select placeholder="Seleccionar Socio" v-model="aporte.socioId">
                                              <option
                                                  v-for="option in tablaSocios"
                                                  :value="option.id"
                                                  :key="option.id">
                                                  {{ option.nombres}} {{ option.apellidos}}
                                              </option>
                                              </b-select>
                                            </b-field>
                                            
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column is-12">
                                            
                                              <b-field label="Tarjeta">
                                              <b-select placeholder="Seleccionar Tarjeta" v-model="aporte.tarjetaId">
                                              <option
                                                  v-for="option in tablaTarjetas"
                                                  :value="option.id"
                                                  :key="option.id">
                                                  ID: {{ option.id}} Fecha:{{ option.fecha}} Unidad: {{ option.unidad.placa }} Chofer: {{ option.chofer.nombres }} {{ option.chofer.apellidos }}
                                              </option>
                                              </b-select>
                                            
                                            </b-field>
                                        </div>
                                    </div>
                                
                            
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <div class="columns">
                            <div class="column">
                                <b-button type="is-primary" v-if="isAddAporte" @click="submitAporte" label="Crear" />
                                <b-button type="is-primary" v-else @click="submitAporte" label="Editar" />
                            </div>
                            <div class="column">
                                <b-button type="is-danger" @click="showModalAporte = false" label="Cancelar" />
                            </div>
                        </div>
                    </footer>
                </div>
            </form>
        </b-modal>
    </div>
  </template>
  
  <script>
  import HeroBar from '@/components/HeroBar.vue'
  import axios from "axios";
  export default {
    components: {
        HeroBar
    },
    data() {
        return {
            tipoUsuario: 1,
            idSeleccionado: 0,
  
            aporte: null,
  
            //info entidad
            nombreEntidad: "Aporte",
            
            //tablas Datos
            tablaDatos: [],
            tablaTarjetas: [],
            tablaSocios: [],
            //columnas tabla Datos
            columns: [
                {
                    field: "numDisco",
                    label: "numDisco",
                },
                {
                    field: "cantidad",
                    label: "Cantidad",
                },
                {
                    field: "tarjetaActual",
                    label: "Tarjeta Actual",
                },
                {
                    field: "adicional",
                    label: "Adicional",
                },
                {
                    field: "otros",
                    label: "otros",
                },
                {
                    field: "mcAct",
                    label: "mcAct",
                },
                {
                    field: "mcAnt",
                    label: "mcAnt",
                },
                {
                    field: "multas",
                    label: "Multas",
                },
                {
                    field: "total",
                    label: "Total",
                },
                // {
                //     field: "socio",
                //     subField:["nombres"],
                //     label: "Nombres Socio",
                // },
                {
                    field: "socio",
                    subField:["apellidos","nombres"],
                    label: "Socio",
                },
            ],
            //tablas auxiliares
  
            //auxiliares modal
            isAddAporte: false,
            isEditAporte: false,
  
            showModalAporte: false,
            showModalDelete: false,
  
            //control errores validacion
  
  
        };
    },

    methods: {
        resetPagoAporte() {
            this.aporte = {
                id: 0,
                numDisco:0,
                cantidad:0,
                tarjetaActual:0,
                adicional:0,
                otros:0,
                mcAct:0,
                mcAnt:0,
                multas:0,
                total:0,
                reporteId:this.$route.params.id,
                socioId:0,
                reciboId:0,
                tarjetaId:0,
            }
            this.isAddAporte = false;
            this.isEditAporte = false;
            this.showModalAporte = false;
            this.fetchAportes();
        },

       
   
        createAporte() {
            this.showModalAporte = true;
            this.isAddAporte = true;
        },
        submitAporte() {
            if (this.isAddAporte) {
                fetch(process.env.VUE_APP_API + "aportes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(this.aporte),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        var resp = data.message;
                        console.log(resp);
  
                        //cerrar modal
  
                        this.$buefy.dialog.alert("Aporte agregado correctamente");
  
                        this.resetPagoAporte();
  
                    });
            } else if (this.isEditAporte) {
                fetch(
                    process.env.VUE_APP_API + "aportes" + "/" + this.aporte.id,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(this.aporte),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        var resp = data.message;
                        console.log(resp)
                        //limpiar campos
  
                        //this.fetchUsers();
  
                        this.$buefy.dialog.alert("Aporte editado correctamente");
                        //llamar fetch
                        this.showModalAporte = false;
  
                    });
            }
        },
        editFunction(row) {
            //obtener valores para editar en form
  
            //mostrar modal
            this.showModalAporte = true;
            this.isAddAporte = false;
            this.isEditAporte = true;
        },
        deleteFunction(row) {
            const idDel = row.id;
            fetch(process.env.VUE_APP_API + "Aportes/" + idDel.toString(), {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => {
                    var resp = data.message;
                    //limpiar campos form
  
                    this.$buefy.dialog.alert("Aporte eliminado correctamente");
                    //llamar fetch
                    this.resetPagoAporte();
                });
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