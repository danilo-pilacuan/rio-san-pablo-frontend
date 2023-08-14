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
                        <p class="modal-card-title">{{ isEdit?"Editar":"Crear" }} {{ nombreEntidad }}</p>
                        <!-- <button type="button" class="delete" @click="showModalCreateEdit = false"> </button> -->
                        <b-button type="is-danger" @click="showModalCreateEdit = false" icon-left="close" rounded />
                    </header>
                    <section class="modal-card-body">
                        <div class="row">

                            <div class="columns">
                                <div class="column is-12">
                                    <b-field label="Descripción"
                                        :type="{ 'is-danger': !isDescripcionValid }"
                                        :message="{ 'Descripción no válida, solo se permiten letras, números y espacios': !isDescripcionValid }">
                                        <b-input v-model="flete.descripcion"></b-input>
                                    </b-field>
                                    <b-field label="Lugar Inicio"
                                        :type="{ 'is-danger': !isLugarInicioValid }"
                                        :message="{ 'Lugar Inicio no válido, solo se permiten letras, números y espacios': !isLugarInicioValid }">
                                        <b-input v-model="flete.lugarInicio"></b-input>
                                    </b-field>
                                    <b-field label="Lugar Fin"
                                        :type="{ 'is-danger': !isLugarFinValid }"
                                        :message="{ 'Lugar Fin no válido, solo se permiten letras, números y espacios': !isLugarFinValid }">
                                        <b-input v-model="flete.lugarFin"></b-input>
                                    </b-field>
                                    
                                    
                                    
                                </div>
                            </div>

                            
                        </div>
                        <div class="row">
                            <div class="columns">
                                <div class="column is-6">
                                    <b-field label="Flete Activo">
                                      <b-select placeholder="Seleccionar" v-model="flete.activa">                
                                        <option :value="true">Si</option>
                                        <option :value="false">No</option>
                                      </b-select>
                                    </b-field>
                                </div>
                                <div class="column is-6">
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
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="columns">
                                
                                
                                        <div class="column is-6">
                                    <!-- <b-field label="Hora Inicio">
                                      <b-timepicker v-model="inputHoraInicio" inline></b-timepicker>

                                    </b-field> -->
                                    <b-field label="Fecha Inicio"
                                        :type="{ 'is-danger': !isHorasValid }"
                                        :message="{ 'Fecha Inicio no válida, no puede ser mayor a fecha fin': !isHorasValid }">
                                        <b-datetimepicker
                                            v-model="inputFechaInicio"
                                            placeholder="Seleccionar..."
                                            icon="calendar-today"
                                            :icon-right="inputFechaInicio ? 'close-circle' : ''"
                                            inline>
                                        </b-datetimepicker>

                                    </b-field>
                                    
                                </div>
                                <div class="column is-6">
                                    <!-- <b-field label="Hora Fin">
                                      <b-timepicker v-model="inputHoraFin" inline></b-timepicker>
                                    </b-field> -->
                                    
                                    <b-field label="Fecha Fin">
                                        <b-datetimepicker
                                            v-model="inputFechaFin"
                                            :min-datetime="inputFechaInicio"
                                            placeholder="Seleccionar..."
                                            icon="calendar-today"
                                            :icon-right="inputFechaFin ? 'close-circle' : ''"
                                            inline>
                                        </b-datetimepicker>
                                    </b-field>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="columns">
                                <div class="column">
                                    <b-field label="Número de Horas">
                                        <b-numberinput v-model="flete.numHoras" disabled></b-numberinput>
                                    </b-field>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <div class="columns">
                            <div class="column">
                                <b-button type="is-primary" v-if="isAdd" @click="submit" label="Crear" :disabled="!formValidado" />
                                <b-button type="is-primary" v-else @click="submit" label="Editar" :disabled="!formValidado" />
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
      inputFechaFin: function(newVal) {

        // const day = String(newVal.getDate()).padStart(2, '0');
        // const month = String(newVal.getMonth() + 1).padStart(2, '0');
        // const year = String(newVal.getFullYear());

        // this.flete.fechaFin=`${day}-${month}-${year}`;

        console.log(this.inputFechaFin)
        console.log(this.inputFechaInicio)
        if(this.inputFechaFin<this.inputFechaInicio)
        {
            this.$buefy.dialog.alert("La fecha de fin no puede ser menor a la fecha de inicio");
            this.isHorasValid=false;
        }
        else
        {
            this.isHorasValid=true;
        }

        this.flete.fechaFin=newVal;
        const diferenciaEnMilisegundos = this.inputFechaFin.getTime() - this.inputFechaInicio.getTime();
        const diferenciaEnHoras = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60));
        this.flete.numHoras=diferenciaEnHoras;
      },
      inputFechaInicio: function(newVal) {
        // const day = String(newVal.getDate()).padStart(2, '0');
        // const month = String(newVal.getMonth() + 1).padStart(2, '0');
        // const year = String(newVal.getFullYear());

        // this.flete.fechaInicio=`${day}-${month}-${year}`;
        console.log(this.inputFechaFin)
        console.log(this.inputFechaInicio)
        if(this.inputFechaFin<this.inputFechaInicio)
        {
            this.$buefy.dialog.alert("La fecha de fin no puede ser menor a la fecha de inicio");
            this.isHorasValid=false;
        }
        else
        {
            this.isHorasValid=true;
        }

        this.flete.fechaInicio=newVal;
        const diferenciaEnMilisegundos = this.inputFechaFin.getTime() - this.inputFechaInicio.getTime();
        const diferenciaEnHoras = Math.ceil(diferenciaEnMilisegundos / (1000 * 60 * 60));
        this.flete.numHoras=diferenciaEnHoras;

      },
      'flete.descripcion': function (newVal) {
            this.validateDescripcion(newVal);
        },
        'flete.lugarInicio': function (newVal) {
            this.validateLugarInicio(newVal);
        },
        'flete.lugarFin': function (newVal) {
            this.validateLugarFin(newVal);
        },
      
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        formValidado() {
            return this.isDescripcionValid &&
                this.isLugarInicioValid &&
                this.isHorasValid &&
                this.isLugarFinValid;
        }
    },
    data() {
        return {
            isDescripcionValid: false,
            isLugarInicioValid: false,
            isLugarFinValid: false,
            isHorasValid:true,

            inputFechaFin:new Date((new Date()).getTime() + (24 * 60 * 60 * 1000)),
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
                // {
                //     field: "horaInicio",
                //     label: "Hora Inicio",
                // },
                {
                    field: "fechaFin",
                    label: "Fecha Fin",
                },
                // {
                //     field: "horaFin",
                //     label: "Hora Fin",
                // },
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
            this.inputFechaFin=new Date((new Date()).getTime() + (24 * 60 * 60 * 1000)),
            this.inputFechaInicio=new Date(),
            
            this.flete = {
                id: 0,
                descripcion: "",
                lugarInicio: "",
                lugarFin: "",
                fechaInicio: this.inputFechaInicio,
                fechaFin: this.inputFechaFin,
                numHoras: 24,
                activa: true,
                //unidadId: 0,
            }
            if(this.tablaUnidades.length>0)
            {
                this.flete.unidadId=this.tablaUnidades[0].id
            }
            this.isAdd = false;
            this.isEdit = false;
            this.showModalCreateEdit = false;
            this.fetchFletes();
        },
        validateDescripcion(input) {
            const regex =  /^(?!.*\s{3,})[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-][0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
            this.isDescripcionValid = regex.test(input);
        },
        validateLugarInicio(input) {
            const regex =  /^(?!.*\s{3,})[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-][0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
            this.isLugarInicioValid = regex.test(input);
        },
        validateLugarFin(input) { 
            const regex =  /^(?!.*\s{3,})[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-][0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
            this.isLugarFinValid = regex.test(input);
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
                            this.flete.unidadId=this.tablaUnidades[0].id;
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
                        this.resetForm();
                    });
            }
        },
        editFunction(row) {
            //obtener valores para editar en form
            this.flete=row;
            this.flete.unidadId=row.unidad.id;
            this.inputFechaFin=new Date(row.fechaFin);
            this.inputFechaInicio=new Date(row.fechaInicio);
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