import React,{useState,useEffect} from 'react'
import {Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {       // options is attribute of line chart
    Lengend :{
        display:false,  
    },
    elements:{
        points:{
            radius:0,
        },
    },
    maintainAspectRatio: false,
    tooltip: {
        mode: 'index',
        intersect: false,
       callbacks:{
           label: function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0");
           },
       },
    },
    scales: {
        xAxes: [
            {
                type :'time',
                time:{
                    format : 'MM/DD/YY',
                    tooltipFormat:'ll',
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    // include a dollar sign in ticks
                    callback: function(value,index,values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}
function Graph({casesType ='cases'}) {  // if prop not passed then default value is cases
    const [data,setData] = useState({});
    
    const buildChartData = (data,casesType='cases') =>{
        let chartData = [];
        let lastDataPoint;
        for(let date in data.cases){ 
            if(lastDataPoint){
                let newDataPoint ={
                    x : date,
                    y :data[casesType][date]-lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    };

    useEffect(()=>{
        const fetchData = async ()=>{
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(response =>response.json())
        .then(data=>{
            let chartData = buildChartData(data,'cases');
            console.log(chartData);
            setData(chartData);
        });
        };
        fetchData(); 
    },[casesType]);
    return (
        <div>
            <h1>graph here</h1>
            {data?.length >0 &&(
                <Line 
                options={options}
                data = {{ 
                datasets:[
                    { 
                        backgroundColor:'rgba(204,16,52,0.5)',
                        borderColor:'#CC1034',
                        data : data
                    }
                ],
            }}
            />
            )}
            
        </div>
    )
}

export default Graph
