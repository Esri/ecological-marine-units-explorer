import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export const selectEmuData = createSelector(
    (state: RootState) => state.EMU.emuData.byObjectId,
    (state: RootState) => state.EMU.emuData.objectIds,
    (byObjectId, objectIds) => {
        return objectIds.map((id) => byObjectId[id]);
    }
);

export const selectEmuOptmizedData = createSelector(
    (state: RootState) => state.EMU.emuOptmizedData.byObjectId,
    (state: RootState) => state.EMU.emuOptmizedData.objectIds,
    (byObjectId, objectIds) => {
        return objectIds.map((id) => byObjectId[id]);
    }
);

export const selectEmuChangeData = createSelector(
    (state: RootState) => state.EMU.emuChangeData,
    (emuChangeData) => emuChangeData
);

export const selectQueryLocation = createSelector(
    (state: RootState) => state.EMU.queryLocation,
    (queryLocation) => queryLocation
);

export const selectShouldOpenInfoPanel = createSelector(
    (state: RootState) => state.EMU.emuData.objectIds,
    (objectIds) => objectIds.length > 0
);
