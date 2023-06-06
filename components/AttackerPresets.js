import React from "react";
import PropTypes from "prop-types";

import Player from "../lib/Player.js";
import items from "../public/assets/items.json" assert { type: "json" };
import { presets } from "./builtin-presets.js";
import searchFilter from "../lib/itemFinder.js";

const mapEquipmentIdentifiers = (identifiers) => {
	if (!Array.isArray(identifiers)) {
		return [];
	}

	const mapped = identifiers.map(i => {
		const [result] = searchFilter(i, items);
		if (!result) {
			throw new Error(`No item found: ${i}`);
		}

		return result;
	});

	return mapped.filter(Boolean);
};

const mapPreset = (preset) => ({
	name: preset.name,
	created: preset.created,
	equipment: mapEquipmentIdentifiers(preset.equipmentIdentifiers ?? [])
});

const useLocalStorage = (storageKey, fallbackState) => {
	const [value, setValue] = React.useState([]);

	React.useEffect(() => {
		const initialPresetsState = globalThis.localStorage.getItem(storageKey);
		const parsedPresets = (initialPresetsState)
			? JSON.parse(initialPresetsState)
			: fallbackState;

		setValue(parsedPresets);
	}, []);

	React.useEffect(() => {
		globalThis.localStorage.setItem(storageKey, JSON.stringify(value));
	}, [value, storageKey]);

	return [value, setValue];
};

const useForceUpdate = () => {
	const [value, setState] = React.useState(true);
	return () => setState(!value);
};

for (const item of presets) {
	if (!item.equipmentIdentifiers) {
		continue;
	}

	item.equipment = mapEquipmentIdentifiers(item.equipmentIdentifiers);
}

let elements = null;
const mappedCustomPresets = new Map();
const renderedCustomPresets = new Map();

function AttackerPresets (props) {
	const saveCustomPresetInput = (
		<input
			ref={React.createRef()}
			maxLength="30"
			className="input-invisible"
			type="text"
			placeholder="Save current set as..."
			onKeyDown={(evt) => saveCustomPreset(evt, props.player)}
		/>
	);

	elements ??= presets.map((i, ind) => {
		if (i.separator) {
			return (
				<br key={ind} />
			);
		}

		return (
			<button key={ind} onClick={() => changeSetup(presets[ind])}>{i.name}</button>
		);
	});

	const forceUpdate = useForceUpdate();
	const [customPresets, setCustomPresets] = useLocalStorage("custom-presets", []);

	const { player } = props;
	const changeSetup = (preset) => {
		if (preset.clear) {
			player.clearEquipment();
			player.clearPrayers();
			player.clearBoosts();
			player.clearCustomBonuses();
		}

		if (Array.isArray(preset.equipment)) {
			player.clearEquipment();
			for (const item of preset.equipment) {
				player.equip(item);
			}
		}

		if (Array.isArray(preset.prayers)) {
			player.clearPrayers();
			for (const prayer of preset.prayers) {
				player.selectPrayer(prayer);
			}
		}

		if (Array.isArray(preset.boosts)) {
			player.clearBoosts();
			for (const boost of preset.boosts) {
				player.addBoost(boost);
			}
		}

		props.setPlayer(player.minimize());
		props.setTab(0);
	};

	const removeSetup = (evt, name) => {
		evt.preventDefault();

		const index = customPresets.findIndex(i => i.name === name);
		if (index === -1) {
			return;
		}

		const result = globalThis.confirm(`Really remove preset "${name}"?`);
		if (!result) {
			return;
		}

		const copy = [...customPresets];
		copy.splice(index, 1);

		setCustomPresets(copy);
		mappedCustomPresets.delete(name);
		renderedCustomPresets.delete(name);
	};

	const saveCustomPreset = (evt, player) => {
		if (evt.key !== "Enter") {
			return;
		}

		const input = saveCustomPresetInput.ref.current;
		const name = input.value.trim();
		if (!name) {
			globalThis.alert("Invalid preset name!");
			return;
		}

		const itemIds = Object.values(player.equipment).map(i => i.id).filter(Boolean);
		let preset = customPresets.find(i => i.name === name);
		if (preset) {
			preset.equipmentIdentifiers = itemIds;
			preset.created = Date.now();
		}
		else {
			preset = {
				name,
				equipmentIdentifiers: itemIds,
				created: Date.now()
			};

			customPresets.push(preset);
		}

		setCustomPresets([...customPresets]);
		input.value = "";

		mappedCustomPresets.set(preset.name, mapPreset(preset));
		forceUpdate();
	};

	const clearCustomPresets = () => {
		const result = globalThis.confirm("Really remove all of your custom presets?");
		if (result) {
			setCustomPresets([]);
		}
	};

	if (customPresets.length === 0) {
		mappedCustomPresets.clear();
		renderedCustomPresets.clear();
	}
	else {
		for (const customPreset of customPresets) {
			const { name } = customPreset;
			const isMapped = mappedCustomPresets.has(name);
			if (!isMapped) {
				mappedCustomPresets.set(name, mapPreset(customPreset));
			}

			const existing = renderedCustomPresets.get(name);
			if (existing) {
				continue;
			}

			renderedCustomPresets.set(name, (
				<button
					onClick={() => changeSetup(mappedCustomPresets.get(name))}
					onContextMenu={(evt) => removeSetup(evt, name)}
				>
					{name}
				</button>
			));
		}

		for (const [name] of renderedCustomPresets) {
			const existing = customPresets.some(i => i.name === name);
			if (existing) {
				continue;
			}

			renderedCustomPresets.delete(name);
		}
	}

	const customPresetSeparator = (renderedCustomPresets.size > 0)
		? <><br/><h4>Custom presets (right click to remove)</h4></>
		: null;

	const removeAllCustomPresetsElement = (renderedCustomPresets.size > 0)
		? <><br/><button onClick={clearCustomPresets}>Remove all custom presets</button></>
		: null;

	return (
		<div className="highlight-section flex-container-vertical">
			<h3>Apply setup preset</h3>
			{...elements}
			{customPresetSeparator}
			{...renderedCustomPresets.values()}
			{removeAllCustomPresetsElement}
			<br/>
			<h4>Save current setup</h4>
			{saveCustomPresetInput}
		</div>
	);
}

AttackerPresets.propTypes = {
	player: PropTypes.instanceOf(Player),
	setPlayer: PropTypes.func,
	setTab: PropTypes.func
};

export default AttackerPresets;
