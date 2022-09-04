import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { EmuChangeData, EmuData, EmuOptimizedData } from '../../types/emu';
import { formatEmuDataItems } from './helper';

export type QueryLocation = {
    latitude: number;
    longitude: number;
};

export type EMUDataState = {
    emuData?: {
        byObjectId?: {
            [key: number]: Partial<EmuData>;
        };
        objectIds?: number[];
    };
    emuOptmizedData?: {
        byObjectId?: {
            [key: number]: Partial<EmuOptimizedData>;
        };
        objectIds?: number[];
    };
    emuChangeData?: Partial<EmuChangeData>[];
    queryLocation?: Partial<QueryLocation>;
};

export const initialEMUDataState: EMUDataState = {
    emuData: {
        byObjectId: {},
        objectIds: [],
    },
    emuOptmizedData: {
        byObjectId: {},
        objectIds: [],
    },
    queryLocation: null,
    emuChangeData: [],
};

const slice = createSlice({
    name: 'EMU',
    initialState: initialEMUDataState,
    reducers: {
        emuDataLoaded: (state, action: PayloadAction<EmuData[]>) => {
            const { byObjectId, objectIds } = formatEmuDataItems(
                action.payload
            );
            state.emuData = {
                byObjectId,
                objectIds,
            };
        },
        emuOptmizedDataLoaded: (
            state,
            action: PayloadAction<EmuOptimizedData[]>
        ) => {
            const { byObjectId, objectIds } = formatEmuDataItems(
                action.payload
            );
            state.emuOptmizedData = {
                byObjectId,
                objectIds,
            };
        },
        emuChangeDataLoaded: (
            state,
            action: PayloadAction<EmuChangeData[]>
        ) => {
            state.emuChangeData = action.payload;
        },
        queryLocationChanged: (state, action: PayloadAction<QueryLocation>) => {
            state.queryLocation = action.payload;
        },
        queryResultsCleared: (state) => {
            state.queryLocation = null;
            state.emuChangeData = [];
            state.emuData = {
                byObjectId: {},
                objectIds: [],
            };
            state.emuOptmizedData = {
                byObjectId: {},
                objectIds: [],
            };
        },
    },
});

const { reducer } = slice;

export const {
    emuDataLoaded,
    emuOptmizedDataLoaded,
    emuChangeDataLoaded,
    queryLocationChanged,
    queryResultsCleared,
} = slice.actions;

export default reducer;
