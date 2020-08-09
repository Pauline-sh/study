import {BoundingClientRect} from './types'

export const getBoundingClientRectObj = (object: HTMLElement): BoundingClientRect => {
	const {x, y, width, height, top, right, bottom, left} =
			object.getBoundingClientRect();
	return {x, y, width, height, top, right, bottom, left};
}