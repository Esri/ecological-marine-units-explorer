export const EMU_OPTIMIZED_LAYER_URL =
    'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/EMU_2018_Optimized/FeatureServer/1';

export const EMU_OPTIMIZED_LAYER_FIELDS = {
    OBJECTID: 'OBJECTID',
    QTR_DEGREE_ID: 'QtrDegreeID',
    UNIT_TOP: 'UnitTop',
    CLUSTER_CURRENT: 'Cluster_2018',
    THICKNESS_POS: 'ThicknessPos',
    OCEAN_NAME: 'OceanName',

    TEMP_CURRENT: 'temp_2018',
    SALINITY_CURRENT: 'salinity_2018',
    DISS_O2_CURRENT: 'dissO2_2018',
    PHOSPHATE_CURRENT: 'phosphate_2018',
    NITRATE_CURRENT: 'nitrate_2018',
    SILICATE_CURRENT: 'silicate_2018',
};

export const EMU_LAYER_URL =
    'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/EMU_2018/FeatureServer/0';

export const EMU_LAYER_FIELDS = {
    OBJECTID: 'OBJECTID',
    QTR_DEGREE_ID: 'QtrDegreeID',
    UNIT_TOP: 'UnitTop',
    CLUSTER_PREV: 'Cluster_2013',
    CLUSTER_CURRENT: 'Cluster_2018',
    THICKNESS_POS: 'ThicknessPos',
    OCEAN_NAME: 'OceanName',

    TEMP_CURRENT: 'temp_2018',
    SALINITY_CURRENT: 'salinity_2018',
    DISS_O2_CURRENT: 'dissO2_2018',
    PHOSPHATE_CURRENT: 'phosphate_2018',
    NITRATE_CURRENT: 'nitrate_2018',
    SILICATE_CURRENT: 'silicate_2018',

    TEMP_PREV: 'temp_2013',
    SALINITY_PREV: 'salinity_2013',
    DISS_O2_PREV: 'dissO2_2013_2018_units',
    PHOSPHATE_PREV: 'phosphate_2013_2018_units',
    NITRATE_PREV: 'nitrate_2013_2018_units',
    SILICATE_PREV: 'silicate_2013_2018_units',

    TEMP_DIFF: 'Temp_Diff',
    SALINITY_DIFF: 'salinity_diff',
    DISS_O2_DIFF: 'dissO2_diff',
    PHOSPHATE_DIFF: 'phosphate_diff',
    NITRATE_DIFF: 'nitrate_diff',
    SILICATE_DIFF: 'silicate_diff',
    // Indicates if EMU data changed from 2013 to 2018, Coded Values: [1: No], [2: Yes]
    EMU_CHANGE: 'EMU_Change_2013_to_2018',
};

export const PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE = -99999;

export const OCEAN_NAME_CODE_VALUES = [
    {
        name: 'Arctic',
        code: 1,
    },
    {
        name: 'Baltic Sea',
        code: 2,
    },
    {
        name: 'Indian Ocean',
        code: 3,
    },
    {
        name: 'Mediterranean Sea',
        code: 4,
    },
    {
        name: 'North Atlantic',
        code: 5,
    },
    {
        name: 'North Pacific',
        code: 6,
    },
    {
        name: 'South Atlantic',
        code: 7,
    },
    {
        name: 'South China Sea',
        code: 8,
    },
    {
        name: 'South Pacific',
        code: 9,
    },
    {
        name: 'Southern',
        code: 10,
    },
];
