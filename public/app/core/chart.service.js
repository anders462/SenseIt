(function(){

'use strict'


//factory that handles Highcharts, part of core module
angular
  .module('SenseIt.core')
  .factory("chartFactory", chartFactory)

  chartFactory.$inject = ['sensorFactory'];

function chartFactory(sensorFactory){

var chart1;
var MAX_SAMPLE_TIME = 1 //30*60*1000; //throttle to 30 min max sample time, due to Mobile limitations
var cachedSerie = {};

  //configuration function
var chartValues = function(series, chartTitle,yAxisData){

//create new Chart instance
chart1 = new Highcharts.Chart({
            chart: {
                zoomType: 'x',
                renderTo: 'chart-container'
            },
            title: {
                text: chartTitle
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: yAxisData
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: series
        });

};

//update chart
//this is a somewhat complicated function that need to
//be refactored in later versions
//sensorId is the id of the sensor beeing chart and sampleType
//is the type of value to chart, for ex temperature
//cachedSerie = {}, cashedSeries = [cachedSerie1, cachedSerie2...]
var updateChart = function(sensorId,sampleType) {
  console.log("updateChart",sensorId,sampleType)
  //find sensor with sensorId
  var sensor = sensorFactory.getCachedSensorId(sensorId);
  console.log(cachedSerie);
  if (cachedSerie.sensorName != sensor[0].sensorName || cachedSerie.series[0].name != sampleType) {
      console.log("no cache");
  var chartTitle = "Historical data for sensor " + sensor[0].sensorName
  var yAxisData = sampleType + " sample value";
  var series = [];
  var data = [];
  var point;
  //format samples to the correct format for HighCharts
  // data = [[timestamp1,sampleValue1],[timestamp2,sampleValue2]....]
  //Note: Implement this on server side instead
  var oldSampleTime = sensor[0].data[0].time;
  //limit sample rate to MAX_SAMPLE_TIME
  sensor[0].data.forEach(function(obj,index){
    if (obj.time >= (oldSampleTime + MAX_SAMPLE_TIME) ) {
      point = [obj.time,obj.data[sampleType]];
      data.push(point);
      oldSampleTime = obj.time;
    }
  })
  //example series = [{name:'temp',data:[[timestamp1,sampleValue1],[timestamp2,sampleValue2]....]}]
  //series could have several object then more then one graph woulb be shown
  //Note: Implement the graphing using open source D3 instead, due to licsense on HighCharts
  var sample = {name:sampleType,data:data};
  series.push(sample);
  cachedSerie = {
    series:series,
    sensorName:sensor[0].sensorName,
    chartTitle: chartTitle,
    yAxisData: yAxisData
  }
} else {
  console.log("use cache");
}
  //chart the values using HighCharts
  chartValues(cachedSerie.series,cachedSerie.chartTitle, cachedSerie.yAxisData);
};


//returns methods to be used elsewhere
   return {
     chartValues: chartValues,
     updateChart: updateChart
   }


  }




})()
