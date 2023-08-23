<template>
  <div id="users" class="home">
    <hero-bar>
      Socios y Colaboradores
      <b-button slot="right" class="m-2 noPrint" type="is-link" @click="globalPrint">Imprimir</b-button>
      <b-button slot="right" type="is-primary" @click="createFunction" :disabled="user && user.tipo != 1">Crear</b-button>
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
          

          <b-table-column field="actions" label="Acciones" v-slot="props" cell-class="noPrint" header-class="noPrint">
            <div class="buttons" style="display: flex; flex-wrap: inherit;">
            <!-- <b-button
                rounded
                type="is-link"
                icon-left="eye"
                @click="verFicha(props.row)"
              >
              </b-button> -->


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
                :disabled="user && user.tipo != 1"
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
                  :type="{ 'is-danger': !isCedulaValid }"
                  :message="{ 'Cédula no válida': !isCedulaValid }"
                >
                
                  <b-input v-model="inputCedula" :disabled="user && user.tipo != 1"
                  ></b-input>
                </b-field>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <b-field label="Nombres"
                :type="{ 'is-danger': !isNombresValid }"
                  :message="{ 'Nombres no válidos, solo se permiten letras': !isNombresValid }">
                  <b-input v-model="inputNombres" :disabled="user && user.tipo != 1"></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Apellidos"
                :type="{ 'is-danger': !isApellidosValid }"
                  :message="{ 'Apellidos no válidos, solo se permiten letras': !isApellidosValid }">
                  <b-input v-model="inputApellidos" :disabled="user && user.tipo != 1"></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Dirección"
                :type="{ 'is-danger': !isDireccionValid }"
                  :message="{ 'Formato de dirección no válida': !isDireccionValid }">
                  <b-input v-model="inputDireccion" :disabled="user && user.tipo != 1"></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="Celular"
                :type="{ 'is-danger': !isTelefonoValid }"
                :message="{ 'Celular no válido': !isTelefonoValid }">
                  <b-input v-model="inputTelefono" :disabled="user && user.tipo != 1"></b-input>

                </b-field>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <b-field label="Tipo Socio">
                  <b-select placeholder="Tipo Socio" v-model="inputTipoSocio" :disabled="user && user.tipo != 1">
                    
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
                    
                    <option :value="true">Activo</option>
                    <option :value="false">Inactivo</option>

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
  </div>
</template>

<script>
import HeroBar from '@/components/HeroBar.vue'

export default {
    components: {
    HeroBar
  },
  watch: {
    inputTelefono: function(newVal) {
          this.validateTelefono(newVal);
      },
      inputCedula: function(newVal) {
          this.validateCedula(newVal);
      },
      inputNombres: function(newVal) {
          this.validateNombres(newVal);
      },
      inputApellidos: function(newVal) {
          this.validateApellidos(newVal);
      },
      inputDireccion: function(newVal) {
          this.validateDireccion(newVal);
      }
  },
  computed: {
    formValidado() {
            return this.isTelefonoValid &&
            this.isCedulaValid &&
            this.isNombresValid &&
            this.isApellidosValid &&
            this.isDireccionValid;
        },
        user() {
            return this.$store.state.user;
        },
    },
  data() {
    return {
      resultado:'',
      isTelefonoValid: false,
      isCedulaValid:false,
      isNombresValid:false,
      isApellidosValid:false,
      isDireccionValid:false,

      tipoUsuario:1,
      idSeleccionado:0,
      
      inputCedula:"",
      inputNombres:"",
      inputApellidos:"",
      inputDireccion:"",
      inputTelefono:"",
      inputTipoSocio:1,
      inputActivo:true,
      urlFotoSocio:"",
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
    validateTelefono(input) {
            // Define the regular expression for validation (allowing only letters and numbers)
            const regex = /^[0-9]{10}$/;

            // Perform the validation
            this.isTelefonoValid = regex.test(input);
        },
        validateCedula(input) {
            // const regex = /^[0-9]+$/;
            // this.isCedulaValid = regex.test(input);
            //console.log('validate ced')
            if (input.length !== 10 || isNaN(input)) {
                //this.resultado = 'La cédula ingresada no es válida';
                //console.log('La cédula ingresada no es válida')
                this.isCedulaValid=false;
            }


            // console.log("cedulaArray")
            // console.log(cedulaArray)
            const cedulaArray = input.split('').map(Number);
            const impares = [];
            const pares = [];

            for (let i = 0; i < cedulaArray.length-1; i++) {
                if (i % 2 === 0) {
                    impares.push(cedulaArray[i] * 2 > 9 ? cedulaArray[i] * 2 - 9 : cedulaArray[i] * 2);
                } else {
                    pares.push(cedulaArray[i]);
                }
            }

            const sumaImpares = impares.reduce((acc, val) => acc + val, 0);
            const sumaPares = pares.reduce((acc, val) => acc + val, 0);
            const sumaTotal = sumaImpares + sumaPares;

            // console.log("sumaImpares")
            // console.log(sumaImpares)
            // console.log("sumaPares")
            // console.log(sumaPares)
            // console.log("sumaTotal")
            // console.log(sumaTotal)

            const digitoVerificador = sumaTotal % 10 === 0 ? 0 : 10 - (sumaTotal % 10);
            // console.log("digitoVerificador")
            // console.log(digitoVerificador)
            // console.log("cedulaArray[9]")
            // console.log(cedulaArray[9])

            if(digitoVerificador===cedulaArray[9])
            {
              //console.log("ok")
              this.isCedulaValid=true;
              return;
            }
            //console.log("false")
            this.isCedulaValid=false;
            // // console.log("impares")
            // // console.log(impares)
            

        },
        validateNombres(input) {
            const regex =/^(?!.*\s{3,})[a-zA-ZáéíóúÁÉÍÓÚñÑ-][a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
            this.isNombresValid = regex.test(input);
        },
        validateApellidos(input) {
            const regex = /^(?!.*\s{3,})[a-zA-ZáéíóúÁÉÍÓÚñÑ-][a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
            this.isApellidosValid = regex.test(input);
        },
        validateDireccion(input) {
            const regex =  /^(?!.*\s{3,})[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-][0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
            this.isDireccionValid = regex.test(input);
        },
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
            urlFotoSocio:this.urlFotoSocio
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
              urlFotoSocio:this.urlFotoSocio
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
@media print{
  .noPrint { display: none !important; }
  .level-right
  {
    display: none;
  }
}
</style>