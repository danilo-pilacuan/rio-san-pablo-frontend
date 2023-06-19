<template>
  <b-field
    class="file"
  >
    <b-upload
      v-model="file"
      :accept="accept"
      @input="upload"
    >
      <a
        class="button"
        :class="type"
      >
        <b-icon
          icon="upload"
          custom-size="default"
        />
        <span>{{ buttonLabel }}</span>
      </a>
    </b-upload>
    <span
      v-if="file"
      class="file-name"
    >{{ file.name }}
    </span>

    <b-button class="mx-1"
    v-if="file"
                type="is-success"
                size="is-big"
                @click="cargarImagen"
              >
                Cargar
              </b-button>
  </b-field>
</template>

<script>

///////////////////////////////////
export default {
  props: {
    accept: {
      type: String,
      default: "image/*"
    },
    type: {
      type: String,
      default: 'is-primary'
    },
    idActivo:{
      default: 1
    }
  },
  data() {
    return {
      buttonLabel: "Cargar Imagen",
      file: null,
      hasFile:false
    }
  },
  methods: {
    cargarImagen() {

      let formData = new FormData()
      formData.append('image', this.file.value)
      formData.append('idActivo',this.idActivo)

     ///////////////////////////////////

    fetch(process.env.VUE_APP_TITLE+"API/imagenes", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data.resultado;
            this.file = null
            console.log(resp);  
            this.buttonLabel= "Cargar Imagen" 
            //emit('upload', value);
            this.$emit('upload')
          });

    },
    upload(e){
      this.file.value = e
      console.log(this.file)
      this.hasFile = true
      this.buttonLabel=this.file.value ? 'Escoger otra Imagen' : 'Cargar Imagen'

    }
  }
}
///////////////////////////////////





</script>
