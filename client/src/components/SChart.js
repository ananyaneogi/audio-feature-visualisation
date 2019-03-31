import React, { Component } from 'react'
import Chart from 'chart.js';

export default class MusicChart extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    createNewChart(myChartRef) {
        new Chart(myChartRef, {
            type: 'bar',
            data: {
                labels: this.props.labels,
                datasets: [{
                    data: this.props.values,
                    backgroundColor: [
                        'rgba(30,215,96, 0.5)',
                        'rgba(245,115,160, 0.5)',
                        'rgba(80,155,245, 0.5)',
                        'rgba(255,100,55, 0.5)',
                        'rgba(180,155,200, 0.5)',
                        'rgba(250,230,45, 0.5)',
                        'rgba(0,100,80, 0.5)',
                        'rgba(175,40,150, 0.5)',
                        'rgba(30,50,100, 0.5)'
                    ],
                    borderColor: [
                        'rgba(30,215,96, 1)',
                        'rgba(245,115,160, 1)',
                        'rgba(80,155,245, 1)',
                        'rgba(255,100,55, 1)',
                        'rgba(180,155,200, 1)',
                        'rgba(250,230,45, 1)',
                        'rgba(0,100,80, 1)',
                        'rgba(175,40,150, 1)',
                        'rgba(30,50,100, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 1
                        }
                    }]
                }
            }
        });
    }
  render() {
    return (
        <div>
            <canvas
                id="myChart"
                ref={this.chartRef}
            />
        </div>
    )
  }
}
