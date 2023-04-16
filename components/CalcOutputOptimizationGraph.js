import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer
} from "recharts";

import { CalcsProperty } from "./types/CalcsProperty.js";
import { StateProperty } from "./types/StateProperty.js";

const colors = ["#9EFF74", "#74C7FF", "#FF8274", "#EEEEEE", "#D574FF", "#FFAC74", "#74F1FF"];

export class CalcOutputOptimizationGraph extends Component {
	static propTypes = {
		calcsList: PropTypes.arrayOf(CalcsProperty),
		state: StateProperty
	};

	constructor (props) {
		super(props);
		if (typeof window !== "undefined") {
			this.optWorker = new Worker(new URL("../src/general.worker.js", import.meta.url));
		}

		this.state = {
			data: [],
			id: null,
			continuous: true
		};

		this.handleWorker = this.handleWorker.bind(this);
		this.generateId = this.generateId.bind(this);
		this.toggleContinuous = this.toggleContinuous.bind(this);
	}

	toggleContinuous () {
		this.setState({ continuous: !this.state.continuous });
		console.log(this.state);
	}

	generateId () {
		return JSON.stringify({
			calcsList: this.props.calcsList,
			state: this.props.state
		});
	}

	handleWorker () {
		if (typeof window === "undefined") {
			return;
		}

		this.optWorker.terminate();
		this.optWorker = new Worker(new URL("../src/general.worker.js", import.meta.url));
		this.optWorker.onmessage = function () {};

		this.optWorker.addEventListener("message", (event) => {
			if (event.data.graphData) {
				this.setState({
					data: event.data.graphData,
					id: this.generateId()
				});
			}
		});

		this.optWorker.postMessage({
			state: this.props.state,
			calcsList: this.props.calcsList,
			type: "Optimization"
		});
	}

	render () {
		// const worker = new Worker(new URL("../src/general.worker.js", import.meta.url));
		if (this.state.id !== this.generateId()) {
			this.handleWorker();
		}
		const lines = this.props.calcsList.map((calcs, i) => (
			<Line
				key={i}
				type="monotone"
				dot={false}
				dataKey={`Set ${i + 1}`}
				stroke={colors[i % 4]}
				strokeWidth={3}
			/>
		));

		return (
			<div>
				<h3
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					}}
				>
					Optimal Switching @ {this.props.state.monster.name} (
					{this.state.continuous ? "Continuous" : "Discontinuous"})
					<span
						style={{ display: "inline-flex" }}
						data-tooltip-left="Continuous attacking assumes the player immediately switches to a new monster after killing the current one"
					>
						<label
							className="sub-text"
							htmlFor="continuousToggle"
							style={{
								marginRight: "0.5em",
								display: "inline-block"
							}}
						>
							Continuous
						</label>
						<label className="toggle-control" htmlFor="continuousToggle">
							<input
								type="checkbox"
								id="continuousToggle"
								checked={this.state.continuous}
								onClick={this.toggleContinuous}
							/>
							<span className="control"></span>
						</label>
					</span>
				</h3>
				<div className="highlight-section flex-container-vertical">
					<div style={{ position: "relative" }}>
						<ResponsiveContainer width="100%" height={200}>
							<LineChart
								data={this.state.data[this.state.continuous ? 1 : 0]}
								margin={{
									top: 0,
									right: 30,
									left: 20,
									bottom: 20
								}}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#666"
								/>
								<XAxis
									dataKey="hitpoint"
									name="Hitpoints"
									stroke="#ddd"
								>
									<Label
										value="Hitpoints"
										offset={0}
										position="insideBottom"
										margin={5}
										dy={10}
										fill="#eeeeee"
										style={{ fontFamily: "Roboto Slab" }}
									/>
								</XAxis>
								<YAxis stroke="#ddd" type="number">
									<Label
										value="TtK"
										offset={0}
										position="insideLeft"
										angle="-90"
										margin={5}
										dy={10}
										fill="#eeeeee"
										style={{ fontFamily: "Roboto Slab" }}
									/>
								</YAxis>
								<Tooltip className="highlight-section"/>
								<Legend verticalAlign="top"/>
								{lines}
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		);
		// <Label value="Pages of my website" offset={0} position="insideBottom" />
	}
}
