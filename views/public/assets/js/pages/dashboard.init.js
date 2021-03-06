var options={
    chart:{height:359,type:"bar",stacked:!0,toolbar:{show:!1},zoom:{enabled:!0}},
    plotOptions:{bar:{horizontal:!1,columnWidth:"15%",endingShape:"rounded"}},
    dataLabels:{enabled:!1},
    series:[{name:"Newly Awarded",data:[44,55,41,67,22,43,44,55,41,67,22,43,36,52,24,18,36,48,40,50,20,20,20,20,20,20,20,20,10,10,10,10,20,10]},
    {name:"Ongoing",data:[13,23,20,8,13,27,18,44,55,41,67,22,43,22,10,16,24,22,26,20,20,20,10,20,20,20,20,10,10,30,10,10,20,10]},
{name:"Completed",data:[11,17,15,15,21,14,11,18,44,55,41,67,22,43,17,12,20,18,29, 20,10,20,20,20,20,20,20,10,10,20,10,10,20,10]}],
xaxis:{categories:["Abia","Adamawa","Akwa","Anambra","Bauchi","Bayelsa","Benue","Borno","CrossRiver",
"Delta","Edo","Enugu","Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara","Lagos","Nasarawa","Niger",
"Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba","Yobe","Zamfara"]},
colors:["#299a4a","#f1b44c","#34c38f"],
legend:{position:"bottom"},fill:{opacity:1}};
(chart=new ApexCharts(document.querySelector("#stacked-column-chart"),options)).render();
var chart;
options={chart:{height:200,type:"radialBar",offsetY:-10},
plotOptions:{radialBar:{startAngle:-135,endAngle:135,
dataLabels:{name:{fontSize:"13px",color:void 0,offsetY:60},
value:{offsetY:22,fontSize:"16px",color:void 0,formatter:function(e){return e+"%"}}}}},
colors:["#299a4a"],fill:{type:"gradient",
gradient:{shade:"dark",shadeIntensity:.15,inverseColors:!1,opacityFrom:1,opacityTo:1,stops:[0,50,65,91]}},
stroke:{dashArray:4},series:[67],labels:["Series A"]};
(chart=new ApexCharts(document.querySelector("#radialBar-chart"),options)).render();