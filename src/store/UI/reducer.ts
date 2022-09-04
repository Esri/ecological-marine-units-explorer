import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk
} from '@reduxjs/toolkit';
import { EmuChangeData, EmuOptimizedData, EmuVariable } from '../../types/emu';

// import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

export type EmuVariableValues = Partial<Record<EmuVariable, number>>;

export type TooltipData = {
    // emuVariableValues?: EmuVariableValues;
    showGlobalStats?: boolean;
    selectedEmuVariable?: EmuVariable;
    emuOptimizedData?: Partial<EmuOptimizedData>;
    emuChangeData?: Partial<EmuChangeData>;
};

export type ScatterplotTooltip = {
    xPos?: number;
    yPos?: number;
    depth?: number;
    emuValue?: number;
    emuVariable?: EmuVariable;
};

export type UIState = {
    isSidebarOpen?: boolean;
    tooltipData?: TooltipData;
    tooltipXPosition?: number;
    scatterplotTooltip?: ScatterplotTooltip;
};

export const initialUIState: UIState = {
    isSidebarOpen: false,
    tooltipData: null,
    tooltipXPosition: null,
    scatterplotTooltip: null,
};

const slice = createSlice({
    name: 'UI',
    initialState: initialUIState,
    reducers: {
        isSidebarOpenToggled: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        tooltipDataChanged: (state, action: PayloadAction<TooltipData>) => {
            state.tooltipData = action.payload;
        },
        tooltipXPositionChanged: (state, action: PayloadAction<number>) => {
            state.tooltipXPosition = action.payload;
        },
        scatterplotTooltipChanged: (
            state,
            action: PayloadAction<ScatterplotTooltip>
        ) => {
            state.scatterplotTooltip = action.payload;
        },
    },
});

const { reducer } = slice;

export const {
    isSidebarOpenToggled,
    tooltipDataChanged,
    tooltipXPositionChanged,
    scatterplotTooltipChanged,
} = slice.actions;

export default reducer;
