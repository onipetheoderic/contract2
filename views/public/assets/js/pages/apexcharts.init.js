function truncator(str, max){

    if(str.length>=max){
       return str.substr(0, max)+"..."
    
    }
    else {
        return str
    }
}
var options;
var names = []
var values = []
var states = []
var currentPercents = []
console.log("from Apex graph", loopedDatas)
let parsedCont = JSON.parse(allCont)
// console.log("from Apex graph222", dataArray.length)
for(var v in parsedCont){
    console.log("eachVals",parsedCont[v])
    states.push(parsedCont[v].state)
    currentPercents.push(parsedCont[v].currentPercentage)
   
}



console.log(states, currentPercents)
// for(i=0; i<5; i++){
//     names.push(loopedDatas[i].component_name);
//     values.push(loopedDatas[i].component_score);
// }

// const firstFive = names.slice(0,5)

// console.log("5", firstFive)




// start

// console.log("this is the apex id", _id,url)
var list = "<ul>";


function checkQueue(){
    console.log("Runinnggg")
   
var xhttp = new XMLHttpRequest();
var dataArray = []

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
      // document.getElementById("demo").innerHTML = xhttp.responseText;
    const parsedDatas = JSON.parse(xhttp.responseText)
    //console.log(parsedData)
  
    var loopedDatas2 = parsedValue.datas
    names.splice(0, names.length);
    values.splice(0, values.length);
    // console.log("lllll",loopedDatas2)
    for(var i in loopedDatas2){
         dataArray.push(loopedDatas2[i])
            console.log(loopedDatas2[i].component_name)
            // console.log(loopedDatas2[i].component_score)
            names.push(loopedDatas2[i].component_name);
            values.push(loopedDatas2[i].component_score);
            list +="<li>"  +loopedDatas2[i].component_name+ " " + "(" +loopedDatas2[i].component_score+ "%)"+ "</li>";
             document.getElementById("datacontainer").innerHTML = list;
              
        }
      

    list +="</ul>";

  
    }
};
xhttp.open("GET", url, true);
xhttp.send();

}
//end
// checkQueue()
setInterval(checkQueue(),2000);
console.log("this are the names and the vals", names, values)
var myHorizonalBarArrays = states

options={chart:
    {height:350,
    type:"bar",
    toolbar:{show:!1}},
plotOptions:{bar:{dataLabels:{position:"top"}}},
dataLabels:{enabled:!0,formatter:function(e){return e+"%"},offsetY:-20,
style:{fontSize:"12px",colors:["#304758"]}},
series:[{name:"Inflation",data:currentPercents}],
colors:["#299a4a"],
grid:{borderColor:"#f1f1f1"},
xaxis:{categories: myHorizonalBarArrays.map((eachVal)=>truncator(eachVal, 3)),
position:"top",
labels:{offsetY:-18},
axisBorder:{show:!1},
axisTicks:{show:!1},
crosshairs:{fill:{type:"gradient",gradient:{colorFrom:"#D8E3F0",colorTo:"#BED1E6",stops:[0,100],
opacityFrom:.4,opacityTo:.5}}},
tooltip:{enabled:!0,offsetY:-35}},
fill:{gradient:{shade:"light",type:"horizontal",shadeIntensity:.25,gradientToColors:void 0,inverseColors:!0,opacityFrom:1,opacityTo:1,stops:[50,0,100,100]}},
yaxis:{axisBorder:{show:!1},axisTicks:{show:!1},labels:{show:!1,formatter:function(e){return e+"%"}}},
title:{text:"Contractors performance Across all States",floating:!0,offsetY:320,align:"center",style:{color:"#444"}}};
(chart=new ApexCharts(document.querySelector("#column_chart_datalabel"),options)).render();






options={chart:{height:350,type:"bar",toolbar:{show:!1}},
plotOptions:{bar:{horizontal:!0}},dataLabels:{enabled:!1},
series:[{data:values}],
colors:["#34c38f"],
grid:{borderColor:"#f1f1f1"},
xaxis:{categories:names}};(chart=new ApexCharts(document.querySelector("#bar_chart"),options)).render();options={chart:{height:350,type:"line",
stacked:!1,toolbar:{show:!1}},stroke:{width:[0,2,4],curve:"smooth"},plotOptions:{bar:{columnWidth:"50%"}},
colors:["#f46a6a","#299a4a","#34c38f"],
series:[{name:"Team A",type:"column",data:[23,11,22,27,13,22,37,21,44,22,30]},
{name:"Team B",type:"area",data:[44,55,41,67,22,43,21,41,56,27,43]},
{name:"Team C",type:"line",data:[30,25,36,30,45,35,64,52,59,36,39]}],
fill:{opacity:[.85,.25,1],
gradient:{inverseColors:!1,shade:"light",type:"vertical",opacityFrom:.85,opacityTo:.55,stops:[0,100,100,100]}},
labels:["01/01/2003","02/01/2003","03/01/2003","04/01/2003","05/01/2003","06/01/2003","07/01/2003","08/01/2003","09/01/2003","10/01/2003","11/01/2003"],
markers:{size:0},legend:{offsetY:-10},xaxis:{type:"datetime"},yaxis:{title:{text:"Points"}},
tooltip:{shared:!0,intersect:!1,y:{formatter:function(e){return void 0!==e?e.toFixed(0)+" points":e}}},
grid:{borderColor:"#f1f1f1"}};
(chart=new ApexCharts(document.querySelector("#mixed_chart"),options)).render();


options={chart:{height:380,type:"radialBar"},
plotOptions:{radialBar:{dataLabels:{name:{fontSize:"22px"},value:{fontSize:"16px"},
total:{show:!0,label:"Total",
formatter:function(e){return 249}}}}},
series:[44,55,67,83],
labels:["Computer","Tablet","Laptop","Mobile"],
colors:["#299a4a","#34c38f","#f46a6a","#f1b44c"]};
(chart=new ApexCharts(document.querySelector("#radial_chart"),options)).render();



options={chart:{height:320,type:"pie"},
series:values,labels:names,
colors:["#34c38f","#299a4a","#f46a6a","#50a5f1","#f1b44c"],
legend:{show:!0,position:"bottom",horizontalAlign:"center",verticalAlign:"middle",floating:!1,fontSize:"14px",offsetX:0,offsetY:-10},
responsive:[{breakpoint:600,options:{chart:{height:240},legend:{show:!1}}}]};
(chart=new ApexCharts(document.querySelector("#pie_chart"),options)).render();


var chart;
options={chart:{height:320,type:"donut"},
series:values,
labels:names,
colors:["#34c38f","#299a4a","#f46a6a","#50a5f1","#f1b44c"],
legend:{show:!0,position:"bottom",horizontalAlign:"center",
verticalAlign:"middle",floating:!1,fontSize:"14px",offsetX:0,offsetY:-10},
responsive:[{breakpoint:600,options:{chart:{height:240},legend:{show:!1}}}]};
(chart=new ApexCharts(document.querySelector("#donut_chart"),options)).render();