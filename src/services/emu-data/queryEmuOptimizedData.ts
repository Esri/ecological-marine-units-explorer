import IPoint from 'esri/geometry/Point';
import { EMU_OPTIMIZED_LAYER_URL, EMU_OPTIMIZED_LAYER_FIELDS } from './config';
import {
    IQueryFeaturesResponse,
    queryFeatures,
} from '@esri/arcgis-rest-feature-service';
import { EmuOptimizedData } from '../../types/emu';
import {
    formatEmuOptimizedData,
    formatQueryLocation,
    getQueryDistanceInMiles,
} from './helpers';
import { QueryLocation } from '../../store/EMU/reducer';

const { UNIT_TOP } = EMU_OPTIMIZED_LAYER_FIELDS;

type QueryEmuOptimizedDataResponse = {
    results: EmuOptimizedData[];
    queryLocation: QueryLocation;
};

export const queryEmuOptimizedDataByLocation = async (
    point: IPoint,
    zoomLevel: number
): Promise<QueryEmuOptimizedDataResponse> => {
    try {
        const res = (await queryFeatures({
            url: EMU_OPTIMIZED_LAYER_URL,
            distance: getQueryDistanceInMiles(zoomLevel),
            units: 'esriSRUnit_StatuteMile',
            geometry: point,
            geometryType: 'esriGeometryPoint',
            outFields: Object.values(EMU_OPTIMIZED_LAYER_FIELDS),
            orderByFields: `${UNIT_TOP} desc`,
            outSR: {
                wkid: 102100,
            },
            returnGeometry: true,
            spatialRel: 'esriSpatialRelIntersects',
        })) as IQueryFeaturesResponse;

        if (!res || !res?.features.length) {
            return null;
        }

        const geometry = res.features[0].geometry as IPoint;
        const queryLocation = await formatQueryLocation(geometry.x, geometry.y);

        return {
            results: formatEmuOptimizedData(res.features),
            queryLocation,
        };
    } catch (err) {
        console.error('failed to query emu by location');
        throw err;
    }
};
