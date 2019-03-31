import React, { Component } from "react";
import NodeGroup from "react-move/NodeGroup";
import { getInitialData } from "../helpers";
import "../barchart.css";

let barHeight = 50;
let barPadding = 2;
let barColour = "#348AA7";
let widthScale = d => d * 5;

function BarGroup(props) {
    let width = widthScale(props.state.value);
    let yMid = barHeight * 0.5;

    console.log(props)

    return (
        <g className="bar-group" transform={`translate(0, ${props.state.x})`}>
            <rect
                y={barPadding * 0.5}
                width={width}
                height={barHeight - barPadding}
                style={{ fill: barColour, opacity: props.state.opacity }}
            />
            <text
                className="value-label"
                x={width - 6}
                y={yMid}
                alignmentBaseline="middle"
            >
                {props.state.value.toFixed(0)}
            </text>
            <text
                className="name-label"
                x="-6"
                y={yMid}
                alignmentBaseline="middle"
                style={{ opacity: props.state.opacity }}
            >
                {props.data.name}
            </text>
        </g>
    );
}

class MoveChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: getInitialData()
        };

        console.log(this.state.data);

        // this.handleAdd = this.handleAdd.bind(this);
        // this.handleRemove = this.handleRemove.bind(this);
        // this.handleUpdate = this.handleUpdate.bind(this);
    }

    // componentDidMount() {
    //     let labels = [];
    //     let values = [];
    //     fetch('https://api.spotify.com/v1/audio-features/06AKEBrKUckW0KREUWRnvT', {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': "Bearer BQCGlMBMWIjjaF_nP7fUU3L45nX_S-T4TkNgWWSTK5UpKh9tXA7evJHDr8KU9j25dLlMknyg4MZJ9DWzrOPvwscwaUah3YcxN7VtfSe5bQcoa8O0c96xW5SpLo9K97_0ZNxqWAXexl5mjqwD4jsEJozlMSb0r0JrqA"
    //         }
    //     }).then(res => {
    //         res.json().then(data => {
    //             for (var feature in data) {
    //                 if (data.hasOwnProperty(feature) && feature !== 'key' && feature !== 'mode') {
    //                     if (data[feature] <= 1 && data[feature] >= 0) {
    //                         labels.push(feature);
    //                         values.push(data[feature]);
    //                     }
    //                 }
    //             }
    //         });
    //     })
    // }

    // handleAdd() {
    //     this.setState({
    //         data: getAppendedData(this.state.data)
    //     });
    // }

    // handleRemove() {
    //     this.setState({
    //         data: getTruncatedData(this.state.data)
    //     });
    // }

    // handleUpdate() {
    //     this.setState({
    //         data: getUpdatedData(this.state.data)
    //     });
    // }

    startTransition(d, i) {
        return { value: 0, x: i * barHeight, opacity: 0 };
    }

    enterTransition(d) {
        return { value: [d.value], opacity: [1], timing: { duration: 250 } };
    }

    updateTransition(d, i) {
        return { value: [d.value], x: [i * barHeight], timing: { duration: 300 } };
    }

    leaveTransition(d) {
        return { x: [-barHeight], opacity: [0], timing: { duration: 250 } };
    }

    render() {
        return (
            <div>
                <div id="menu">
                    {/* <button onClick={this.handleAdd}>Add item</button> */}
                    {/* <button onClick={this.handleRemove}>Remove item</button> */}
                    {/* <button onClick={this.handleUpdate}>Update values</button> */}
                </div>
                <svg width="800" height="2200">
                    <g className="chart" transform="translate(100,10)">
                        <NodeGroup
                            data={this.state.data}
                            keyAccessor={d => d.name}
                            start={this.startTransition}
                            enter={this.enterTransition}
                            update={this.updateTransition}
                            leave={this.leaveTransition}
                        >
                            {nodes => (
                                <g>
                                    {nodes.map(({ key, data, state }) => (
                                        <BarGroup key={key} data={data} state={state} />
                                    ))}
                                </g>
                            )}
                        </NodeGroup>
                    </g>
                </svg>
            </div>
        );
    }
}

export default MoveChart;
