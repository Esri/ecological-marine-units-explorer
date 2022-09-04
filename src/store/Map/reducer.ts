import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export type View = '2d' | '3d';

export type CameraInfo = {
    heading?: number;
    tilt?: number;
    position?: {
        type?: string;
        x?: number;
        y?: number;
        z?: number;
        spatialReference?: {
            latestWkid?: number;
            wkid?: number;
        };
    };
};

export type ViewPointInfo = {
    rotation?: number;
    scale?: number;
    targetGeometry?: {
        type?: string;
        x?: number;
        y?: number;
        z?: number;
        spatialReference?: {
            latestWkid?: number;
            wkid?: number;
        };
    };
    camera?: CameraInfo;
};

export type ViewExtent = {
    xmin?: number;
    xmax?: number;
    ymin?: number;
    ymax?: number;
    spatialReference?: {
        latestWkid?: number;
        wkid?: number;
    };
};

export type MapState = {
    view?: View;
    // indicate if EMU change layer should shown
    showChangeLayer?: boolean;
    viewpoint?: ViewPointInfo;
    objectIdOfHighlightedEmuOptimizedFeature?: number;
    // depth level of emu layer displayed in the 2d view
    emuLayerDepthLevel?: number;
    extent?: ViewExtent;
};

export const initialMapState: MapState = {
    view: '3d',
    showChangeLayer: false,
    viewpoint: null,
    objectIdOfHighlightedEmuOptimizedFeature: null,
    emuLayerDepthLevel: 1,
    extent: null,
};

const slice = createSlice({
    name: 'Map  ',
    initialState: initialMapState,
    reducers: {
        viewChanged: (state, action: PayloadAction<View>) => {
            state.view = action.payload;
            state.emuLayerDepthLevel = 1;
        },
        viewpointChanged: (state, action: PayloadAction<ViewPointInfo>) => {
            state.viewpoint = action.payload;
        },
        extentChanged: (state, action: PayloadAction<ViewExtent>) => {
            state.extent = action.payload;
        },
        showChangeLayerChanged: (state, action: PayloadAction<boolean>) => {
            state.showChangeLayer = action.payload;
        },
        objectIdOfHighlightedEmuOptimizedFeatureChanged: (
            state,
            action: PayloadAction<number>
        ) => {
            state.objectIdOfHighlightedEmuOptimizedFeature = action.payload;
        },
        emuLayerDepthLevelChanged: (state, action: PayloadAction<number>) => {
            state.emuLayerDepthLevel = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    viewChanged,
    viewpointChanged,
    extentChanged,
    showChangeLayerChanged,
    objectIdOfHighlightedEmuOptimizedFeatureChanged,
    emuLayerDepthLevelChanged,
} = slice.actions;

export default reducer;
