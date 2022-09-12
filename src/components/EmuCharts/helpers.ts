import { PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE } from '../../services/emu-data/config';
import {
    EmuChangeData,
    EmuData,
    EmuDataKey,
    EmuOptimizedData,
} from '../../types/emu';
import { getEmuColorById } from '../../utils/emu';
import { EmuChangeIndicatorData } from './EmuChangeIndicators';
import { ScatterplotDataItem } from './Scatterplot';
import { StackedAreaDataItem } from './StackedArea';

export const getEmuChangeIndicatorsData = (
    emuChangeData: Partial<EmuChangeData>[],
    emuData: Partial<EmuData>[]
): EmuChangeIndicatorData[] => {
    if (!emuChangeData || !emuChangeData.length) {
        return [];
    }

    const totalThickness = emuData.reduce((total, curr) => {
        return total + curr.ThicknessPos;
    }, 0);

    return emuChangeData.map((item) => {
        const { ThicknessPos, UnitTop } = item;

        return {
            topPosInPct: (Math.abs(UnitTop) / totalThickness) * 100,
            heightInPct: (ThicknessPos / totalThickness) * 100,
            data: item,
        } as EmuChangeIndicatorData;
    });
};

export const getStackedAreaData = (
    emuOptimizedData: Partial<EmuOptimizedData>[]
): StackedAreaDataItem[] => {
    if (!emuOptimizedData || !emuOptimizedData.length) {
        return [];
    }

    const totalThickness = emuOptimizedData.reduce((total, curr) => {
        return total + curr.ThicknessPos;
    }, 0);

    return emuOptimizedData.map((item) => {
        const { ThicknessPos, Cluster } = item;

        return {
            heightInPct: (ThicknessPos / totalThickness) * 100,
            fillColor: getEmuColorById(Cluster),
            data: item,
        } as StackedAreaDataItem;
    });
};

export const getScatterPlotData = (
    emuData: Partial<EmuData>[],
    key: EmuDataKey
): ScatterplotDataItem[] => {
    const data: ScatterplotDataItem[] = [];

    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    for (const item of emuData) {
        const { UnitTop, OBJECTID } = item;

        const x = item[key];
        const y = UnitTop;

        if (x === PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE) {
            continue;
        }

        xMin = Math.min(xMin, x);
        xMax = Math.max(xMax, x);

        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);

        data.push({
            // use a combination of object id and field name so we can distinguish current vs previous data
            key: `${OBJECTID}-${key}`,
            x,
            y,
            data: item,
        });
    }

    xMin = Math.floor(xMin);
    xMax = Math.ceil(xMax);
    yMin = Math.floor(yMin);
    yMax = Math.ceil(yMax);

    const xRange = Math.abs(xMax - xMin);
    const yRange = Math.abs(yMax - yMin);

    // console.log(xMin, xMax, xRange, yMin, yMax, yRange)

    for (const item of data) {
        const { x, y } = item;

        const translateXByPct = Math.abs(x - xMin) / xRange;
        const translateYByPct = 1 - Math.abs(y - yMin) / yRange;

        // console.log(x, translateXByPct, y, translateYByPct)

        item.translateXByPct = translateXByPct * 100;
        item.translateYByPct = translateYByPct * 100;
    }

    return data;
};
