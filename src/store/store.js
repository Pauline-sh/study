import {createStore} from 'redux';

import {workshopReducer} from './reducer';

export const store = createStore(workshopReducer);
store.subscribe(() => {});
