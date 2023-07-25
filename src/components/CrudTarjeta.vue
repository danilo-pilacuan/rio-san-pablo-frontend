<template>
  <div id="users" class="home">
    <hero-bar>
      Tarjetas
      <b-button slot="right" class="m-2 noPrint" type="is-link" @click="globalPrint">Imprimir</b-button>
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
          <b-table-column field="actions" label="Acciones" v-slot="props" cell-class="noPrint" header-class="noPrint">
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
                      
                          <b-field label="Unidad">
                            
                            <b-select placeholder="Seleccionar Unidad" v-model="tarjeta.idUnidad">
                              <option
                                  v-for="option in tablaUnidades"
                                  :value="option.id"
                                  :key="option.id">
                                  {{ option.placa }}
                              </option>
                            </b-select>
                          </b-field>
                        
                          <b-field label="Ruta">
                            
                            <b-select placeholder="Seleccionar Ruta" v-model="tarjeta.idRuta">
                              <option
                                  v-for="option in tablaRutas"
                                  :value="option.id"
                                  :key="option.id">
                                  {{ option.nombre }}
                              </option>
                            </b-select>
                          </b-field>
                        
                          <b-field label="Chofer">
                            <b-select placeholder="Seleccionar Chofer" v-model="tarjeta.idChofer">
                              <option
                                  v-for="option in tablaSocios.filter((e)=>e.tipoSocio==1)"
                                  :value="option.id"
                                  :key="option.id">
                                  {{ option.nombres}} {{ option.apellidos}}
                              </option>
                            </b-select>
                          </b-field>
                        
                        
                          <b-field label="Controlador">
                            <b-select placeholder="Seleccionar Controlador" v-model="tarjeta.idControlador">
                              <option
                                  v-for="option in tablaSocios.filter((e)=>e.tipoSocio==2)"
                                  :value="option.id"
                                  :key="option.id">
                                  {{ option.nombres}} {{ option.apellidos}}
                              </option>
                            </b-select>
                          </b-field>
                          
                          <b-field label="Observaciones">
                            <b-input v-model="tarjeta.observaciones"></b-input>
                          </b-field>
                        
                      </div>
                    
                </div>
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
        idUnidad:0,
        idRuta:0,
        idChofer:0,
        idControlador:0,
        reporteId:0
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
        
        { field: "id", label: "Id", searchable: true, },
        { field: "fecha", label: "Fecha", searchable: true, },
        { field: "observaciones", label: "Observaciones", searchable: true, },
        { field: "unidad", subFields: ["placa"], label: "Unidad", searchable: true, },
        { field: "ruta", subFields:["nombre"],label: "Ruta", searchable: true, },
        { field: "chofer",subFields:["nombres","apellidos"], label: "Chofer", searchable: true, },
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
    this.fetchUnidades();
    this.fetchTarjetas();
  },
  methods: {
    resetForm() {
        this.tarjeta = {
          id:0,
        fecha:new Date(),
        observaciones:"",
        idUnidad:0,
        idRuta:0,
        idChofer:0,
        idControlador:0,
        reporteId:this.$route.params.id,
        }
        this.isAdd = false;
        this.isEdit = false;
        this.showModalCreateEdit = false;
        this.fetchTarjetas();
    },
    fetchTarjetas() {
      try {
        fetch(this.uri+"/byIdReporte/"+this.$route.params.id, {
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
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaSocios = data["data"]; } else { this.tablaSocios = []; } });
      } catch (e) { }
    },
    fetchUnidades() {
      try {
        fetch(process.env.VUE_APP_API+"unidads", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaUnidades = data["data"]; } else { this.tablaUnidades = []; } });
      } catch (e) { }
    },
    fetchRutas() {
      try {
        fetch(process.env.VUE_APP_API+"rutas", { method: "GET", headers: { "Content-Type": "application/json"}, credentials: "include", })
          .then((response) => response.json()) .then((data) => { if (data) { this.tablaRutas = data["data"]; } else { this.tablaRutas = []; } });
      } catch (e) { }
    },


    createFunction() {
      this.showModalCreateEdit = true;
      this.isAdd = true;
    },
    submit() {
      if (this.isAdd) {
        fetch(process.env.VUE_APP_API+"Tarjetas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(this.tarjeta),
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            console.log(resp);

            //encerar valores
           



            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Tarjeta agregada correctamente");

            this.resetForm();
          });
      } else if (this.isEdit) {
        this.tarjeta.id=this.idSeleccionado
        fetch(
          process.env.VUE_APP_API+"tarjetas/"+this.idSeleccionado,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(this.tarjeta),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            //limpiar campos
            
            this.$buefy.dialog.alert("Tarjeta editada correctamente");
            //llamar fetch
            this.resetForm();
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
          
          this.$buefy.dialog.alert("Tarjeta eliminado correctamente");
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