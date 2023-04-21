import React, { Component } from "react";
import PropTypes from "prop-types";

export class BonusRow extends Component {
	static propTypes = {
		percent: PropTypes.bool,
		bonusValue: PropTypes.number,
		bonusName: PropTypes.string
	};

	constructor (props) {
		props.percent ??= false;
		super(props);
	}

	render () {
		let colorClass;
		if (this.props.bonusValue < 0) {
			colorClass = "color-2";
		}
		else if (this.props.bonusValue === 0) {
			colorClass = "color-grey";
		}
		else {
			colorClass = "color-3";
		}
		// <!--span className={this.props.bonusValue > 0 ? "" : "hidden"}>+</span-->

		const spanClass = (this.props.percent) ? "" : "hidden";
		return (
			<tr>
				<td>{this.props.bonusName}</td>
				<td className={colorClass}>
					{this.props.bonusValue}
					<span className={spanClass}>%</span>
				</td>
			</tr>
		);
	}
}
