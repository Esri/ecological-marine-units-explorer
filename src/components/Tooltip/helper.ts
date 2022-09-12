import React from 'react';
import { PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE } from '../../services/emu-data/config';
// import { EmuVariableValues } from '../../store/UI/reducer';
import { EmuChangeData, EmuOptimizedData, EmuVariable } from '../../types/emu';
import {
    getEmuUnit,
    // getGlobalSummaryData,
    GloablSummaryData,
} from '../../utils/emu';
import { TooltipTableData } from './Table';

type EmuValuesByVariable = Record<EmuVariable, number>;

export const getTableDataForEmuVariables = (data: EmuValuesByVariable) => {
    return Object.entries(data).map((d) => {
        const emuVariable = d[0] as EmuVariable;
        const value = d[1] as number;

        const formatedLabel =
            emuVariable === 'Dissolved O2'
                ? 'Dissolved O<sub>2<sub>'
                : emuVariable;

        return {
            label: formatedLabel,
            value:
                value === PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE
                    ? 'n/a'
                    : `${value.toFixed(2)} ${getEmuUnit(emuVariable)}`,
        };
    });
};

export const getTableDataFromEmuChangeData = (
    data: Partial<EmuChangeData>
): TooltipTableData[] => {
    const {
        TempDiff,
        SalinityDiff,
        SilicateDiff,
        NitrateDiff,
        PhosphateDiff,
        DissO2Diff,
    } = data;

    const emuDataByVariable: EmuValuesByVariable = {
        Temperature: TempDiff,
        'Dissolved O2': DissO2Diff,
        Salinity: SalinityDiff,
        Silicate: SilicateDiff,
        Nitrate: NitrateDiff,
        Phosphate: PhosphateDiff,
    };

    return getTableDataForEmuVariables(emuDataByVariable);
};

export const getTableDataFromEmuOptimizedData = (
    data: Partial<EmuOptimizedData>
): TooltipTableData[] => {
    const {
        TempCurrent,
        SalinityCurrent,
        SilicateCurrent,
        NitrateCurrent,
        PhosphateCurrent,
        DissO2Current,
    } = data;

    const emuDataByVariable: EmuValuesByVariable = {
        Temperature: TempCurrent,
        'Dissolved O2': DissO2Current,
        Salinity: SalinityCurrent,
        Silicate: SilicateCurrent,
        Nitrate: NitrateCurrent,
        Phosphate: PhosphateCurrent,
    };

    return getTableDataForEmuVariables(emuDataByVariable);
};

export const getTableDataFromGlobalSummaryData = (
    globalSummaryData: GloablSummaryData,
    emuOptimizedData: Partial<EmuOptimizedData>,
    emuVariable: EmuVariable
): TooltipTableData[] => {
    if (!globalSummaryData) {
        return [];
    }

    const {
        TempCurrent,
        SalinityCurrent,
        SilicateCurrent,
        NitrateCurrent,
        PhosphateCurrent,
        DissO2Current,
    } = emuOptimizedData;

    const emuDataByVariable: Record<EmuVariable, number> = {
        Temperature: TempCurrent,
        Salinity: SalinityCurrent,
        'Dissolved O2': DissO2Current,
        Nitrate: NitrateCurrent,
        Phosphate: PhosphateCurrent,
        Silicate: SilicateCurrent,
    };

    const emuValueForSelectedVariable = emuDataByVariable[emuVariable];

    const {
        max,
        upperQuantile,
        median,
        lowerQuantile,
        min,
    } = globalSummaryData;

    const formatedLabel =
        emuVariable === 'Dissolved O2' ? 'Dissolved O<sub>2<sub>' : emuVariable;

    return [
        {
            label: `Selected EMU ${formatedLabel}`,
            value:
                emuValueForSelectedVariable ===
                PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE
                    ? 'n/a'
                    : emuValueForSelectedVariable.toFixed(2),
        },
        {
            label: 'Global Max',
            value: max.toFixed(2),
        },
        {
            label: 'Global Upper Quantile',
            value: upperQuantile.toFixed(2),
        },
        {
            label: 'Global Median',
            value: median.toFixed(2),
        },
        {
            label: 'Global Lower Quantile',
            value: lowerQuantile.toFixed(2),
        },
        {
            label: 'Global Min',
            value: min.toFixed(2),
        },
    ];
};
