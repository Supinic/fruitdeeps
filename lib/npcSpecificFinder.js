const npcFinder = async (query, itemList) => {
	const filteredList = itemList.filter(item => item.name === query);
	return { query, list: filteredList };
};

export default npcFinder;
