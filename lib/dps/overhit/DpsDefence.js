import { OverhitSwitcher } from "./OverhitSwitcher.js";
import { Dps } from "../Dps.js";

export class DpsDefence {
	constructor (state, calcsList) {
		this.calcsList = calcsList;
		this.state = state;
		console.log("defence dps", state);
	}

	output () {
		const monster = this.state.monster;
		const graphData = [];
		const baseDef = monster.stats.def;
		let graphObject = { defence: baseDef };
		for (let i = 0; i < this.calcsList.length; i++) {
			graphObject[`Set ${i + 1}`] = parseFloat(this.calcsList[i].dps.toFixed(3));
		}
		graphData.push(graphObject);

		const defSet = new Set();
		for (let i = 0; i <= 20; i++) {
			if (i < baseDef) {
				defSet.add(i);
			}
		}

		for (let i = 0; i < baseDef; i += 5) {
			defSet.add(i);
		}

		let dwhDef = baseDef;
		for (let i = 0; i < 5; i++) {
			dwhDef = dwhDef - Math.trunc(dwhDef * 0.3);
			defSet.add(dwhDef);
		}

		defSet.add(baseDef - Math.trunc(baseDef / 10) - 1);

		const defList = Array.from(defSet);
		defList.sort((a, b) => b - a);

		for (let i = 0; i < defList.length; i++) {
			graphObject = { defence: defList[i] };
			monster.stats.def = defList[i];
			for (let j = 0; j < this.calcsList.length; j++) {
				const dps = new Dps({
					monster,
					player: this.state.playerList[j]
				});

				const output = dps.output().dps;
				graphObject[`Set ${j + 1}`] = parseFloat(output.toFixed(3));
			}
			graphData.push(graphObject);
		}

		monster.stats.def = baseDef;

		return { graphData };
	}
}
