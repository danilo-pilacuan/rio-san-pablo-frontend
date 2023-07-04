<template>
  <div id="users" class="home">
    <hero-bar>
      Inventarios
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
                  {{ props.row[column.field][column.subField] }}
                </div>
                <div v-else>
                  {{ props.row[column.field] }}
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
            <div class="columns">
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
                <b-field label="Tipo Inventario">
                  <b-select placeholder="Tipo Inventario" v-model="inputTipoInventario">
                    
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

      inputCedula:"",
      inputNombres:"",
      inputApellidos:"",
      inputDireccion:"",
      inputTelefono:"",
      inputTipoInventario:1,
      inputActivo:true,
      //info entidad
      nombreEntidad: "Inventario",
      uri: process.env.VUE_APP_API+"inventario",
      //tablas Datos
      tablaDatos: [],
      //columnas tabla Datos
      columns: [
        
        {
          field: "nombre",
          label: "Nombre",
          searchable: true,
        },
        {
          field: "descripcion",
          label: "Descripción",
          searchable: true,
        },
        {
          field: "cantidad",
          label: "Cantidad",
          searchable: true,
        },
        {
          field: "observaciones",
          label: "Observaciones",
          searchable: true,
        },
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
    this.fetchInventarios();
    
    console.log("ENVENVNENVNVNENVS")
    console.log(this.titleSAs)
  },
  methods: {
   
    fetchInventarios() {
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
        fetch(process.env.VUE_APP_API+"Inventario", {
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
            tipoInventario:this.inputTipoInventario,
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
            this.inputTipoInventario=1
            this.inputActivo=true


            //cerrar modal
            this.isAdd = false;
            this.isEdit = false;

            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Inventario agregado correctamente");

            this.fetchInventarios();
          });
      } else if (this.isEdit) {
        fetch(
          process.env.VUE_APP_API+"Inventarios",
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
              tipoInventario:this.inputTipoInventario,
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
            this.inputTipoInventario=1
            this.inputActivo=true
            //this.fetchUsers();
            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Inventario editado correctamente");
            //llamar fetch
            this.fetchInventarios();
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
      this.inputTipoInventario=row.tipoInventario
      this.inputActivo=row.activo
      this.idSeleccionado = row.id;

      //mostrar modal
      this.showModalCreateEdit = true;
      this.isAdd = false;
      this.isEdit = true;
    },
    deleteFunction(row) {
      const idDel = row.id;
      fetch(process.env.VUE_APP_API+"Inventarios/" + idDel.toString(), {
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
          this.$buefy.dialog.alert("Inventario eliminado correctamente");
          //llamar fetch
          this.fetchInventarios();
        });
    },
  },
};
</script>

<style>
</style>