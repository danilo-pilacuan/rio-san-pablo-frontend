<template>
  <div id="users" class="home">
    <hero-bar>
      Horarios
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
          :focusable="false"
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
                type="is-link"
                icon-left="eye"
                @click="$router.push('/horarios/' + props.row.id)"
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
                
                  <b-field label="Descripción">
                    <b-input v-model="horario.descripcion"></b-input>
                  </b-field>
              </div>
                      
              <div class="columns">
                        
                          <b-field label="Año">
                            <b-input v-model="horario.anio"></b-input>
                          </b-field>
                        
                        </div>  
                        
                        <div class="columns">
                          <b-field label="Mes">
                            <b-select placeholder="Seleccionar Mes" v-model="horario.mes">
                              <option
                                  v-for="option in tablaMeses"
                                  :value="option.id"
                                  :key="option.id">
                                  {{ option.descripcion}}
                              </option>
                            </b-select>
                          </b-field>
                        </div>
                        <div class="columns">
                          <b-field label="Observaciones">
                            <b-input v-model="horario.observaciones"></b-input>
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

      horario:{
        id:0,
        descripcion:"",
        mes:1,
        anio:2023,
        observaciones:"",
      },
      //info entidad
      nombreEntidad: "calendario",
      uri: process.env.VUE_APP_API+"calendarios",
      //tablas Datos
      tablaDatos: [],
      tablaSocios:[],
      tablaUnidades:[],
      tablaRutas:[],
      //columnas tabla Datos
      columns: [
        
        // { field: "id", label: "Id", searchable: true, },
        { field: "descripcion", label: "Descripción", searchable: true, },
        { field: "mes", label: "Mes", searchable: true, },
        { field: "anio", label: "Año", searchable: true, },
        { field: "observaciones",label: "Observaciones", searchable: true, }
      ],
      tablaMeses:[
        {id:1,descripcion:"Enero"},
        {id:2,descripcion:"Febrero"},
        {id:3,descripcion:"Marzo"},
        {id:4,descripcion:"Abril"},
        {id:5,descripcion:"Mayo"},
        {id:6,descripcion:"Junio"},
        {id:7,descripcion:"Julio"},
        {id:8,descripcion:"Agosto"},
        {id:9,descripcion:"Septiembre"},
        {id:10,descripcion:"Octubre"},
        {id:11,descripcion:"Noviembre"},
        {id:12,descripcion:"Diciembre"},
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
    this.fetchHorarios();
  },
  methods: {
    resetForm() {
        this.horario = {
          id:0,
        descripcion:"",
        mes:1,
        anio:2023,
        observaciones:"",
        }
        this.isAdd = false;
        this.isEdit = false;
        this.showModalCreateEdit = false;
        this.fetchHorarios();
    },
    fetchHorarios() {
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
        fetch(process.env.VUE_APP_API+"calendarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(this.horario),
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            console.log(resp);

            //encerar valores
           



            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Horario agregada correctamente");

            this.resetForm();
          });
      } else if (this.isEdit) {
        this.horario.id=this.idSeleccionado
        fetch(
          process.env.VUE_APP_API+"horarios/"+this.idSeleccionado,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(this.horario),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            //limpiar campos
            
            this.$buefy.dialog.alert("Horario editada correctamente");
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
      this.inputTipoHorario=row.tipoHorario
      this.inputActivo=row.activo
      this.idSeleccionado = row.id;

      //mostrar modal
      this.showModalCreateEdit = true;
      this.isAdd = false;
      this.isEdit = true;
    },
    deleteFunction(row) {
      const idDel = row.id;
      fetch(process.env.VUE_APP_API+"calendarios/" + idDel.toString(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          var resp = data.message;
          //limpiar campos form
          
          this.$buefy.dialog.alert("Horario eliminado correctamente");
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