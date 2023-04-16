import React, { Component } from "react";
import { connect } from "react-redux";

import { CalcOutputMultiple } from "./CalcOutputMultiple.js";
import { StateProperty } from "./types/StateProperty.js";

export class CalcOutputWrapper extends Component {
	static propTypes = {
		state: StateProperty
	};

	render () {
		return <CalcOutputMultiple state={this.props.state}/>;
	}
}

function mapStateToProps (state) {
	return { state };
}

export default connect(mapStateToProps)(CalcOutputWrapper);
