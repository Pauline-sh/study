import {createStore} from 'redux';

import {todoListReducer} from './reducer';

export const store = createStore(todoListReducer);
store.subscribe(() => {});
