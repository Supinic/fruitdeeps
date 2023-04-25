import { Dps } from "../../lib/dps/Dps.js";
import Player from "../../lib/Player.js";
import monster from "../combat-dummy.json" assert { type: "json" };
import { strictEqual } from "assert";

const round = (num, places) => Math.round(num * (10 ** places)) / (10 ** places);

describe("sorry about that", () => {
	it("Default state - no weapon, no armour", () => {
		const player = new Player();

		const dpsInstance = new Dps({ monster, player });
		const result = dpsInstance.output();

		const { accuracy, maxHit, dps } = result;
		strictEqual(maxHit, 11);
		strictEqual(round(accuracy * 100, 2), 95.78);
		strictEqual(round(dps, 3), 2.195);
	});

	it("Dragon dagger stab", () => {
		const player = new Player();

		const dpsInstance = new Dps({ monster, player });
		const result = dpsInstance.output();

		const { accuracy, maxHit, dps } = result;

		console.log(result);

		strictEqual(maxHit, 11);
		strictEqual(round(accuracy * 100, 2), 95.78);
		strictEqual(round(dps, 3), 2.195);
	});
});
