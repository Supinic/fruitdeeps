import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer, ReferenceLine
} from "recharts";

import { CalcsProperty } from "./types/CalcsProperty.js";
import { StateProperty } from "./types/StateProperty.js";
import { DpsDefence } from "../lib/dps/overhit/DpsDefence.js";

const colors = ["#9EFF74", "#74C7FF", "#FF8274", "#EEEEEE", "#D574FF", "#FFAC74", "#74F1FF"];

export class DpsOverDefenceGraph extends Component {
	static propTypes = {
		calcsList: PropTypes.arrayOf(CalcsProperty),
		state: StateProperty
	};

	constructor (props) {
		super(props);

		this.state = {
			data: [],
			id: null,
			expand: false
		};

		this.calculate = this.calculate.bind(this);
		this.generateId = this.generateId.bind(this);
		this.toggleExpand = this.toggleExpand.bind(this);
	}

	generateId () {
		return JSON.stringify({
			calcsList: this.props.calcsList,
			state: this.props.state
		});
	}

	toggleExpand () {
		this.setState({ expand: !this.state.expand });
	}

	calculate () {
		if (typeof window === "undefined") {
			return;
		}

		const def = new DpsDefence(this.props.state, this.props.calcsList);
		this.setState({
			data: def.output().graphData,
			id: this.generateId()
		});
	}

	render () {
		if (this.state.id !== this.generateId()) {
			this.calculate();
		}

		const lines = this.props.calcsList.map((calcs, i) => (
			<Line
				key={i}
				isAnimationActive={false}
				type="monotone"
				dot={false}
				dataKey={`Set ${i + 1}`}
				stroke={colors[i % 4]}
				strokeWidth={3}
			/>
		));

		const dwhLines = [];
		const def = this.props.state.monster.stats.def;
		let dwhDef = def;
		for (let i = 0; i < 5; i++) {
			if (Math.trunc((dwhDef * 3) / 10) > 0) {
				dwhDef = dwhDef - Math.trunc((dwhDef * 3) / 10);
				dwhLines.push(
					<ReferenceLine
						key={i}
						x={dwhDef}
						stroke="#ff8274"
						style={{ strokeDasharray: "15,10" }}
					>
						<Label
							value={`${i + 1} dwh`}
							angle="-90"
							dx={-14}
							dy={18}
							position="insideTop"
							fill="#eeeeee"
							style={{
								fontFamily: "Roboto Slab",
								fontSize: "0.75em"
							}}
						/>
					</ReferenceLine>
				);
			}
		}

		dwhLines.push(
			<ReferenceLine
				key="last"
				x={Math.max(def - Math.floor(def / 10) - 1, 0)}
				stroke="#eeeeee"
				style={{ strokeDasharray: "15,10" }}
			>
				<Label
					value="vuln"
					angle="-90"
					dx={-14}
					dy={18}
					position="insideTop"
					fill="#eeeeee"
					style={{
						fontFamily: "Roboto Slab",
						fontSize: "0.75em"
					}}
				/>
			</ReferenceLine>
		);

		return (
			<div>
				<h3
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					}}
				>
					Dps as a Function of Defence @{" "}
					{this.props.state.monster.name}
					<span style={{ display: "inline-flex" }}>
						<label
							className="sub-text"
							htmlFor="dpsOverDefenceToggle"
							style={{
								marginRight: "0.5em",
								display: "inline-block"
							}}
						>
							Expand
						</label>
						<label
							className="toggle-control"
							htmlFor="dpsOverDefenceToggle"
						>
							<input
								readOnly
								type="checkbox"
								id="dpsOverDefenceToggle"
								checked={this.state.expand}
								onClick={this.toggleExpand}
							/>
							<span className="control"></span>
						</label>
					</span>
				</h3>
				<div className="highlight-section">
					<ResponsiveContainer
						width="100%"
						height={this.state.expand ? 400 : 200}
					>
						<LineChart
							data={this.state.data}
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
								allowDecimals={false}
								interval={0}
								tickCount={10}
								dataKey="defence"
								name="Defence"
								stroke="#ddd"
								type="number"
								reversed="true"
								domain={[0, def]}
							>
								<Label
									value="Defence"
									offset={0}
									position="insideBottom"
									margin={5}
									dy={10}
									fill="#eeeeee"
									style={{ fontFamily: "Roboto Slab" }}
								/>
							</XAxis>
							<YAxis
								stroke="#ddd"
								type="number"
								domain={["auto", "auto"]}
							>
								<Label
									value="DPS"
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
							{dwhLines}
							{lines}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		);
	}
}
