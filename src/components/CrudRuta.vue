<template>
  <div id="users" class="home">
      <hero-bar>
          Rutas
          <b-button slot="right" class="m-2 noPrint" type="is-link" @click="globalPrint">Imprimir</b-button>
          <b-button slot="right" type="is-primary" @click="createFunction">Crear</b-button>
      </hero-bar>
      <div class="container ml-1 mr-1" style="max-width: 100%">
          <div class="block">

              <b-table :data="tablaDatos" :bordered="true" :striped="true" :narrowed="false" :hoverable="false"
                  :loading="false" :focusable="true" :mobile-cards="false" :searchable="true" :paginated="true"
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
                                  {{ props.row[column.field] }}
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
          <form @submit.prevent="submit" v-if="ruta">
              <!-- <b-checkbox v-model="hasError">Show errors</b-checkbox> -->
              <div class="modal-card" style="width: auto">
                  <header class="modal-card-head">
                      <p class="modal-card-title">Crear {{ nombreEntidad }}</p>
                      <!-- <button type="button" class="delete" @click="showModalCreateEdit = false"> </button> -->
                      <b-button type="is-danger" @click="showModalCreateEdit = false" icon-left="close" rounded />
                  </header>
                  <section class="modal-card-body">
                      <div class="row">
                          <div class="columns">
                              <div class="column">
                                  <b-field label="Nombre">
                                      <b-input v-model="ruta.nombre"></b-input>
                                  </b-field>
                                  <b-field label="Lugar Inicio">
                                      <b-input v-model="ruta.lugarInicio"></b-input>
                                  </b-field>
                                  <b-field label="Lugar Fin">
                                      <b-input v-model="ruta.lugarFin"></b-input>
                                  </b-field>
                                  <b-field label="Hora Inicio">
                                    <b-select placeholder="Seleccionar Hora" v-model="ruta.horaInicio">
                                      <option
                                          v-for="option in dataHoras"
                                          :value="option.hora"
                                          :key="option.id">
                                          {{ option.hora }}
                                      </option>
                                    </b-select>
                                  </b-field>
                                  <b-field label="Hora Fin">
                                    <b-select placeholder="Seleccionar Hora" v-model="ruta.horaFin">
                                      <option
                                          v-for="option in dataHoras"
                                          :value="option.hora"
                                          :key="option.id">
                                          {{ option.hora }}
                                      </option>
                                    </b-select>
                                  </b-field>
                                  <b-field label="Ruta Activa">
                                    <b-select placeholder="Seleccionar Hora" v-model="ruta.activa">                
                                      <option value="true">Activa</option>
                                      <option value="false">Inactiva</option>
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
  data() {
      return {
          tipoUsuario: 1,
          idSeleccionado: 0,

          ruta: null,

          dataHoras:[
            {id:1,hora:"05:00"},
            {id:2,hora:"05:30"},
            {id:3,hora:"06:00"},
            {id:4,hora:"06:30"},
            {id:5,hora:"07:00"},
            {id:6,hora:"07:30"},
            {id:7,hora:"08:00"},
            {id:8,hora:"08:30"},
            {id:9,hora:"09:00"},
            {id:10,hora:"09:30"},
            {id:11,hora:"10:00"},
            {id:12,hora:"10:30"},
            {id:13,hora:"11:00"},
            {id:14,hora:"11:30"},
            {id:15,hora:"12:00"},
            {id:16,hora:"12:30"},
            {id:17,hora:"13:00"},
            {id:18,hora:"13:30"},
            {id:19,hora:"14:00"},
            {id:20,hora:"14:30"},
            {id:21,hora:"15:00"},
            {id:22,hora:"15:30"},
            {id:23,hora:"16:00"},
            {id:24,hora:"16:30"},
            {id:25,hora:"17:00"},
            {id:26,hora:"17:30"},
            {id:27,hora:"18:00"},
            {id:28,hora:"18:30"},
            {id:29,hora:"19:00"},
            {id:30,hora:"19:30"},
          ],

          //info entidad
          nombreEntidad: "Ruta",
          baseUri: process.env.VUE_APP_API + "rutas",
          //tablas Datos
          tablaDatos: [],
          //columnas tabla Datos
          columns: [
              {
                  field: "nombre",
                  label: "Nombre",
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
                  field: "horaInicio",
                  label: "Hora Inicio",
              },
              {
                  field: "horaFin",
                  label: "Hora Fin",
              },
              {
                  field: "activa",
                  label: "Activa",
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
      this.resetForm();
  },
  methods: {
      resetForm() {
          this.ruta = {
              id: 0,
              nombre:"",
              lugarInicio:"",
              lugarFin:"",
              horaInicio:"05:30",
              horaFin:"18:00",
              activa:true
          }
          this.isAdd = false;
          this.isEdit = false;
          this.showModalCreateEdit = false;
          this.fetchRutas();
      },
      fetchRutas() {
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
                  body: JSON.stringify(this.ruta),
              })
                  .then((response) => response.json())
                  .then((data) => {
                      var resp = data.message;
                      console.log(resp);

                      //cerrar modal

                      this.$buefy.dialog.alert("Ruta agregado correctamente");

                      this.resetForm();

                  });
          } else if (this.isEdit) {
              fetch(
                  this.baseUri + "/" + this.ruta.id,
                  {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify(this.ruta),
                  }
              )
                  .then((response) => response.json())
                  .then((data) => {
                      var resp = data.message;
                      console.log(resp)
                      //limpiar campos

                      //this.fetchUsers();

                      this.$buefy.dialog.alert("Ruta editado correctamente");
                      //llamar fetch
                      this.showModalCreateEdit = false;

                  });
          }
      },
      editFunction(row) {
          //obtener valores para editar en form
          this.ruta=row;
          //mostrar modal
          this.showModalCreateEdit = true;
          this.isAdd = false;
          this.isEdit = true;
      },
      deleteFunction(row) {
          const idDel = row.id;
          fetch(process.env.VUE_APP_API + "Rutas/" + idDel.toString(), {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
          })
              .then((response) => response.json())
              .then((data) => {
                  var resp = data.message;
                  //limpiar campos form

                  this.$buefy.dialog.alert("Ruta eliminado correctamente");
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