import { IFeature } from '@esri/arcgis-rest-feature-service';
import { EmuOptimizedData } from '../../types/emu';
import {
    // EMU_OPTIMIZED_LAYER_URL,
    EMU_OPTIMIZED_LAYER_FIELDS,
    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
    OCEAN_NAME_CODE_VALUES,
} from './config';
import IWebMercatorUtils from 'esri/geometry/support/webMercatorUtils';
import { loadModules } from 'esri-loader';

const {
    OBJECTID,
    QTR_DEGREE_ID,
    UNIT_TOP,
    CLUSTER_CURRENT,
    THICKNESS_POS,
    OCEAN_NAME,
    TEMP_CURRENT,
    SALINITY_CURRENT,
    SILICATE_CURRENT,
    NITRATE_CURRENT,
    PHOSPHATE_CURRENT,
    DISS_O2_CURRENT,
} = EMU_OPTIMIZED_LAYER_FIELDS;

export const getQueryDistanceInMiles = (zoomLevel: number) => {
    zoomLevel = Math.round(zoomLevel);

    if (zoomLevel <= 2) {
        return 20;
    } else if (zoomLevel <= 5) {
        return 15;
    } else if (zoomLevel <= 8) {
        return 10;
    } else {
        return 5;
    }
};

export const getOceanName = (code: number) => {
    return OCEAN_NAME_CODE_VALUES.find((d) => d.code === code)?.name;
};

// only return the fields that will be used by the app
export const formatEmuOptimizedData = (
    features: IFeature[]
): EmuOptimizedData[] => {
    const qtrDegreeId = features[0].attributes[QTR_DEGREE_ID];

    return features
        .filter((feature) => {
            return feature.attributes[QTR_DEGREE_ID] === qtrDegreeId;
        })
        .map((feature) => {
            const { attributes } = feature;

            return {
                OBJECTID: attributes[OBJECTID],
                QtrDegreeID: attributes[QTR_DEGREE_ID],
                UnitTop: attributes[UNIT_TOP],
                Cluster: attributes[CLUSTER_CURRENT],
                ThicknessPos: attributes[THICKNESS_POS],
                // the Ocean Name field from the service returns the numeric code from 1-10, therefore need to decode it to get the actual name
                OceanName: getOceanName(attributes[OCEAN_NAME]),

                TempCurrent:
                    attributes[TEMP_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                SalinityCurrent:
                    attributes[SALINITY_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                SilicateCurrent:
                    attributes[SILICATE_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                DissO2Current:
                    attributes[DISS_O2_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                PhosphateCurrent:
                    attributes[PHOSPHATE_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
                NitrateCurrent:
                    attributes[NITRATE_CURRENT] ||
                    PLACEHOLDER_VALUE_FOR_MISSING_EMU_VALUE,
            };
        });
};

export const formatQueryLocation = async (x: number, y: number) => {
    type Modules = [typeof IWebMercatorUtils];

    try {
        const [webMercatorUtils] = await (loadModules([
            'esri/geometry/support/webMercatorUtils',
        ]) as Promise<Modules>);

        const [longitude, latitude] = webMercatorUtils.xyToLngLat(x, y);

        return {
            longitude,
            latitude,
        };
    } catch (err) {
        console.error(err);
    }
};
