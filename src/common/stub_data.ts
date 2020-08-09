import {ListItemData} from './types';

// Suppose I have a json with a list from some server.
const generateItems = (): ListItemData[] => {
	const items: ListItemData[] = [];
	const itemsNumber = 5;
	for (let i = 0; i < itemsNumber; i++) {
		items.push({id: i, text: `${i + 1}`});
	}
	return items;
}

export const stubItems = generateItems();