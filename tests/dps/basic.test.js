import { strictEqual } from "assert";
import { assertRounded } from "../tests-utils.js";

import { Dps } from "../../lib/dps/Dps.js";
import dummy from "./combat-dummy.json" assert { type: "json" };

describe("DPS - basic", () => {
	it("Attacking a combat dummy", () => {
		const dpsInstance = new Dps({ monster: dummy, player: {} });
		const result = dpsInstance.output();

		const { accuracy, maxHit, dps } = result;
		strictEqual(maxHit, 11);
		assertRounded(accuracy, 0.9578, 4);
		assertRounded(dps, 2.195, 3);
	});
});
