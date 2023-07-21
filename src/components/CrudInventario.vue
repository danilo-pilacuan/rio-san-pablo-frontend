<template>
  <div id="users" class="home">
    <hero-bar>
      Inventario de Oficina
      <b-button slot="right" class="m-3 noPrint" type="is-link" @click="printFunction">Imprimir</b-button>
      <b-button slot="right" class="noPrint" type="is-primary" @click="createFunction">Crear</b-button>
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
                  class="noPrint"
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
          <b-table-column field="actions" label="Acciones" v-slot="props" cell-class="noPrint" header-class="noPrint">
            <div class="buttons noPrint">
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

    <b-modal v-model="showModalCreateEdit" v-if="inventario">
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
                  label="Nombre"
                >
                  <b-input v-model="inventario.nombre"></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <b-field label="Descripción">
                  <b-input v-model="inventario.descripcion"></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Cantidad">
                  <b-input v-model="inventario.cantidad"></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Observaciones">
                  <b-input v-model="inventario.observaciones"></b-input>
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

      inventario:null,
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
    this.resetForm();
    
    console.log("ENVENVNENVNVNENVS")
    console.log(this.titleSAs)
  },
  methods: {
    printFunction() {
            window.print();
        },
    resetForm() {
          this.inventario = {
            nombre: "",
            cantidad: 0,
            descripcion: "",
            observaciones: "",
            activa: true
          }
          this.isAdd = false;
          this.isEdit = false;
          this.showModalCreateEdit = false;
          this.fetchInventarios();
      },
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
          body: JSON.stringify(this.inventario),
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            console.log(resp);
            this.$buefy.dialog.alert("Registro de inventario agregado correctamente");

            this.resetForm();
          });
      } else if (this.isEdit) {
        this.inventario.id=this.idSeleccionado
        console.log(JSON.stringify(this.inventario))
        console.log(process.env.VUE_APP_API+"inventario/"+this.idSeleccionado)
        fetch(
          process.env.VUE_APP_API+"inventario",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(this.inventario),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            var resp = data.message;
            
            
            this.$buefy.dialog.alert("Registro de inventario editado correctamente");
            //llamar fetch
            this.resetForm();
          });
      }
    },
    editFunction(row) {
      //obtener valores para editar en form
      this.idSeleccionado=row.id
      this.inventario=row
      //mostrar modal
      this.showModalCreateEdit = true;
      this.isAdd = false;
      this.isEdit = true;
    },
    deleteFunction(row) {
      const idDel = row.id;
      console.log(process.env.VUE_APP_API+"Inventarios/" + idDel.toString())
      fetch(process.env.VUE_APP_API+"Inventario/" + idDel.toString(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          var resp = data.message;
          //limpiar campos form
          

          
          this.$buefy.dialog.alert("Inventario eliminado correctamente");
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