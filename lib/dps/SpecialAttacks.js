import { apply as applyAncientGodsword } from "./specs/ancient-godsword.js";
import { apply as applyArmadylCrossbow } from "./specs/armadyl-crossbow.js";
import { apply as applyArmadylGodsword } from "./specs/armadyl-godsword.js";
import { apply as applyBandosGodsword } from "./specs/bandos-godsword.js";
import { apply as applyCrystalHalberd } from "./specs/crystal-halberd.js";
import { apply as applyDarkBow } from "./specs/dark-bow.js";
import { apply as applyDragonClaws } from "./specs/dragon-claws.js";
import { apply as applyDragonDagger } from "./specs/dragon-dagger.js";
import { apply as applyDragonWarhammer } from "./specs/dragon-warhammer.js";
import { apply as applyMagicLongbow } from "./specs/magic-longbow.js";
import { apply as applyMagicShortbow } from "./specs/magic-shortbow.js";
import { apply as applyOsmumtensFang } from "./specs/osmumtens-fang.js";
import { apply as applySaradominGodsword } from "./specs/saradomin-godsword.js";
import { apply as applyToxicBlowpipe } from "./specs/toxic-blowpipe.js";
import { apply as applyVolatileNightmareStaff } from "./specs/volatile-nightmare-staff.js";

/**
 * Applies the requested special attack to the player's DPS object and state object.
 * Mutates the input `dps` object, and returns it with the applied special attack data.
 * @param {string} specialName
 * @param {Object} dps
 * @param {Object} state
 * @returns {Object}
 */
export default function applySpecialAttack (specialName, dps, state) {
	switch (specialName) {
		case "Slice and Dice": return applyDragonClaws(dps, state);
		case "Puncture": return applyDragonDagger(dps, state);
		case "Descent of Dragons": return applyDarkBow(state, dps, { useDragonArrows: true });
		case "Descent of Darkness": return applyDarkBow(state, dps, { useDragonArrows: false });
		case "Armadyl eye": return applyArmadylCrossbow(dps, state);
		case "Snapshot": return applyMagicShortbow(dps, state);
		case "Powershot": return applyMagicLongbow(dps, state);
		case "The Judgement": return applyArmadylGodsword(dps, state);
		case "Healing Blade": return applySaradominGodsword(dps, state);
		case "Warstrike": return applyBandosGodsword(dps, state);
		case "Sweep": return applyCrystalHalberd(dps, state);
		case "Immolate": return applyVolatileNightmareStaff(dps, state);
		case "Toxic Siphon": return applyToxicBlowpipe(dps, state);
		case "Smash": return applyDragonWarhammer(dps, state);
		case "Blood Sacrifice": return applyAncientGodsword(dps, state);
		case "Eviscerate": return applyOsmumtensFang(dps, state);

		default: return dps;
	}
}
