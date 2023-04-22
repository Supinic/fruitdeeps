import React, { Component } from "react";

import { CalcsProperty } from "../types/CalcsProperty.js";
import { descriptions as flagDescriptions } from "../../game-data/flags.json";

export class CalcOutputText extends Component {
	static propTypes = {
		calcs: CalcsProperty
	};

	render () {
		const flagTable = this.props.calcs.flags.map((flag, index) => (
			<tr key={index}>
				<td>{flag}</td>
				<td className="color-grey">{flagDescriptions[flag]}</td>
			</tr>
		));

		if (flagTable.length > 0) {
			return (
				<div>
					<h3>Active effects</h3>
					<table className="bonus-table">
						<tbody>
							{flagTable}
						</tbody>
					</table>
				</div>
			);
		}

		return null;
	}
}
