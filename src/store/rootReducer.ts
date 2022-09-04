import { combineReducers } from 'redux';
import UI from './UI/reducer';
import Map from './Map/reducer';
import EMU from './EMU/reducer';

export default combineReducers({
    UI,
    Map,
    EMU,
});
