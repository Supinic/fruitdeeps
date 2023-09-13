import { parse } from "wikiparse";
import { mkdir, readdir, writeFile } from "fs/promises";

const baseUrl = "https://oldschool.runescape.wiki/api.php";
const baseParams = new URLSearchParams({
	action: "query",
	prop: "transcludedin",
	format: "json",
	tilimit: "max",
	tiprop: "pageid",
	titles: "Template:Infobox Monster",
	tinamespace: "0"
});
const headers = {
	"User-Agent": "Fruitdeeps fork https://github.com/Supinic/fruitdeeps",
	"From": "supinic@pm.me"
};

let keepGoing = true;
let previousJson;
const pageIds = new Set();

console.log("Loading Wiki page IDs for monsters...");

while (keepGoing) {
	let response;
	if (!previousJson) {
		response = await fetch(`${baseUrl}?${baseParams}`, { headers });
	}
	else {
		const continueParams = new URLSearchParams(baseParams);
		continueParams.set("ticontinue", previousJson.continue.ticontinue);

		response = await fetch(`${baseUrl}?${continueParams}`, { headers });
	}

	const json = await response.json();
	const baseKey = Object.keys(json.query.pages)[0];
	const { transcludedin } = json.query.pages[baseKey];
	if (transcludedin) {
		for (const item of transcludedin) {
			pageIds.add(item.pageid);
		}

		previousJson = json;
	}

	if (typeof json.batchcomplete !== "undefined") {
		keepGoing = false;
	}
}

console.log(`Loaded ${pageIds.size} monster pages.`);

const getDetailParams = (pageId) => new URLSearchParams({
	action: "parse",
	prop: "wikitext",
	format: "json",
	pageid: String(pageId)
});

const baseStats = [
	"hitpoints",
	"combat",
	"size",
	"max hit",
	"attack speed",

	"att",
	"str",
	"def",
	"mage",
	"range",
	"attbns",
	"strbns",
	"amagic",
	"mbns",
	"arange",
	"rngbns",
	"dstab",
	"dslash",
	"dcrush",
	"dmagic",
	"drange",
];

const numericStats = [
	"att",
	"str",
	"def",
	"mage",
	"range",
	"attbns",
	"strbns",
	"amagic",
	"mbns",
	"arange",
	"rngbns",
	"dstab",
	"dslash",
	"dcrush",
	"dmagic",
	"drange"
];

const parseStats = (data, versionId) => {
	const result = {
		name: data.name?.[0],
		attributes: data.attributes ?? [],
		category: data.cat ?? [],
		version: null,
		version_number: null,
		image: null,
		stats: {}
	};

	for (const stat of baseStats) {
		let value;
		if (versionId) {
			const versionStat = `${stat}${versionId}`;
			value = data[versionStat];
		}

		value ??= data[stat];

		const target = (numericStats.includes(stat)) ? result.stats : result;
		const statName = stat.replace(/\s+(\w)/, (total, match) => match.toUpperCase());
		if (Array.isArray(value) && value.length !== 0) {
			target[statName] = Number(value[0]);
		}
		else {
			target[statName] = null;
		}
	}

	let imageArray;
	if (versionId) {
		result.name ??= data[`name${versionId}`]?.[0];
		result.version_number = versionId;
		result.version = data[`version${versionId}`];
		imageArray = data[`image${versionId}`];
	}

	imageArray ??= data.image;
	if (Array.isArray(imageArray) && imageArray.length !== 0) {
		result.image = imageArray[0].to.replace("File:", "");
	}

	return result;
}

const parseInfobox = (infobox) => {
	const result = [];

	const data = infobox.parameters;
	const keys = Object.keys(data);
	const versions = keys.filter(i => i.startsWith("version"));

	try {
		if (versions.length !== 0) {
			const versionIds = versions.map(i => Number(i.replace("version", "")));
			for (const versionId of versionIds) {
				result.push(parseStats(data, versionId));
			}
		}
		else {
			result.push(parseStats(data));
		}
	}
	catch (e) {
		console.error("Extra data", { infobox });
		throw e;
	}

	return result.filter(i => i.image);
}

const parsePluralInfobox = (infobox) => {
	const { parameters } = infobox;
	const itemKeys = Object.keys(parameters).filter(i => i.startsWith("item"));
	for (const itemKey of itemKeys) {
		const subInfobox = parameters[itemKey][0];
		if (subInfobox.name === "infobox monster") {
			return parseInfobox(subInfobox);
		}
		else if (subInfobox.name === "switch infobox" || subInfobox.name === "multi infobox") {
			return parsePluralInfobox(subInfobox);
		}
	}

	return [];
}

console.log(`Parsing monster pages...`);

try {
	await mkdir("./importstuff/wiki-cache");
}
catch {
	console.log("Skipped creating wiki cache directory");
}

const existingFiles = await readdir("./importstuff/wiki-cache");

let i = 1;
const npcData = [];
for (const pageId of pageIds) {
	if (i % 100 === 0) {
		console.log(`Parsed ${i}/${pageIds.size} pages`);
	}

	let infobox;
	if (existingFiles.includes(`${pageId}.json`)) {
		const jsonModule = await import(`./wiki-cache/${pageId}.json`, { assert: { type: "json" }});
		infobox = jsonModule.default;
	}
	else {
		const searchParams = getDetailParams(pageId);
		const response = await fetch(`${baseUrl}?${searchParams}`, { headers });
		const json = await response.json();

		const source = json.parse.wikitext["*"];
		const ast = parse(source);
		infobox = ast.find(i => i && typeof i.name === "string" && i.name.includes("infobox"));

		await writeFile(`./importstuff/wiki-cache/${pageId}.json`, JSON.stringify(infobox));
	}

	if (infobox.name === "infobox monster") {
		npcData.push(...parseInfobox(infobox));
	}
	else if (infobox.name === "multi infobox" || infobox.name === "switch infobox") {
		npcData.push(...parsePluralInfobox(infobox));
	}

	i++;
}

console.log(`Parsed ${npcData.length} monsters.`);

await writeFile("./public/assets/npcs.json", JSON.stringify(npcData));
console.log("JSON written - all done!");
