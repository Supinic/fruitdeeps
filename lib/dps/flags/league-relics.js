import { getFlags as getVoidFlags } from "./void.js";

export function getFlags (dps, player, monster) {
	const flags = [];
	const { vertex } = dps;
	const { tier3relic, tier6relic } = player.misc;

	if (tier3relic === "Quick Shot" && vertex === "Ranged") {
		flags.push(tier3relic);
	}
	else if (tier3relic === "Fluid Strike" && vertex === "Melee") {
		flags.push(tier3relic);
	}
	else if (tier3relic === "Double Cast" && vertex === "Magic") {
		flags.push(tier3relic);

		const iceSpell = player.spell && player.spell.includes("Ice");
		const voidList = getVoidFlags(dps, player, monster);
		const hasVoidMage = voidList.some(i => i.includes("mage"));

		const magicBonus = player.bonuses[3];
		if (iceSpell && (magicBonus >= 60 || magicBonus >= 20 && hasVoidMage)) {
			flags.push("Double Cast Bug Abuse");
		}
	}

	if (tier6relic) {
		flags.push("Tier 6");
	}

	return flags;
}
