import { EmuVariable } from '../../types/emu';
import { EMU_INFO_DATA, EMU_UNITS, EMU_GLOBAL_SUMMARY_DATA } from './data';

type EMUInfo = typeof EMU_INFO_DATA[0];

export type GloablSummaryData = {
    max: number;
    upperQuantile: number;
    median: number;
    lowerQuantile: number;
    min: number;
};

const getMapFromList = <T extends { Cluster?: number }>(items: T[]) => {
    const map = new Map<number, T>();

    for (const item of items) {
        const { Cluster } = item;
        map.set(Cluster, item);
    }

    return map;
};

const emuDataByKey = getMapFromList(EMU_INFO_DATA);

const emuGlobalSummryDataByKey = getMapFromList(EMU_GLOBAL_SUMMARY_DATA);

export const getEmuColorById = (cluster: number) => {
    return getEmuInfoById(cluster)?.fill || 'transparent';
};

export const getEmuInfoById = (cluster: number): EMUInfo => {
    if (!emuDataByKey.has(cluster)) {
        return null;
    }

    return emuDataByKey.get(cluster);
};

export const getEmuInfo = () => {
    return EMU_INFO_DATA;
};

export const getEmuUnit = (emuVar: EmuVariable) => {
    return EMU_UNITS[emuVar];
};

const GlobalSummaryDataPropNamePrefix: Record<EmuVariable, string> = {
    Temperature: 'temp',
    'Dissolved O2': 'dissO2',
    Salinity: 'salinity',
    Nitrate: 'nitrate',
    Phosphate: 'phosphate',
    Silicate: 'silicate',
};

export const getGlobalSummaryData = (
    cluster: number,
    emuVariable: EmuVariable
): GloablSummaryData => {
    if (!emuGlobalSummryDataByKey.has(cluster)) {
        return null;
    }

    const data = emuGlobalSummryDataByKey.get(cluster);

    const propNamePrefix = GlobalSummaryDataPropNamePrefix[emuVariable];

    const max = data[`${propNamePrefix}_max`] as number;
    const upperQuantile = data[`${propNamePrefix}_Q3`] as number;
    const median = data[`${propNamePrefix}_median`] as number;
    const lowerQuantile = data[`${propNamePrefix}_Q1`] as number;
    const min = data[`${propNamePrefix}_min`] as number;

    return {
        max,
        upperQuantile,
        median,
        lowerQuantile,
        min,
    };
};
