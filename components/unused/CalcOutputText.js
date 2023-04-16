import React, { Component } from "react";
import { Flags } from "../../lib/dps/Flags.js";

import { CalcsProperty } from "../types/CalcsProperty.js";

export class CalcOutputText extends Component {
	static propTypes = {
		calcs: CalcsProperty
	};

	render () {
		const flags = new Flags();
		const flagTable = this.props.calcs.flags.map((flag, index) => (
			<tr key={index}>
				<td>{flag}</td>
				<td className="color-grey">{flags.description(flag)}</td>
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
