<template>
    <div id="users" class="home">
        <hero-bar>
            Reportes Diarios
            <b-button slot="right" type="is-primary" @click="createFunction">Crear</b-button>
        </hero-bar>
        <div class="container ml-1 mr-1" style="max-width: 100%">
            <div class="block">

                <b-table :data="tablaDatos" :bordered="true" :striped="true" :narrowed="false" :hoverable="false"
                    :loading="false" :focusable="true" :mobile-cards="false" :searchable="true" :paginated="true"
                    :per-page="20">
                    <template v-for="column in columns">
                        <b-table-column :key="column.id" v-bind="column">
                            <!-- <template v-if="column.searchable && !column.numeric" #searchable="props">
                                <b-input v-model="props.filters[props.column.field]" placeholder="Buscar..." icon="magnify"
                                    size="is-small" />
                            </template> -->
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
                            <!-- <b-button rounded type="is-warning" icon-left="pencil" @click="editFunction(props.row)"
                                :disabled="tipoUsuario == 2"/> -->
                            <b-button rounded type="is-link" icon-left="eye" label="Tarjetas"
                                @click="$router.push('/tarjetas/' + props.row.id)" :disabled="tipoUsuario == 2" />
                            <b-button rounded type="is-primary" icon-left="eye" label="Aportes"
                                @click="$router.push('/aportes/' + props.row.id)" :disabled="tipoUsuario == 2" />
                            <b-button rounded type="is-danger" icon-left="delete" label="Borrar"
                                @click="deleteFunction(props.row)" :disabled="tipoUsuario == 2" />
                        </div>
                    </b-table-column>
                </b-table>
            </div>
        </div>

        <b-modal v-model="showModalCreateEdit">
            <form @submit.prevent="submit" v-if="reporte">
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
                                    <b-field label="Fecha">
                                        <b-datepicker v-model="reporte.fecha" inline>
                                        </b-datepicker>
                                    </b-field>
                                </div>
                                <div class="column">
                                    <b-field label="Presidente">
                                        <b-input v-model="reporte.presidente"></b-input>
                                    </b-field>
                                    <b-field label="Gerente">
                                        <b-input v-model="reporte.gerente"></b-input>
                                    </b-field>
                                    <b-field label="Vigilancia">
                                        <b-input v-model="reporte.vigilancia"></b-input>
                                    </b-field>
                                    <b-field label="Recaudadora">
                                        <b-input v-model="reporte.recaudadora"></b-input>
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

            reporte: null,

            //info entidad
            nombreEntidad: "Reporte",
            baseUri: process.env.VUE_APP_API + "reportes",
            //tablas Datos
            tablaDatos: [],
            //columnas tabla Datos
            columns: [
                {
                    field: "fecha",
                    label: "Fecha",
                },
                {
                    field: "ingresosAdministrativos",
                    label: "Ingresos Administrativos",
                },
                {
                    field: "ingresosOtros",
                    label: "Ingresos Otros",
                },
                {
                    field: "ingresosTotales",
                    label: "Ingresos Totales",
                },
                {
                    field: "presidente",
                    label: "Presidente",
                },
                {
                    field: "gerente",
                    label: "Gerente",
                },
                {
                    field: "vigilancia",
                    label: "Vigilancia",
                },
                {
                    field: "recaudadora",
                    label: "Recaudadora",
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
    },
    methods: {
        resetForm() {
            this.reporte = {
                id: 0,
                ingresosAdministrativos: 0,
                ingresosOtros: 0,
                ingresosAdicionales: 0,
                ingresosTotales: 0,
                fecha: new Date(),
                presidente: "",
                gerente: "",
                vigilancia: "",
                recaudadora: "",
            }
            this.isAdd = false;
            this.isEdit = false;
            this.showModalCreateEdit = false;
            this.fetchReportes();
        },
        fetchReportes() {
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
                    body: JSON.stringify(this.reporte),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        var resp = data.message;
                        console.log(resp);

                        //cerrar modal

                        this.$buefy.dialog.alert("Reporte agregado correctamente");

                        this.resetForm();

                    });
            } else if (this.isEdit) {
                fetch(
                    this.baseUri + "/" + this.reporte.id,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(this.reporte),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        var resp = data.message;
                        console.log(resp)
                        //limpiar campos

                        //this.fetchUsers();

                        this.$buefy.dialog.alert("Reporte editado correctamente");
                        //llamar fetch
                        this.showModalCreateEdit = false;

                    });
            }
        },
        editFunction(row) {
            //obtener valores para editar en form

            //mostrar modal
            this.showModalCreateEdit = true;
            this.isAdd = false;
            this.isEdit = true;
        },
        deleteFunction(row) {
            const idDel = row.id;
            fetch(process.env.VUE_APP_API + "Reportes/" + idDel.toString(), {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => {
                    var resp = data.message;
                    //limpiar campos form

                    this.$buefy.dialog.alert("Reporte eliminado correctamente");
                    //llamar fetch
                    this.resetForm();
                });
        },
    },
};
</script>

<style></style>