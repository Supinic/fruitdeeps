/* eslint-disable max-nested-callbacks */
import { deepStrictEqual, strictEqual } from "assert";

import { assertRounded, mergeDeep } from "../tests-utils.js";
import searchFilter from "../../lib/itemFinder.js";
import { Dps } from "../../lib/dps/Dps.js";
import Player from "../../lib/Player.js";

import scenarios from "./scenarios.json" assert { type: "json" };
import assertedProperties from "../asserted-properties.json" assert { type: "json" };

let items;
let npcs;
try {
	const itemsJson = await import("../../public/assets/items.json", { assert: { type: "json" }});
	const npcsJson = await import("../../public/assets/npcs.json", { assert: { type: "json" }});

	items = itemsJson.default;
	npcs = npcsJson.default;
}
catch (e) {
	console.warn("No item and/or NPC data found - run itempopulate and/or npcpopulate scripts first");
	process.exit(1);
}

describe("DPS - scenarios", () => {
	const useOnly = scenarios.some(i => i.only);
	const filteredScenarios = (useOnly)
		? scenarios.filter(i => i.only)
		: scenarios.filter(i => !i.skip);

	for (const scenario of filteredScenarios) {
		if (scenario.abstract) {
			continue;
		}

		let target = scenario;
		if (scenario.parent) {
			const variant = scenarios.find(i => i.description === scenario.parent);
			if (!variant) {
				throw new Error(`Unknown scenario variant "${scenario.parent}"`);
			}

			target = mergeDeep(variant, scenario);
			target.description = `${variant.description} (${scenario.description})`;

			delete target.abstract;
		}

		it(target.description, () => {
			const { player = {}, equipment = [], npc = {}, expected = {} } = target;
			const monster = npcs.find(i => {
				if (i.name !== npc.name) {
					return false;
				}
				else if (typeof npc.combat === "number") {
					return (i.combat === npc.combat);
				}
				else if ((!i.version && !npc.version) || i.version === npc.version) {
					return true;
				}

				return false;
			});

			if (!monster) {
				throw new Error(`No monster found: "${npc.name}"`);
			}

			if (typeof npc.invocation === "number") {
				monster.invocation = npc.invocation;
			}

			const playerData = new Player(player);
			for (const itemIdentifier of equipment) {
				let itemData;
				if (typeof itemIdentifier === "number") {
					itemData = items.find(i => i.id === itemIdentifier);
				}
				else {
					const possibleItems = searchFilter(itemIdentifier, items);
					itemData = possibleItems.find(i => i.name === itemIdentifier);
				}

				if (!itemData) {
					throw new Error(`No item found: "${itemIdentifier}"`);
				}

				playerData.equip(itemData);
			}

			if (typeof player.attackStyleSelected === "number") {
				playerData.setAttackStyle(player.attackStyleSelected);
			}

			const dpsInstance = new Dps({ monster, player: playerData });
			const result = dpsInstance.output();

			for (const property of Object.keys(expected)) {
				const def = assertedProperties.find(i => i.property === property);
				if (!def) {
					throw new Error(`Unknown assert property "${property}" - add definition if needed`);
				}

				const expectedValue = expected[property];
				const actualValue = result[property];
				if (typeof actualValue === "undefined") {
					if (expectedValue === null) {
						// Value is expected to not be present - OK
						return;
					}

					console.log(result);
					throw new Error(`Property ${property} not found in DPS object result`);
				}

				if (def.comparison === "strict") {
					strictEqual(actualValue, expectedValue, `${def.name} mismatch`);
				}
				else if (def.comparison === "loose") {
					assertRounded(actualValue, expectedValue, def.places, `${def.name} mismatch`);
				}
				else if (def.comparison === "deep") {
					deepStrictEqual(actualValue, expectedValue, `${def.name} mismatch`);
				}
			}
		});
	}
});
