import { LightningElement,wire,track} from 'lwc';
//importing the Chart library from Static resources
import chartjs from '@salesforce/resourceUrl/ChartJs'; 
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//importing the apex method.
import getAllcaserecord from '@salesforce/apex/AccountController.getAllcaserecord';
export default class FourthLwc extends LightningElement {
   @track selectedOption = 'bar';
   @track chartlabel;
   @track chartdata;

  
changeHandler(event) {
const field = event.target.name;
//updateRecord({chartConfiguration:this.chartConfiguration})
    if (field === 'optionSelect')
        {
        this.selectedOption = event.target.value;
        console.log(' this.selectedOption:',  this.selectedOption); 
    
      const ctx = this.template.querySelector('canvas.donut').getContext('2d');
     
      this.chart.destroy();
      this.chart = new window.Chart(ctx, 
         {
            type: this.selectedOption,
            data: {
        labels: this.chartlabel,
        datasets: [{
            label: 'Case Chart',
            data: this.chartdata,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            animation:{
                animateScale: true,
                animateRotate : true
             }
        }]
    }
          });
    }
}


    @wire (getAllcaserecord) accounts({error,data})
{
   if(data)
   {
    console.log('ravidatamain data',data);
     /*  data =[{"label":"Closed",
       "count": 2220.0,
       },
       {"label":"Escalated",
       "count": 220.0
       },
       {"label":"InProgress",
       "count": 2220.0
       },
       {"label":"New",
       "count": 1220.0},
       {"label":"On Hold",
       "count": 99990.0}
       ];*/
       console.log('ravidata',data);
       var labels = [];
       var datavalue= [];
      for(var key in data)
       {
        labels.push(data[key].label);
        datavalue.push(data[key].count);
          this.updateChart(data[key].count,data[key].label);
       }
       console.log('sssssssssssssssssss',labels);
       console.log('sssssssssssssssssss',datavalue);
       this.chartdata= datavalue;
  this.chartlabel =  labels;

      this.error=undefined;
   }
  else if(error)
  {
     this.error = error;
     this.accounts = undefined;
  }
}

chart;
chartjsInitialized = false;
config={
type : this.selectedOption,
data :{
datasets :[
{
data: [
],
backgroundColor :[
    'rgb(255,99,132)',
    'rgb(255,159,64)',
    'rgb(255,205,86)',
    'rgb(75,192,192)',
],
   label:'Dataset 1'
}
],
labels:[]
},
options: {
    responsive : true,
legend : {
    position :'right'
},
animation:{
   animateScale: true,
   animateRotate : true
}
}
};


renderedCallback()
{
   if(this.chartjsInitialized)
  {
   return;
  }
  this.chartjsInitialized = true;
  Promise.all([
   loadScript(this,chartjs)
  ]).then(() =>{
    const ctx = this.template.querySelector('canvas.donut')
    .getContext('2d');
    this.chart = new window.Chart(ctx, this.config);
  })
  .catch(error =>{
    this.dispatchEvent(
    new ShowToastEvent({
    title : 'Error loading ChartJS',
    message : error.message,
    variant : 'error',
   }),
  );
});
}
updateChart(count,label)
{

   this.chart.data.labels.push(label);
   this.chart.data.datasets.forEach((dataset) => {
   dataset.data.push(count);
   });
   this.chart.update();
 }
}