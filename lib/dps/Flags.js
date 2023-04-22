// Flags.js is responsible for determining if various special effects are active for the player

// This file should not actually calculate anything!
// It should be solely used to figure out which effects are applicable to the player/monster/etc.

import { getFlags as getInquisitorsFlags } from "./flags/inquisitors.js";
import { getFlags as getLeagueRelicFlags } from "./flags/league-relics.js";
import { getFlags as getMagicFlags } from "./flags/magic.js";
import { getFlags as getMeleeFlags } from "./flags/melee.js";
import { getFlags as getObsidianFlags } from "./flags/obsidian.js";
import { getFlags as getRangedFlags } from "./flags/ranged.js";
import { getFlags as getSalveFlags } from "./flags/salve.js";
import { getFlags as getSlayerFlags } from "./flags/slayer.js";
import { getFlags as getVoidFlags } from "./flags/void.js";

const flagFunctionList = [
	getInquisitorsFlags,
	getLeagueRelicFlags,
	getMagicFlags,
	getMeleeFlags,
	getObsidianFlags,
	getRangedFlags,
	getSalveFlags,
	getSlayerFlags,
	getVoidFlags
];

export function getFlagList (dps, player, monster) {
	const flags = [];
	for (const fn of flagFunctionList) {
		const result = fn(dps, player, monster);
		flags.push(...result);
	}

	return flags;
}
