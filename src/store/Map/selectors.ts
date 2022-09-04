import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export const selectView = createSelector(
    (state: RootState) => state.Map.view,
    (view) => view
);

export const selectViewpoint = createSelector(
    (state: RootState) => state.Map.viewpoint,
    (viewpoint) => viewpoint
);

export const selectViewExtent = createSelector(
    (state: RootState) => state.Map.extent,
    (extent) => extent
);

export const selectShouldShowChangeLayer = createSelector(
    (state: RootState) => state.Map.showChangeLayer,
    (showChangeLayer) => showChangeLayer
);

export const selectObjectIdOfHighlightedEmuOptimizedFeature = createSelector(
    (state: RootState) => state.Map.objectIdOfHighlightedEmuOptimizedFeature,
    (objectIdOfHighlightedEmuOptimizedFeature) =>
        objectIdOfHighlightedEmuOptimizedFeature
);

export const selectEmuLayerDepthLevel = createSelector(
    (state: RootState) => state.Map.emuLayerDepthLevel,
    (emuLayerDepthLevel) => emuLayerDepthLevel
);
