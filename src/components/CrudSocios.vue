<template>
  <div id="users" class="home">
    <hero-bar>
      Socios
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
                    {{ column.field=="activo"?(props.row[column.field]==1?"Si":"No"):"" }}
                    {{ column.field=="tipoSocio"?(props.row[column.field]==1?"Chofer":"Controlador"):"" }}
                    {{ (column.field!="tipoSocio" && column.field!="activo")?props.row[column.field]:"" }}
                  </div>
                </template>
              </b-table-column>
            </template>


          <!-- <b-table-column
            v-slot="props"
            label="Cédula"
            field="cedula"
            searchable
          >
            {{ props.row.cedula }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            label="Nombres"
            field="nombres"
            searchable
          >
            {{ props.row.nombres }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            label="Apellidos"
            field="apellidos"
            searchable
          >
            {{ props.row.apellidos }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            label="Dirección"
            field="direccion"
            searchable
          >
            {{ props.row.direccion }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            label="Teléfono"
            field="telefono"
            searchable
          >
            {{ props.row.telefono }}
          </b-table-column>
          <b-table-column
            v-slot="props"
            label="Tipo Socio"
            field="tipoSocio"
            searchable
          >
            {{ props.row.tipoSocio }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            label="Activo"
            field="activo"
            searchable
          >
            {{ props.row.activo?"Si":"No" }}
          </b-table-column> -->
          

          <b-table-column field="actions" label="Acciones" v-slot="props">
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
                <b-field label="Tipo Socio">
                  <b-select placeholder="Tipo Socio" v-model="inputTipoSocio">
                    
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
      inputTipoSocio:1,
      inputActivo:true,
      //info entidad
      nombreEntidad: "Socio",
      uri: process.env.VUE_APP_API+"socios",
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
        
        { field: "cedula", label: "Cédula", searchable: true, },
        { field: "nombres", label: "Nombres", searchable: true, },
        { field: "apellidos", label: "Apellidos", searchable: true, }, 
        { field: "direccion", label: "Dirección", searchable: true, }, 
        { field: "telefono", label: "Teléfono", searchable: true, }, 
        { field: "tipoSocio", label: "Tipo Socio", searchable: true, }, 
        { field: "activo", label: "Activo", searchable: true, }, 
        
      ],

    };
  },
  mounted() {
    //llamados fetch
    //this.authLogin();
    this.fetchSocios();
  
  },
  methods: {
   
    fetchSocios() {
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
        fetch(process.env.VUE_APP_API+"Socios", {
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
            tipoSocio:this.inputTipoSocio,
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
            this.inputTipoSocio=1
            this.inputActivo=true


            //cerrar modal
            this.isAdd = false;
            this.isEdit = false;

            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Socio agregado correctamente");

            this.fetchSocios();
          });
      } else if (this.isEdit) {
        fetch(
          process.env.VUE_APP_API+"Socios",
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
              tipoSocio:this.inputTipoSocio,
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
            this.inputTipoSocio=1
            this.inputActivo=true
            //this.fetchUsers();
            this.showModalCreateEdit = false;
            this.$buefy.dialog.alert("Socio editado correctamente");
            //llamar fetch
            this.fetchSocios();
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
      this.inputTipoSocio=row.tipoSocio
      this.inputActivo=row.activo
      this.idSeleccionado = row.id;

      //mostrar modal
      this.showModalCreateEdit = true;
      this.isAdd = false;
      this.isEdit = true;
    },
    deleteFunction(row) {
      const idDel = row.id;
      fetch(process.env.VUE_APP_API+"Socios/" + idDel.toString(), {
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
          this.$buefy.dialog.alert("Socio eliminado correctamente");
          //llamar fetch
          this.fetchSocios();
        });
    },
  },
};
</script>

<style>
</style>