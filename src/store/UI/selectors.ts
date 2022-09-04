import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export const selectIsSidebarOpen = createSelector(
    (state: RootState) => state.UI.isSidebarOpen,
    (isSidebarOpen) => isSidebarOpen
);

export const selectTooltipData = createSelector(
    (state: RootState) => state.UI.tooltipData,
    (tooltipData) => tooltipData
);
export const selectTooltipXPosition = createSelector(
    (state: RootState) => state.UI.tooltipXPosition,
    (tooltipXPosition) => tooltipXPosition
);

export const selectScatterplotTooltipData = createSelector(
    (state: RootState) => state.UI.scatterplotTooltip,
    (scatterplotTooltip) => scatterplotTooltip
);
