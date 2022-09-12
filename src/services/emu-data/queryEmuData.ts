import {
    IFeature,
    IQueryFeaturesResponse,
    queryFeatures,
} from '@esri/arcgis-rest-feature-service';
import { EmuChangeData, EmuData } from '../../types/emu';
import {
    EMU_LAYER_URL,
    EMU_LAYER_FIELDS,
    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
} from './config';
import { getOceanName } from './helpers';

const {
    OBJECTID,
    QTR_DEGREE_ID,
    UNIT_TOP,
    CLUSTER_CURRENT,
    CLUSTER_PREV,
    THICKNESS_POS,
    OCEAN_NAME,

    TEMP_CURRENT,
    TEMP_PREV,
    SALINITY_CURRENT,
    SALINITY_PREV,
    SILICATE_CURRENT,
    SILICATE_PREV,
    DISS_O2_CURRENT,
    DISS_O2_PREV,
    PHOSPHATE_CURRENT,
    PHOSPHATE_PREV,
    NITRATE_CURRENT,
    NITRATE_PREV,

    TEMP_DIFF,
    SALINITY_DIFF,
    SILICATE_DIFF,
    DISS_O2_DIFF,
    PHOSPHATE_DIFF,
    NITRATE_DIFF,
    EMU_CHANGE,
} = EMU_LAYER_FIELDS;

export const queryEmuDatabyQrtDegreeId = async (
    qrtDegreeId: number
): Promise<[EmuData[], EmuChangeData[]]> => {
    try {
        const res = (await queryFeatures({
            url: EMU_LAYER_URL,
            where: `${QTR_DEGREE_ID} = ${qrtDegreeId}`,
            outFields: Object.values(EMU_LAYER_FIELDS),
            returnGeometry: false,
        })) as IQueryFeaturesResponse;

        if (!res || !res.features.length) {
            return [[], []];
        }

        const emuData = res.features.map((feature) => {
            const { attributes } = feature;

            return {
                OBJECTID: attributes[OBJECTID],
                QtrDegreeID: attributes[QTR_DEGREE_ID],
                UnitTop: attributes[UNIT_TOP],
                Cluster: attributes[CLUSTER_CURRENT],
                ThicknessPos: attributes[THICKNESS_POS],
                // OceanName: attributes[OCEAN_NAME],

                TempCurrent:
                    attributes[TEMP_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                TempPrev:
                    attributes[TEMP_PREV] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,

                SalinityCurrent:
                    attributes[SALINITY_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                SalinityPrev:
                    attributes[SALINITY_PREV] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,

                SilicateCurrent:
                    attributes[SILICATE_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                SilicatePrev:
                    attributes[SILICATE_PREV] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,

                DissO2Current:
                    attributes[DISS_O2_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                DissO2Prev:
                    attributes[DISS_O2_PREV] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,

                PhosphateCurrent:
                    attributes[PHOSPHATE_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                PhosphatePrev:
                    attributes[PHOSPHATE_PREV] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,

                NitrateCurrent:
                    attributes[NITRATE_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                NitratePrev:
                    attributes[NITRATE_PREV] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
            };
        });

        const emuChangeData: EmuChangeData[] = res.features
            .filter((feature) => {
                const { attributes } = feature;
                return attributes[EMU_CHANGE] === 2;
            })
            .map((feature) => {
                const { attributes } = feature;

                return {
                    OBJECTID: attributes[OBJECTID],

                    ClusterCurrent: attributes[CLUSTER_CURRENT],
                    ClusterPrev: attributes[CLUSTER_PREV],
                    OceanName: getOceanName(attributes[OCEAN_NAME]),

                    UnitTop: attributes[UNIT_TOP],
                    ThicknessPos: attributes[THICKNESS_POS],

                    TempDiff: attributes[TEMP_DIFF],
                    SalinityDiff: attributes[SALINITY_DIFF],
                    DissO2Diff: attributes[DISS_O2_DIFF],
                    PhosphateDiff: attributes[PHOSPHATE_DIFF],
                    NitrateDiff: attributes[NITRATE_DIFF],
                    SilicateDiff: attributes[SILICATE_DIFF],
                };
            });

        return [emuData, emuChangeData];
        // console.log(res);
    } catch (err) {}
};
