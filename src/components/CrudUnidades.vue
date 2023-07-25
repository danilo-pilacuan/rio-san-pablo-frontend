<template>
  <div id="users" class="home">
    <hero-bar>
      Unidades
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

          <!-- <b-table-column
            v-slot="props"
            label="Placa"
            field="placa"
            searchable
          >
          
            {{ props.row.placa }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            label="Descripción"
            field="descripcion"
            searchable
          >
            {{ props.row.descripcion }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            label="Observaciones"
            field="observaciones"
            searchable
          >
            {{ props.row.observaciones }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            label="Activo"
            field="activo"
            searchable
          >
            {{ props.row.activo?"Si":"No" }}
          </b-table-column> -->
          
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
                    {{ column.field=="activo"?(props.row[column.field]==1?"Si":"No"):props.row[column.field] }}
                  </div>
                </template>
              </b-table-column>
            </template>

          <b-table-column field="actions" label="Acciones" v-slot="props" cell-class="noPrint" header-class="noPrint">
            <div class="buttons" style="display: flex; flex-wrap: inherit;">
            <b-button
                rounded
                type="is-link"
                icon-left="eye"
                @click="verFicha(props.row)"
              >
              </b-button>


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


            <div class="columns">
              <div class="column">
                <b-field label="Placa">
                  <b-input v-model="inputPlaca"></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Descripción">
                  <b-input v-model="inputDescripcion"></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Estado Técnico">
                  <b-input v-model="inputObservaciones"></b-input>
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

      inputObservaciones:"",
      inputPlaca:"",
      inputDescripcion:"",
      inputActivo:true,
      urlFotoUnidad:"",

      //info entidad
      nombreEntidad: "Unidad",
      uri: process.env.VUE_APP_API+"unidads",
      //tablas Datos
      tablaDatos: [],
      //columnas tabla Datos

      //tablas auxiliares

      //auxiliares modal
      isAdd: false,
      isEdit: false,

      showModalCreateEdit: false,
      showModalDelete: false,

      //control errores validacion
      
      columns: [
        
        { field: "placa", label: "Placa", searchable: true, },
        { field: "descripcion", label: "Descripción", searchable: true, },
        { field: "observaciones", label: "Estado Técnico", searchable: true, }, 
        { field: "activo", label: "Activo", searchable: true, }, 
        
      ],

    };
  },
  mounted() {
    //llamados fetch
    //this.authLogin();
    this.fetchUnidads();
    
    console.log("ENVENVNENVNVNENVS")
    console.log(this.titleSAs)
  },
  methods: {
   
    fetchUnidads() {
      try {
        fetch(this.uri, {
          method: "GET",
          headers: { "Content-Type": "application/json"},
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data;

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
        fetch(process.env.VUE_APP_API+"Unidads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            //agregar campos a crear

            observaciones:this.inputObservaciones,
            placa:this.inputPlaca,
            descripcion:this.inputDescripcion,
            activo:this.inputActivo,
            urlFotoUnidad:this.urlFotoUnidad

          }),
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            console.log(resp);

            //encerar valores
            this.inputObservaciones=""
            this.inputPlaca=""
            this.inputDescripcion=""
            this.inputActivo=true
            this.urlFotoUnidad=""


            //cerrar modal
            this.isAdd = false;
            this.isEdit = false;

            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Unidad agregado correctamente");

            this.fetchUnidads();
          });
      } else if (this.isEdit) {
        fetch(
          process.env.VUE_APP_API+"Unidads",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              //agregar campos editados
              id:this.idSeleccionado,
              observaciones:this.inputObservaciones,
              placa:this.inputPlaca,
              descripcion:this.inputDescripcion,
              activo:this.inputActivo,
              urlFotoUnidad:this.urlFotoUnidad
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            //limpiar campos
            this.inputObservaciones=""
            this.inputPlaca=""
            this.inputDescripcion=""
            this.inputActivo=true
            //this.fetchUsers();
            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Unidad editado correctamente");
            //llamar fetch
            this.fetchUnidads();
          });
      }
    },
    editFunction(row) {
      //obtener valores para editar en form

      this.inputObservaciones=row.observaciones
      this.inputPlaca=row.placa
      this.inputDescripcion=row.descripcion
      this.inputActivo=row.activo
      this.idSeleccionado = row.id;

      //mostrar modal
      this.showModalCreateEdit = true;
      this.isAdd = false;
      this.isEdit = true;
    },
    deleteFunction(row) {
      const idDel = row.id;
      fetch(process.env.VUE_APP_API+"Unidads/" + idDel.toString(), {
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
          this.$buefy.dialog.alert("Unidad eliminado correctamente");
          //llamar fetch
          this.fetchUnidads();
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