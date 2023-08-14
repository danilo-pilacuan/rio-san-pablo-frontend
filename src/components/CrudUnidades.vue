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
          :focusable="false"
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
                @click="viewFunction(props.row)"
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
                <b-field label="Placa"
                :type="{ 'is-danger': !isPlacaValid }"
                  :message="{ 'Placa no válida, se debe ingresar con el siguiente formato XYZ-### (##)': !isPlacaValid }">
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
                    
                    <option :value="true">Activo</option>
                    <option :value="false">Inactivo</option>

                  </b-select>
                </b-field>
              </div>
            </div>

            <div class="columns">
          <div class="column">
            <b-field label="Foto Unidad">
              <b-upload v-model="fotoUnidad" class="file-label" rounded>
                  <span class="file-cta">
                      <b-icon class="file-icon" icon="upload"></b-icon>
                      <span class="file-label">Click to upload</span>
                  </span>
                  <span class="file-name" v-if="fotoUnidad">
                      {{ fotoUnidad.name }}
                  </span>
              </b-upload>
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
                  :disabled="!formValidado"
                />
                <b-button
                  type="is-primary"
                  v-else
                  @click="submit"
                  label="Editar"
                  :disabled="!formValidado"
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

    <b-modal v-model="showUnidad">
      <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Vista Unidad</p>
      <button type="button" class="delete" @click="showUnidad=!showUnidad"> </button>
    </header>
    <section class="modal-card-body">

      <div class="columns">
          <div class="column">
          <b-field label="Foto Unidad">
            <b-image
            :src="urlFotoUnidad"
            
            ratio="16by9"
            
        ></b-image>
          </b-field>
        </div>
      </div>

    


      
      
      <!-- <br><br>
      <Pano class="panoContainer" source="http://localhost:3000/images/1689761153134-617068.jpg"></Pano> -->
    </section>
    <footer class="modal-card-foot">
      <div class="columns">
        
        <div class="column">
          <b-button type="is-danger" @click="showUnidad=!showUnidad" label="Cerrar" />
        </div>
      </div>
    </footer>
      </div>

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
    inputPlaca: function(newVal) {
          this.validatePlaca(newVal);
      },
  },
  computed: {
    formValidado() {
            return this.isPlacaValid;
        }
    },
  data() {
    return {
      isPlacaValid:false,


      tipoUsuario:1,
      idSeleccionado:0,

      inputObservaciones:"",
      inputPlaca:"",
      inputDescripcion:"",
      inputActivo:true,
      urlFotoUnidad:"",
      fotoUnidad:null,
      showUnidad:false,

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
    
  },
  methods: {
    validatePlaca(input) {
        const regex = /^[A-Za-z]{3}-\d{3,4} \(\d{1,3}\)$/;
        this.isPlacaValid = regex.test(input);
    },
    viewFunction(unidad) {
    this.urlFotoUnidad=process.env.VUE_APP_API+unidad.urlFotoUnidad;
    console.log(unidad)
    this.showUnidad=true;
  },
   
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
    resetForm(){
      //encerar valores
      this.inputObservaciones=""
      this.inputPlaca=""
      this.inputDescripcion=""
      this.inputActivo=true
      this.urlFotoUnidad=""
      this.fotoUnidad=null


      //cerrar modal
      this.isAdd = false;
      this.isEdit = false;

      this.showModalCreateEdit = false;
      this.fetchUnidads();
    },
    submit() {
      if(this.fotoUnidad==null)
      {
        this.$buefy.dialog.alert("Seleccione una imagen");
      }
      else
      {
        if (this.isAdd) {

let formData = new FormData();
formData.append( 'placa', this.inputPlaca);
formData.append( 'descripcion', this.inputDescripcion);
formData.append( 'observaciones',  this.inputObservaciones);
formData.append( 'urlFotoUnidad',  "");
formData.append( 'fotoUnidad',  this.fotoUnidad);
formData.append( 'activo',  this.inputActivo);


fetch(process.env.VUE_APP_API+"Unidads/uploadimages", {
  method: "POST",
  headers: { "Accept": "application/json", },
  credentials: "include",
  body: formData
})
  .then((response) => response.json())
  .then((data) => {
    var resp = data.message;
    console.log(resp);

    
    this.$buefy.dialog.alert("Unidad agregado correctamente");

    this.resetForm();
  });
} else if (this.isEdit) {

let formData = new FormData();
formData.append( 'id', this.idSeleccionado);
formData.append( 'placa', this.inputPlaca);
formData.append( 'descripcion', this.inputDescripcion);
formData.append( 'observaciones',  this.inputObservaciones);
formData.append( 'urlFotoUnidad',  "");
formData.append( 'fotoUnidad',  this.fotoUnidad);
formData.append( 'activo',  this.inputActivo);

//console.log(formData)

fetch(
  process.env.VUE_APP_API+"Unidads/withImages",
  {
    method: "PUT",
    headers: { "Accept": "application/json", },
    credentials: "include",
    body: formData,
  }
)
  .then((response) => response.json())
  .then((data) => {
    var resp = data.message;
    
    this.$buefy.dialog.alert("Unidad editado correctamente");
    //llamar fetch
    this.resetForm();
  });
}
      }
    },
    editFunction(row) {
      //obtener valores para editar en form

      this.inputObservaciones=row.observaciones
      this.inputPlaca=row.placa
      this.inputDescripcion=row.descripcion
      this.inputActivo=row.activo
      this.idSeleccionado = row.id;
      this.urlFotoUnidad = row.urlFotoUnidad;

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