import React, { FC, useEffect, useRef } from 'react';
import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import { loadModules } from 'esri-loader';
import {
    EMU_2018_BOUNDARY_LAYER_ID,
    EMU_2018_BOUNDARY_LAYER_FIELDS,
} from './config';
import { useSelector } from 'react-redux';
import { selectEmuLayerDepthLevel } from '../../store/Map/selectors';

const { DEPTH_LEVEL } = EMU_2018_BOUNDARY_LAYER_FIELDS;

type Props = {
    mapView?: IMapView;
};

const EMUBoundaryLayer: FC<Props> = ({ mapView }: Props) => {
    const depthLevel = useSelector(selectEmuLayerDepthLevel);

    const layerRef = useRef<IFeatureLayer>();

    const init = async () => {
        type Modules = [typeof IFeatureLayer];

        try {
            const [FeatureLayer] = await (loadModules([
                'esri/layers/FeatureLayer',
            ]) as Promise<Modules>);

            layerRef.current = new FeatureLayer({
                portalItem: {
                    id: EMU_2018_BOUNDARY_LAYER_ID,
                },
                outFields: [DEPTH_LEVEL],
                definitionExpression: `${DEPTH_LEVEL} = ${depthLevel}`,
                opacity: 0.7,
            });

            mapView.map.add(layerRef.current);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (mapView) {
            init();
        }
    }, [mapView]);

    useEffect(() => {
        if (layerRef.current) {
            layerRef.current.definitionExpression = `${DEPTH_LEVEL} = ${depthLevel}`;
        }
    }, [depthLevel]);

    return null;
};

export default EMUBoundaryLayer;
