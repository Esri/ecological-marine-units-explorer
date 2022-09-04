export type EmuOptimizedData = {
    OBJECTID: number;
    QtrDegreeID: number;
    UnitTop: number;
    Cluster: number;
    ThicknessPos: number;
    OceanName: string;

    TempCurrent: number;
    SalinityCurrent: number;
    DissO2Current: number;
    PhosphateCurrent: number;
    NitrateCurrent: number;
    SilicateCurrent: number;
};

export type EmuData = {
    OBJECTID: number;
    QtrDegreeID: number;
    UnitTop: number;
    Cluster: number;
    ThicknessPos: number;
    // OceanName: number;

    TempCurrent: number;
    SalinityCurrent: number;
    DissO2Current: number;
    PhosphateCurrent: number;
    NitrateCurrent: number;
    SilicateCurrent: number;

    TempPrev: number;
    SalinityPrev: number;
    DissO2Prev: number;
    PhosphatePrev: number;
    NitratePrev: number;
    SilicatePrev: number;
};

export type EmuChangeData = {
    OBJECTID: number;
    ClusterCurrent: number;
    ClusterPrev: number;
    OceanName: string;

    UnitTop: number;
    ThicknessPos: number;

    TempDiff: number;
    SalinityDiff: number;
    DissO2Diff: number;
    PhosphateDiff: number;
    NitrateDiff: number;
    SilicateDiff: number;
};

export type EmuDataKey = keyof EmuData;

export type EmuVariable =
    | 'Temperature'
    | 'Salinity'
    | 'Dissolved O2'
    | 'Phosphate'
    | 'Nitrate'
    | 'Silicate';
