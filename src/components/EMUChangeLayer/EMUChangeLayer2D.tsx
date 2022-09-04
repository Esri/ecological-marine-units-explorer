import React, { FC, useEffect, useRef } from 'react';
import IMapView from 'esri/views/MapView';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import { loadModules } from 'esri-loader';
import {
    EMU_2018_CHANGE_LAYER_ID_2D,
    EMU_2018_CHANGE_LAYER_FIELDS_2D,
} from './config';
import { useSelector } from 'react-redux';
import { selectEmuLayerDepthLevel } from '../../store/Map/selectors';

type Props = {
    mapView?: IMapView;
    visible?: boolean;
};

const { DEPTH_LEVEL } = EMU_2018_CHANGE_LAYER_FIELDS_2D;

const EMUChangeLayer2D: FC<Props> = ({ mapView, visible }: Props) => {
    const depthLevel = useSelector(selectEmuLayerDepthLevel);

    const layerRef = useRef<IFeatureLayer>();

    const init = async () => {
        type Modules = [typeof IFeatureLayer];

        try {
            const [FeatureLayer] = await (loadModules([
                'esri/layers/FeatureLayer',
            ]) as Promise<Modules>);

            const layer = new FeatureLayer({
                portalItem: {
                    id: EMU_2018_CHANGE_LAYER_ID_2D,
                },
                visible,
                popupEnabled: false,
                definitionExpression: `${DEPTH_LEVEL} = ${depthLevel}`,
                renderer: {
                    type: 'simple',
                    symbol: {
                        type: 'simple-fill',
                        color: [255, 0, 0, 0.8],
                        style: 'solid',
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            color: [255, 255, 255, 0.1],
                            width: 1,
                        },
                    },
                } as any,
            });

            layerRef.current = layer;

            mapView.map.add(layer);
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
            layerRef.current.visible = visible;
        }
    }, [visible]);

    useEffect(() => {
        if (layerRef.current) {
            layerRef.current.definitionExpression = `${DEPTH_LEVEL} = ${depthLevel}`;
        }
    }, [depthLevel]);

    return null;
};

export default EMUChangeLayer2D;
