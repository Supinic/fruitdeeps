import { OverhitSwitcher } from "../dps/overhit/OverhitSwitcher.js";

import { TtkOptimization } from "../dps/overhit/TtkOptimization.js";

import { DpsDefence } from "../dps/overhit/DpsDefence.js";

self.addEventListener("message", (e) => {
	if (e.data.type === "Overhit") {
		const calcs = e.data.calcs;
		const state = e.data.state;
		const overhit = OverhitSwitcher(state, calcs);

		self.postMessage({ overhit: overhit.output() });
	}
	else if (e.data.type === "Optimization") {
		const calcsList = e.data.calcsList;
		const state = e.data.state;
		console.log("opt data", e);
		const ttkOpt = new TtkOptimization(state, calcsList);
		const output = ttkOpt.output();
		console.log(output);
		self.postMessage(output);
	}
	else if (e.data.type === "DpsDefence") {
		const calcsList = e.data.calcsList;
		const state = e.data.state;
		const dpsDef = new DpsDefence(state, calcsList);
		self.postMessage(dpsDef.output());
	}
});
