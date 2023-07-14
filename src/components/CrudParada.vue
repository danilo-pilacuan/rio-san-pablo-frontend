<template>
    <div id="users" class="home">
      <hero-bar>
        Tarjetas
        <b-button slot="right" type="is-primary" @click="createFunction">Crear</b-button>
      </hero-bar>
      <div class="container ml-1 mr-1" style="max-width: 100%">
          
        <div class="block">
          <div class="columns">
            <div class="column">
              
            </div>
          </div>
          <b-table
            :data="tablaDatos"
            :bordered="true"
            :striped="true"
            :narrowed="false"
            :hoverable="false"
            :loading="false"
            :focusable="true"
            :mobile-cards="false"
            :searchable="true"
            :paginated="true"
            :per-page="20"
          >
            <template v-for="column in columns">
              <b-table-column :key="column.id" v-bind="column">
                <template
                  v-if="column.searchable && !column.numeric"
                  #searchable="props"
                >
                  <b-input
                    v-model="props.filters[props.column.field]"
                    placeholder="Buscar..."
                    icon="magnify"
                    size="is-small"
                  />
                </template>
                <template v-slot="props">
                  <div v-if="typeof props.row[column.field] === 'object'">
                                    <span v-for="subfieldIter in column.subFields">
                                      {{ props.row[column.field][subfieldIter] }}
                                    </span>
                                </div>
                  <div v-else>
                    {{ column.field=="fecha"?(new Date(props.row[column.field])).toLocaleDateString('es-ES'):props.row[column.field] }}
                  </div>
                </template>
              </b-table-column>
            </template>
            <b-table-column field="actions" label="Acciones" v-slot="props">
              <div class="buttons">
                <slot name="addButtons"></slot>
                <b-button
                  rounded
                  type="is-warning"
                  icon-left="pencil"
                  @click="editFunction(props.row)"
                  :disabled="tipoUsuario==2"
                >
                </b-button>
                <b-button
                  rounded
                  type="is-danger"
                  icon-left="delete"
                  @click="deleteFunction(props.row)"
                  :disabled="tipoUsuario==2"
                >
                </b-button>
              </div>
            </b-table-column>
          </b-table>
        </div>
      </div>
  
      <b-modal v-model="showModalCreateEdit">
        <form @submit.prevent="submit">
          <!-- <b-checkbox v-model="hasError">Show errors</b-checkbox> -->
          <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
              <p class="modal-card-title">Crear {{ nombreEntidad }}</p>
              <button
                type="button"
                class="delete"
                @click="showModalCreateEdit = false"
              />
            </header>
            <section class="modal-card-body">
              <div class="row">
                <div class="columns">
                  <div class="column is-6">
                    <b-field label="Fecha">
                        <b-datepicker v-model="tarjeta.fecha" inline>
                        </b-datepicker>
                    </b-field>
                  </div>
                  <div class="column is-6">
                      <div class="row">
                        <div class="columns">
                          <div class="column">
                            <b-field label="Unidad">
                              <b-input v-model="reporte.presidente"></b-input>
                            </b-field>
                          </div>
                          <div class="column">
                            <b-field label="Ruta">
                              <b-input v-model="reporte.presidente"></b-input>
                            </b-field>
                          </div>
                          <div class="column">
                            <b-field label="Chofer">
                              <b-input v-model="reporte.presidente"></b-input>
                            </b-field>
                          </div>
                          <div class="column">
                            <b-field label="Controlador">
                              <b-input v-model="reporte.presidente"></b-input>
                            </b-field>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <!-- <div class="columns">
                <div class="column">
                  <b-field
                    label="Cédula"
                  >
                  
                    <b-input v-model="inputCedula"></b-input>
                  </b-field>
                </div>
              </div>
  
              <div class="columns">
                <div class="column">
                  <b-field label="Nombres">
                    <b-input v-model="inputNombres"></b-input>
                  </b-field>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <b-field label="Apellidos">
                    <b-input v-model="inputApellidos"></b-input>
                  </b-field>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <b-field label="Dirección">
                    <b-input v-model="inputDireccion"></b-input>
                  </b-field>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <b-field label="Teléfono">
                    <b-input v-model="inputTelefono"></b-input>
                  </b-field>
                </div>
              </div>
  
              <div class="columns">
                <div class="column">
                  <b-field label="Tipo Tarjeta">
                    <b-select placeholder="Tipo Tarjeta" v-model="inputTipoTarjeta">
                      
                      <option value="1">Chofer</option>
                      <option value="2">Controlador</option>
                      <option value="3">Dirigente</option>
  
                    </b-select>
                  </b-field>
                </div>
              </div>
  
              <div class="columns">
                <div class="column">
                  <b-field label="Activo">
                    <b-select placeholder="Activo" v-model="inputActivo">
                      
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
  
                    </b-select>
                  </b-field>
                </div>
              </div> -->
  
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
  </template>
  
  <script>
  import HeroBar from '@/components/HeroBar.vue'
  
  export default {
      components: {
      HeroBar
    },
    data() {
      return {
        tipoUsuario:1,
        idSeleccionado:0,
  
        tarjeta:{
          id:0,
          fecha:new Date(),
          observaciones:"",
          unidadId:0,
          rutaId:0,
          socioId:0,
          controladorId:0
        },
        //info entidad
        nombreEntidad: "Tarjeta",
        uri: process.env.VUE_APP_API+"tarjetas",
        //tablas Datos
        tablaDatos: [],
        tablaSocios:[],
        tablaUnidades:[],
        tablaRutas:[],
        //columnas tabla Datos
        columns: [
          
          { field: "fecha", label: "Fecha", searchable: true, },
          { field: "observaciones", label: "Observaciones", searchable: true, },
          { field: "unidad", subFields: ["placa"], label: "Unidad", searchable: true, },
          { field: "ruta", subFields:["nombre"],label: "Ruta", searchable: true, },
          { field: "chofer",subFields:["nombres","apellidos"], label: "Socio", searchable: true, },
          { field: "controlador",subFields:["nombres","apellidos"], label: "Controlador", searchable: true, },
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
      this.resetForm();
      this.fetchRutas();
      this.fetchSocios();
      this.fetchTarjetas();
    },
    methods: {
      resetForm() {
          this.tarjeta = {
            id:0,
            fecha:new Date(),
            observaciones:"",
            unidadId:0,
            rutaId:0,
            socioId:0,
            controladorId:0
          }
          this.isAdd = false;
          this.isEdit = false;
          this.showModalCreateEdit = false;
          this.fetchTarjetas();
      },
      fetchTarjetas() {
        try {
          fetch(this.uri, {
            method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include",
          })
            .then((response) => response.json()) .then((data) => {
              if (data) {
                this.tablaDatos = data["data"];
              } else {
                this.tablaDatos = [];
              }
            });
        } catch (e) {
          
        }
      },
  
      fetchSocios() {
        try {
          fetch(process.env.VUE_APP_API+"socios", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
            .then((response) => response.json()) .then((data) => { if (data) { this.tablaSocios = data["data"]; } else { this.tablaDatos = []; } });
        } catch (e) { }
      },
      fetchUnidades() {
        try {
          fetch(process.env.VUE_APP_API+"unidads", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
            .then((response) => response.json()) .then((data) => { if (data) { this.tablaUnidades = data["data"]; } else { this.tablaDatos = []; } });
        } catch (e) { }
      },
      fetchRutas() {
        try {
          fetch(process.env.VUE_APP_API+"rutas", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
            .then((response) => response.json()) .then((data) => { if (data) { this.tablaRutas = data["data"]; } else { this.tablaDatos = []; } });
        } catch (e) { }
      },
  
  
      createFunction() {
        this.showModalCreateEdit = true;
        this.isAdd = true;
      },
      submit() {
        if (this.isAdd) {
          fetch(process.env.VUE_APP_API+"Tarjeta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              //agregar campos a crear
              cedula:this.inputCedula,
              nombres:this.inputNombres,
              apellidos:this.inputApellidos,
              direccion:this.inputDireccion,
              telefono:this.inputTelefono,
              tipoTarjeta:this.inputTipoTarjeta,
              activo:this.inputActivo,
  
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              var resp = data.message;
              console.log(resp);
  
              //encerar valores
              this.inputCedula=""
              this.inputNombres=""
              this.inputApellidos=""
              this.inputDireccion=""
              this.inputTelefono=""
              this.inputTipoTarjeta=1
              this.inputActivo=true
  
  
              //cerrar modal
              this.isAdd = false;
              this.isEdit = false;
  
              this.showModalCreateEdit = false;
              this.$buefy.dialog.alert("Tarjeta agregado correctamente");
  
              this.fetchTarjetas();
            });
        } else if (this.isEdit) {
          fetch(
            process.env.VUE_APP_API+"Tarjetas",
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                //agregar campos editados
                id:this.idSeleccionado,
                cedula:this.inputCedula,
                nombres:this.inputNombres,
                apellidos:this.inputApellidos,
                direccion:this.inputDireccion,
                telefono:this.inputTelefono,
                tipoTarjeta:this.inputTipoTarjeta,
                activo:this.inputActivo,
              }),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              var resp = data.message;
              //limpiar campos
              this.inputCedula=""
              this.inputNombres=""
              this.inputApellidos=""
              this.inputDireccion=""
              this.inputTelefono=""
              this.inputTipoTarjeta=1
              this.inputActivo=true
              //this.fetchUsers();
              this.showModalCreateEdit = false;
              this.$buefy.dialog.alert("Tarjeta editado correctamente");
              //llamar fetch
              this.fetchTarjetas();
            });
        }
      },
      editFunction(row) {
        //obtener valores para editar en form
  
        this.inputCedula=row.cedula
        this.inputNombres=row.nombres
        this.inputApellidos=row.apellidos
        this.inputDireccion=row.direccion
        this.inputTelefono=row.telefono
        this.inputTipoTarjeta=row.tipoTarjeta
        this.inputActivo=row.activo
        this.idSeleccionado = row.id;
  
        //mostrar modal
        this.showModalCreateEdit = true;
        this.isAdd = false;
        this.isEdit = true;
      },
      deleteFunction(row) {
        const idDel = row.id;
        fetch(process.env.VUE_APP_API+"Tarjetas/" + idDel.toString(), {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            //limpiar campos form
            this.selected = null;
            this.isAdd = false;
            this.isEdit = false;
            this.username = "";
            this.email = "";
            this.password = "";
            this.password2 = "";
  
            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Tarjeta eliminado correctamente");
            //llamar fetch
            this.fetchTarjetas();
          });
      },
    },
  };
  </script>
  
  <style>
  </style>