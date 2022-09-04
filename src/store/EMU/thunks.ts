import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import IPoint from 'esri/geometry/Point';
import { batch } from 'react-redux';
import { loadModules } from 'esri-loader';
import { queryEmuDatabyQrtDegreeId } from '../../services/emu-data/queryEmuData';
import { queryEmuOptimizedDataByLocation } from '../../services/emu-data/queryEmuOptimizedData';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';
import { objectIdOfHighlightedEmuOptimizedFeatureChanged } from '../Map/reducer';
import {
    getDataFromHashParams,
    saveQueryInHashParam,
} from '../../utils/url-hash-params';
import {
    queryLocationChanged,
    emuDataLoaded,
    emuOptmizedDataLoaded,
    queryResultsCleared,
    emuChangeDataLoaded,
} from './reducer';

export const queryEmuData = (point: IPoint, zoomLevel: number) => async (
    dispatch: StoreDispatch,
    getState: StoreGetState
) => {
    try {
        const response = await queryEmuOptimizedDataByLocation(
            point,
            zoomLevel
        );

        if (response && response?.results.length) {
            const { results, queryLocation } = response;

            const qrtDegreeId = response?.results[0].QtrDegreeID;

            const [emuData, emuChangeData] = await queryEmuDatabyQrtDegreeId(
                qrtDegreeId
            );

            batch(() => {
                dispatch(queryLocationChanged(queryLocation));
                dispatch(emuDataLoaded(emuData));
                dispatch(emuOptmizedDataLoaded(results));
                dispatch(emuChangeDataLoaded(emuChangeData));
            });

            saveQueryInHashParam(queryLocation, zoomLevel);
        } else {
            dispatch(clearQueryResult());
        }
    } catch (err) {
        console.log(err);
    }
};

export const clearQueryResult = () => (
    dispatch: StoreDispatch,
    getState: StoreGetState
) => {
    batch(() => {
        dispatch(objectIdOfHighlightedEmuOptimizedFeatureChanged(null));
        dispatch(queryResultsCleared());
        saveQueryInHashParam();
    });
};

export const queryEmuDataUsingLocationFromHashParams = () => async (
    dispatch: StoreDispatch,
    getState: StoreGetState
) => {
    const { query } = getDataFromHashParams();

    if (!query) {
        return;
    }

    const {
        zoom,
        queryLocation: { longitude, latitude },
    } = query;

    try {
        type Modules = [typeof IPoint];

        const [Point] = await (loadModules(['esri/geometry/Point']) as Promise<
            Modules
        >);

        const point = new Point({
            latitude,
            longitude,
            spatialReference: {
                wkid: 4326,
            },
        });

        dispatch(queryEmuData(point.toJSON(), zoom));
    } catch (err) {
        console.error(err);
    }
};
