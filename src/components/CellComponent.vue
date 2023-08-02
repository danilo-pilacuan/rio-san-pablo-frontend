<template>
    <input v-if="rutaCalendarioModel" v-on:blur="handleBlur" v-on:keyup="handleKeyup" type="text" v-model="rutaCalendarioModel.valor" size="2">
</template>

<script>
export default{
    data(){
        return{
            rutaCalendarioModel:{
                id: 0,
                dia: 0,
                valor: 0
            }
        }
    },
    props:{
        rutaCalendario:{
            required:true
        }
    },
    mounted(){
        this.rutaCalendarioModel={...this.rutaCalendario}
    },
    methods:{
        handleBlur(){
            if(!this.rutaCalendarioModel.valor)
            {
                console.log("elseeeeee")
                console.log(this.rutaCalendario)
                console.log(this.rutaCalendario.valor)
                this.rutaCalendarioModel.valor=this.rutaCalendario.valor
                //this.actualizarValor()
            }
        },
        handleKeyup(){
            if(this.rutaCalendarioModel.valor)
            {
               this.actualizarValor()
            }
            
        },
        actualizarValor(){
            fetch(
          process.env.VUE_APP_API+"calendarioRutas/"+this.rutaCalendarioModel.id,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(this.rutaCalendarioModel),
            }
            )
            .then((response) => response.json())
            .then((data) => {
                var resp = data;
                this.rutaCalendarioModel.valor=data.valor
            });
        }
    }
}
</script>

<style>

</style>