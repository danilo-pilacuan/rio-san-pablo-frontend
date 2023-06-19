<template>
  <div>
    <line-chart v-if="dataCostos" :chart-data="dataCostos"></line-chart>
    
  </div>
</template>

<script>
  import LineChart from './Charts/LineChart.js'

  export default {
    components: {
      LineChart
    },
    data () {
      return {
        datacollection: null,
        dataCostos:null,
        defaultColor: {
          primary: '#00D1B2',
          info: '#209CEE',
          danger: '#FF3860'
        },
        tablaDatos:null,
      }
    },
    mounted () {
      this.fillData()
      this.getCostosData();
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: [5, 6],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [1, 2]
            }, 
          ]
        }
      },
      fillDataCostos(){
        
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      },
      getCostosData(){
        try {
        fetch(process.env.VUE_APP_TITLE+"API/ordentrabajo", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            var resp = data;

            if (data) {


              this.tablaDatos = data["resultado"];       
              // console.log("HEEEERREEE")
              // console.log(this.tablaDatos)
              
              this.tablaDatos.forEach(element => {
                  var auxCostoTareas=0;
                  var auxCostoMateriales=0;
                  element.Tareas.forEach(tarea => {
                      auxCostoTareas=auxCostoTareas+(tarea.Orden_Tarea.numeroResponsables*tarea.Orden_Tarea.horasHombre*parseFloat(tarea.Orden_Tarea.costoHora))
                  });
                  element.Materials.forEach(material => {
                      auxCostoMateriales=auxCostoMateriales+(parseFloat(material.Orden_Material.cantidad)*parseFloat(material.precioUnitario))
                  });
                  element.costoTareas=auxCostoTareas.toFixed(2);
                  element.costoMateriales=auxCostoMateriales.toFixed(2);
              });


              var auxTablaDatos = this.tablaDatos.map(e=> { 
                    e.fechaOrden=new Date(Date.parse(e.fechaOrden)).toLocaleDateString()
                    console.log(e.fechaSolicitud)
                    return e;
                  });
             


              var groupBy = function(xs, key) {
                return xs.reduce(function(rv, x) {
                  (rv[x[key]] = rv[x[key]] || []).push(x);
                  return rv;
                }, {});
              };

              this.tablaDatos=groupBy(this.tablaDatos, 'fechaOrden')

              // console.log('Datosss Fechaaa');
              // console.log(this.tablaDatos);
              
              var sortable=[]
              for (var fecha in this.tablaDatos)
              {
                sortable.push([fecha,this.tablaDatos[fecha]])
              }

              sortable.forEach(element => {
                var parts = element[0].split("/");
                var dt = new Date(parseInt(parts[2], 10),
                  parseInt(parts[1], 10) - 1,
                  parseInt(parts[0], 10));
                element[0]=dt;
              });
              
              sortable.sort((a, b) => (Date.parse(a[0]) < Date.parse(b[0])) ? 1 : -1)

              sortable.forEach(element => {
                
                let day = element[0].getDate()
                let month = element[0].getMonth() + 1
                let year = element[0].getFullYear()
                element[0]=day.toString()+"/"+month.toString()+"/"+year.toString()
              });


              // console.log("SortableSoooort")
              // console.log(sortable)

              let arraySumaTotal=[]
              let arraySumaTareas=[]
              let arraySumaMateriales=[]
              
              

              sortable.forEach(element => {
                var sumTotal=0;
                var sumMateriales=0;
                var sumTareas=0;

                element[1].forEach(element2=>{
                  sumTotal=sumTotal+parseFloat(element2.costoTareas)+parseFloat(element2.costoMateriales);
                  sumMateriales=sumMateriales+parseFloat(element2.costoMateriales);
                  sumTareas=sumTareas+parseFloat(element2.costoTareas);
                });
                arraySumaTotal.push({"label":element[0],"valor":sumTotal.toFixed(2)})
                arraySumaTareas.push({"label":element[0],"valor":sumTareas.toFixed(2)})
                arraySumaMateriales.push({"label":element[0],"valor":sumMateriales.toFixed(2)})
              });
              
              // console.log('Array Suma total');
              // console.log(arraySumaTotal);
              // console.log('Array Suma Tareas');
              // console.log(arraySumaTareas);
              // console.log('Array Suma Materiales');
              // console.log(arraySumaMateriales);

              arraySumaTotal.sort((a, b) => (Date.parse(a.label) > Date.parse(b.label)) ? 1 : -1)
              arraySumaTareas.sort((a, b) => (Date.parse(a.label) > Date.parse(b.label)) ? 1 : -1)
              arraySumaMateriales.sort((a, b) => (Date.parse(a.label) > Date.parse(b.label)) ? 1 : -1)


              var dataLabels1=arraySumaTotal.map(a=>a.label)
              var dataValues1=arraySumaTotal.map(a=>a.valor)
              var dataValues2=arraySumaTareas.map(a=>a.valor)
              var dataValues3=arraySumaMateriales.map(a=>a.valor)

              

            
                  this.dataCostos = {
                    labels: dataLabels1,
                    datasets: [
                      {
                        label: 'Costos Totales',
                        data: dataValues1,
                        fill: false,
                        borderColor: this.defaultColor['primary'],
                        borderWidth: 2,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        pointBackgroundColor: this.defaultColor['primary'],
                        pointBorderColor: 'rgba(255,255,255,0)',
                        pointHoverBackgroundColor: this.defaultColor['primary'],
                        pointBorderWidth: 20,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 15,
                        pointRadius: 4,
                        tension: 0.5,
                        cubicInterpolationMode: 'default'

                      }, 
                      {
                        label: 'Costos Tareas',
                        data: dataValues2,
                        fill: false,
                        borderColor: this.defaultColor['info'],
                        borderWidth: 2,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        pointBackgroundColor: this.defaultColor['info'],
                        pointBorderColor: 'rgba(255,255,255,0)',
                        pointHoverBackgroundColor: this.defaultColor['info'],
                        pointBorderWidth: 20,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 15,
                        pointRadius: 4,
                        tension: 0.5,
                        cubicInterpolationMode: 'default'

                      }, 
                      {
                        label: 'Costos Materiales',
                        data: dataValues3,
                        fill: false,
                        borderColor: this.defaultColor['danger'],
                        borderWidth: 2,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        pointBackgroundColor: this.defaultColor['danger'],
                        pointBorderColor: 'rgba(255,255,255,0)',
                        pointHoverBackgroundColor: this.defaultColor['danger'],
                        pointBorderWidth: 20,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 15,
                        pointRadius: 4,
                        tension: 0.5,
                        cubicInterpolationMode: 'default'

                      }, 

                    ]
                    
                  }


              // this.tablaDatos = data["resultado"];







              // console.log(this.tablaDatos)
              // this.tablaDatos.forEach(element => {
              //     var auxCostoTareas=0;
              //     var auxCostoMateriales=0;
              //     element.Tareas.forEach(tarea => {
              //         auxCostoTareas=auxCostoTareas+(tarea.numeroResponsables*tarea.horasHombre*parseFloat(tarea.costoHora))
              //     });
              //     element.Materials.forEach(material => {
              //         auxCostoMateriales=auxCostoMateriales+(parseFloat(material.cantidad)*parseFloat(material.precioUnitario))
              //     });
              //     element.costoTareas=auxCostoTareas.toFixed(2);
              //     element.costoMateriales=auxCostoMateriales.toFixed(2);

                  

              // });

              // var labelsCostos=[];
              //     var costosData=[]
              //     this.tablaDatos.forEach(element => {
              //         labelsCostos.push((new Date(Date.parse(element["createdAt"]))).toLocaleDateString())
              //         costosData.push(parseFloat(element.costoTareas)+parseFloat(element.costoMateriales))
              //     });
              //     this.dataCostos = {
              //       labels: labelsCostos,
              //       datasets: [
              //         {
              //           label: 'Costos',
              //           data: costosData,
              //           fill: false,
              //           borderColor: this.defaultColor['primary'],
              //           borderWidth: 2,
              //           borderDash: [],
              //           borderDashOffset: 0.0,
              //           pointBackgroundColor: this.defaultColor['primary'],
              //           pointBorderColor: 'rgba(255,255,255,0)',
              //           pointHoverBackgroundColor: this.defaultColor['primary'],
              //           pointBorderWidth: 20,
              //           pointHoverRadius: 4,
              //           pointHoverBorderWidth: 15,
              //           pointRadius: 4,
              //           tension: 0.5,
              //           cubicInterpolationMode: 'default'

              //         }, 
              //       ]
                    
              //     }
              
              //console.log(this.tablaDatos)
            } else {
              //this.$router.push("/login")
              this.tablaDatos = [];
            }
          });
      } catch (e) {
        //this.$store.dispatch("setAuth", false);
      }
      }
    }
  }
</script>

<style>
  .small {
    max-width: 600px;
    margin:  150px auto;
  }
</style>