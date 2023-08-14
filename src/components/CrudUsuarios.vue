<template>
    <div id="users" class="home">
      <hero-bar>
        Usuarios
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
                      {{ column.field=="activo"?(props.row[column.field]==1?"Si":"No"):"" }}
                      {{ column.field=="tipo"?(props.row[column.field]==1?"Administrador":"Secretaria"):"" }}
                      {{ (column.field!="tipo" && column.field!="activo")?props.row[column.field]:"" }}
                    </div>
                  </template>
                </b-table-column>
              </template>
  
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
                  <b-field label="Nombres"
                  :type="{ 'is-danger': !isNombresValid }"
                    :message="{ 'Nombres no válidos, solo se permiten letras': !isNombresValid }">
                    <b-input v-model="inputNombres"></b-input>
                  </b-field>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <b-field label="Apellidos"
                  :type="{ 'is-danger': !isApellidosValid }"
                    :message="{ 'Apellidos no válidos, solo se permiten letras': !isApellidosValid }">
                    <b-input v-model="inputApellidos"></b-input>
                  </b-field>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <b-field label="Correo"
                  :type="{ 'is-danger': !isCorreoValid }"
                    :message="{ 'Ingrese un correo válido': !isCorreoValid }">
                    <b-input v-model="inputCorreo"></b-input>
                  </b-field>
                </div>
              </div>
              
              <div class="columns">
                <div class="column">
                  <b-field label="Contraseña"
                  :type="{ 'is-danger': !isClaveValid }"
                    :message="{ 'La clave debe tener al menos 8 caracteres de longitud, contener al menos una letra mayúscula, contener al menos una letra minúscula y contener al menos un número.'
                                : !isClaveValid }">
                    <b-input v-model="inputClave" password-reveal type="password"></b-input>
                  </b-field>
                </div>
              </div>

              <div class="columns">
                <div class="column">
                  <b-field label="Tipo Usuario">
                    <b-select placeholder="Tipo Usuario" v-model="inputTipoUsuario">
                      
                      <option value="1">Administrador</option>
                      <option value="2">Secretaria</option>  
                    </b-select>
                  </b-field>
                </div>
              </div>
  
              <div class="columns">
                <div class="column">
                  <b-field label="Activo">
                    <b-select placeholder="Activo" v-model="inputActivo">
                      
                      <option value="true">Si</option>
                      <option value="false">No</option>
  
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
      
        inputCorreo: function(newVal) {
            this.validateCorreo(newVal);
        },
        inputNombres: function(newVal) {
            this.validateNombres(newVal);
        },
        inputApellidos: function(newVal) {
            this.validateApellidos(newVal);
        },
        inputClave: function(newVal) {
            this.validateClave(newVal);
        },
      
    },
    computed: {
      formValidado() {
              return this.isCorreoValid &&
              this.isNombresValid &&
              this.isApellidosValid;
          }
      },
    data() {
      return {
        resultado:'',
        isClaveValid:false,
        isCorreoValid:false,
        isNombresValid:false,
        isApellidosValid:false,

        tipoUsuario:1,
        idSeleccionado:0,
        
        inputCorreo:"",
        inputClave:"",
        inputNombres:"",
        inputApellidos:"",
        inputTipoUsuario:1,
        inputActivo:true,
        
        //info entidad
        nombreEntidad: "Usuarios",
        uri: process.env.VUE_APP_API+"users",
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
          { field: "nombres", label: "Nombres", searchable: true, },
          { field: "apellidos", label: "Apellidos", searchable: true, }, 
          { field: "correo", label: "Correo", searchable: true, }, 
          { field: "tipo", label: "Tipo Usuario", searchable: true, }, 
          { field: "activo", label: "Activo", searchable: true, }, 
          
        ],
  
      };
    },
    mounted() {
      //llamados fetch
      //this.authLogin();
      this.fetchUsuarios();
    
    },
    methods: {
      validateTelefono(input) {
              // Define the regular expression for validation (allowing only letters and numbers)
              const regex = /^[0-9]{10}$/;
  
              // Perform the validation
              this.isTelefonoValid = regex.test(input);
          },
          validateCorreo(input) {
              
              const regex =/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
              this.isCorreoValid = regex.test(input);
  
          },
          validateNombres(input) {
              const regex = /^(?!.*\s{3,})[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-][0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
              this.isNombresValid = regex.test(input);
          },
          validateApellidos(input) {
              const regex = /^(?!.*\s{3,})[0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-][0-9a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/;
              this.isApellidosValid = regex.test(input);
          },
          validateClave(input) {
              const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
              this.isClaveValid = regex.test(input);
          },
      fetchUsuarios() {
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
          fetch(process.env.VUE_APP_API+"users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              //agregar campos a crear
              nombres:this.inputNombres,
              apellidos:this.inputApellidos,
              clave:this.inputClave,
              correo:this.inputCorreo,
              tipo:this.inputTipoUsuario,
              activo:this.inputActivo,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              var resp = data.message;
              console.log(resp);
  
              //encerar valores
              this.inputNombres=""
              this.inputApellidos=""
              this.inputCorreo=""
              this.inputClave=""
              this.inputTipoUsuario=1
              this.inputActivo=true
  
  
              //cerrar modal
              this.isAdd = false;
              this.isEdit = false;
  
              this.showModalCreateEdit = false;
              this.$buefy.dialog.alert("Usuario agregado correctamente");
  
              this.fetchUsuarios();
            });
        } else if (this.isEdit) {
          fetch(
            process.env.VUE_APP_API+"users/"+this.idSeleccionado,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                //agregar campos editados
                id:this.idSeleccionado,
                nombres:this.inputNombres,
                clave:this.inputClave,
                apellidos:this.inputApellidos,
                correo:this.inputCorreo,
                tipo:this.inputTipoUsuario,
                activo:this.inputActivo,
              }),
            }
          )
            .then((response) => response.json())
            .then((data) => {
              var resp = data.message;
              //limpiar campos
              this.inputNombres=""
              this.inputApellidos=""
              this.inputCorreo=""
              this.inputClave=""
              this.inputTipoUsuario=1
              this.inputActivo=true
              //this.fetchUsers();
              this.showModalCreateEdit = false;
              this.$buefy.dialog.alert("Usuario editado correctamente");
              //llamar fetch
              this.fetchUsuarios();
            });
        }
      },
      editFunction(row) {
        //obtener valores para editar en form
          
        this.idSeleccionado = row.id;
        this.inputNombres=row.nombres
        this.inputApellidos=row.apellidos
        this.inputCorreo=row.correo
        this.inputClave=row.clave
        this.inputTipoUsuario=row.tipo
        this.inputActivo=row.activo
  
        //mostrar modal
        this.showModalCreateEdit = true;
        this.isAdd = false;
        this.isEdit = true;
      },
      deleteFunction(row) {
        const idDel = row.id;
        fetch(process.env.VUE_APP_API+"Usuarios/" + idDel.toString(), {
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
            this.$buefy.dialog.alert("Usuario eliminado correctamente");
            //llamar fetch
            this.fetchUsuarios();
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