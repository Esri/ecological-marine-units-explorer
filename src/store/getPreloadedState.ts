import { PartialRootState } from './configureStore';

// import { initialUIState, UIState } from '../store/reducers/UI';
import { initialMapState, MapState } from '../store/Map/reducer';
import { getDataFromHashParams } from '../utils/url-hash-params';

// const getPreloadedUIState = (): UIState => {
//     return {
//         ...initialUIState,
//     };
// };

const dataFromHashParams = getDataFromHashParams();

const getPreloadedMapState = (): MapState => {
    return {
        ...initialMapState,
        view: dataFromHashParams.view || '3d',
        showChangeLayer: dataFromHashParams.showChangeLayer || false,
        viewpoint: dataFromHashParams.viewpoint,
    };
};

const getPreloadedState = (): PartialRootState => {
    return {
        Map: getPreloadedMapState(),
    };
};

export default getPreloadedState;
