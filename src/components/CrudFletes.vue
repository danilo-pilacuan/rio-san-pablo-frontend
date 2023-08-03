<template>
    <div id="users" class="home">
        <hero-bar>
            Fletes
            <b-button slot="right" class="m-2 noPrint" type="is-link" @click="globalPrint">Imprimir</b-button>
            <b-button slot="right" type="is-primary" @click="createFunction">Crear</b-button>
        </hero-bar>
        <div class="container ml-1 mr-1" style="max-width: 100%">
            <div class="block">
  
                <b-table :data="tablaDatos" :bordered="true" :striped="true" :narrowed="false" :hoverable="false"
                    :loading="false" :focusable="false" :mobile-cards="false" :searchable="true" :paginated="true"
                    :per-page="20">
                    <template v-for="column in columns">
                        <b-table-column :key="column.id" v-bind="column">
                            <template v-if="column.searchable && !column.numeric" #searchable="props">
                                <b-input v-model="props.filters[props.column.field]" placeholder="Buscar..." icon="magnify"
                                    size="is-small" />
                            </template>
                            <template v-slot="props">
                                <div v-if="typeof props.row[column.field] === 'object'">
                                    {{ props.row[column.field][column.subField] }}
                                </div>
                                <div v-else>
                                  {{ column.field=="activa"?(props.row[column.field]==true?"Si":"No"):"" }}
                                  {{ column.field!="activa"?props.row[column.field]:"" }}
                                  
                                </div>
                            </template>
                        </b-table-column>
                    </template>
                    <b-table-column field="actions" label="Acciones" v-slot="props" cell-class="noPrint" header-class="noPrint">
                        <div class="buttons">
                            <slot name="addButtons"></slot>
                            <b-button rounded type="is-warning" icon-left="pencil" @click="editFunction(props.row)"
                                :disabled="tipoUsuario == 2">
                            </b-button>
                            <b-button rounded type="is-danger" icon-left="delete" @click="deleteFunction(props.row)"
                                :disabled="tipoUsuario == 2">
                            </b-button>
                        </div>
                    </b-table-column>
                </b-table>
            </div>
        </div>
  
        <b-modal v-model="showModalCreateEdit">
            <form @submit.prevent="submit" v-if="flete">
                <!-- <b-checkbox v-model="hasError">Show errors</b-checkbox> -->
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">
                        <p class="modal-card-title">{{isAdd?'Crear':'Editar'}} {{ nombreEntidad }}</p>
                        <!-- <button type="button" class="delete" @click="showModalCreateEdit = false"> </button> -->
                        <b-button type="is-danger" @click="showModalCreateEdit = false" icon-left="close" rounded />
                    </header>
                    <section class="modal-card-body">
                        <div class="row">
                            <div class="columns">
                                <div class="column">
                                    <b-field label="Descripción">
                                        <b-input v-model="flete.descripcion"></b-input>
                                    </b-field>
                                    <b-field label="Lugar Inicio">
                                        <b-input v-model="flete.lugarInicio"></b-input>
                                    </b-field>
                                    <b-field label="Lugar Fin">
                                        <b-input v-model="flete.lugarFin"></b-input>
                                    </b-field>
                                    <b-field label="Número de Horas">
                                        <b-numberinput v-model="flete.numHoras"></b-numberinput>
                                    </b-field>
                                    <b-field label="Unidad">
                            
                                        <b-select placeholder="Seleccionar Unidad" v-model="flete.unidadId">
                                        <option
                                            v-for="option in tablaUnidades"
                                            :value="option.id"
                                            :key="option.id">
                                            {{ option.placa }}
                                        </option>
                                        </b-select>
                                    </b-field>
                                    <b-field label="Hora Inicio">
                                      <b-timepicker v-model="inputHoraInicio" inline></b-timepicker>

                                    </b-field>
                                    <b-field label="Fecha Inicio">
                                        <b-datepicker
                                            v-model="inputFechaInicio"
                                            placeholder="Seleccionar..."
                                            icon="calendar-today"
                                            :icon-right="inputFechaInicio ? 'close-circle' : ''"
                                            inline>
                                        </b-datepicker>

                                    </b-field>
                                    <b-field label="Hora Fin">
                                      <b-timepicker v-model="inputHoraFin" inline></b-timepicker>
                                    </b-field>
                                    
                                    <b-field label="Fecha Fin">
                                        <b-datepicker
                                            v-model="inputFechaFin"
                                            placeholder="Seleccionar..."
                                            icon="calendar-today"
                                            :icon-right="inputFechaFin ? 'close-circle' : ''"
                                            inline>
                                        </b-datepicker>
                                    </b-field>
                                    <b-field label="Flete Activo">
                                      <b-select placeholder="Seleccionar" v-model="flete.activa">                
                                        <option value="true">Si</option>
                                        <option value="false">No</option>
                                      </b-select>
                                    </b-field>
                                  
                                  
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <div class="columns">
                            <div class="column">
                                <b-button type="is-primary" v-if="isAdd" @click="submit" label="Crear" />
                                <b-button type="is-primary" v-else @click="submit" label="Editar" />
                            </div>
                            <div class="column">
                                <b-button type="is-danger" @click="showModalCreateEdit = false" label="Cancelar" />
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
  
  export default {
    components: {
        HeroBar
    },
    watch: {
      inputHoraFin: function(newVal) {

        const horas = String(newVal.getHours()).padStart(2, '0');
        const minutos = String(newVal.getMinutes()).padStart(2, '0');
        this.flete.horaFin=`${horas}:${minutos}`;

      },
      inputHoraInicio: function(newVal) {
        const horas = String(newVal.getHours()).padStart(2, '0');
        const minutos = String(newVal.getMinutes()).padStart(2, '0');
        this.flete.horaInicio=`${horas}:${minutos}`;
      },
      inputFechaFin: function(newVal) {

        const day = String(newVal.getDate()).padStart(2, '0');
        const month = String(newVal.getMonth() + 1).padStart(2, '0');
        const year = String(newVal.getFullYear());

        this.flete.fechaFin=`${day}-${month}-${year}`;

      },
      inputFechaInicio: function(newVal) {
        const day = String(newVal.getDate()).padStart(2, '0');
        const month = String(newVal.getMonth() + 1).padStart(2, '0');
        const year = String(newVal.getFullYear());

        this.flete.fechaInicio=`${day}-${month}-${year}`;
      },
      
    },
    data() {
        return {
            inputHoraFin:new Date(),
            inputHoraInicio:new Date(),
            inputFechaFin:new Date(),
            inputFechaInicio:new Date(),
            tipoUsuario: 1,
            idSeleccionado: 0,
  
            flete: null,
  
  
            //info entidad
            nombreEntidad: "Flete",
            baseUri: process.env.VUE_APP_API + "fletes",
            //tablas Datos
            tablaDatos: [],
            tablaUnidades: [],
            //columnas tabla Datos
            columns: [
                {
                    field: "descripcion",
                    label: "Descripción",
                },
                {
                    field: "lugarInicio",
                    label: "Lugar Inicio",
                },
                {
                    field: "lugarFin",
                    label: "Lugar Fin",
                },
                {
                    field: "fechaInicio",
                    label: "Fecha Inicio",
                },
                {
                    field: "horaInicio",
                    label: "Hora Inicio",
                },
                {
                    field: "fechaFin",
                    label: "Fecha Fin",
                },
                {
                    field: "horaFin",
                    label: "Hora Fin",
                },
                {
                    field: "numHoras",
                    label: "Número de Horas",
                },
                
                {
                    field: "activa",
                    label: "Activo",
                }
            ],
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
        //llamados fetch
        //this.authLogin();
        this.fetchUndades();
        this.resetForm();
    },
    methods: {
        resetForm() {

            const horaInicio = new Date();
            horaInicio.setHours(22); 
            horaInicio.setMinutes(0);

            const horaFin = new Date();
            horaFin.setHours(5); 
            horaFin.setMinutes(0); 
            this.inputHoraInicio=horaInicio;
            this.inputHoraFin=horaFin;
            this.flete = {
                id: 0,
                descripcion: "",
                lugarInicio: "",
                lugarFin: "",
                horaInicio: "22:00",
                horaFin: "05:00",
                fechaInicio: null,
                fechaFin: null,
                numHoras: 0,
                activa: true,
                unidadId: 0,
            }
            this.isAdd = false;
            this.isEdit = false;
            this.showModalCreateEdit = false;
            this.fetchFletes();
        },
        fetchFletes() {
            try {
                fetch(this.baseUri, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data) {
                            this.tablaDatos = data["data"];
                        } else {
                            //this.$router.push("/login")
                            this.tablaDatos = [];
                        }
                    });
            } catch (e) {
                //this.$store.dispatch("setAuth", false);
            }
        },
        fetchUndades() {
            try {
                fetch(process.env.VUE_APP_API+'unidads', {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data) {
                            this.tablaUnidades = data["data"];
                        } else {
                            //this.$router.push("/login")
                            this.tablaUnidades = [];
                        }
                    });
            } catch (e) {
                //this.$store.dispatch("setAuth", false);
            }
        },
  
  
        createFunction() {
            this.showModalCreateEdit = true;
            this.isAdd = true;
        },
        submit() {
            if (this.isAdd) {
                fetch(this.baseUri, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(this.flete),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        var resp = data.message;
                        console.log(resp);
  
                        //cerrar modal
  
                        this.$buefy.dialog.alert("Flete agregado correctamente");
  
                        this.resetForm();
  
                    });
            } else if (this.isEdit) {
                fetch(
                    this.baseUri + "/" + this.flete.id,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(this.flete),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        var resp = data.message;
                        console.log(resp)
                        //limpiar campos
  
                        //this.fetchUsers();
  
                        this.$buefy.dialog.alert("Flete editado correctamente");
                        //llamar fetch
                        this.showModalCreateEdit = false;
  
                    });
            }
        },
        editFunction(row) {
            //obtener valores para editar en form
            this.flete=row;
            this.flete.unidadId=row.unidad.id;
            //mostrar modal
            this.showModalCreateEdit = true;
            this.isAdd = false;
            this.isEdit = true;
        },
        deleteFunction(row) {
            const idDel = row.id;
            fetch(process.env.VUE_APP_API + "Fletes/" + idDel.toString(), {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => {
                    var resp = data.message;
                    //limpiar campos form
  
                    this.$buefy.dialog.alert("Flete eliminado correctamente");
                    //llamar fetch
                    this.resetForm();
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