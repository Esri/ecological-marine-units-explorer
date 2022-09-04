import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { Extent } from 'esri/geometry';
import {
    saveShowChangeLayerInHashParam,
    saveViewInHashParam,
    saveViewpointInHashParam,
} from '../../utils/url-hash-params';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

import {
    View,
    viewChanged,
    showChangeLayerChanged,
    ViewPointInfo,
    viewpointChanged,
} from './reducer';

export const changeView = (view: View) => (
    dispatch: StoreDispatch
    // getState:StoreGetState,
) => {
    dispatch(viewChanged(view));
    saveViewInHashParam(view);
};

export const updateShowChangeLayer = (shouldShow: boolean) => (
    dispatch: StoreDispatch
    // getState:StoreGetState,
) => {
    dispatch(showChangeLayerChanged(shouldShow));
    saveShowChangeLayerInHashParam(shouldShow);
};

export const updateViewpoint = (viewpoint: ViewPointInfo) => (
    dispatch: StoreDispatch
    // getState:StoreGetState,
) => {
    dispatch(viewpointChanged(viewpoint));
    saveViewpointInHashParam(viewpoint);
};
