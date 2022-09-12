import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WEB_MAP_ID } from './config';
import { extentChanged } from '../../store/Map/reducer';
import { updateViewpoint } from '../../store/Map/thunks';

import {
    selectView,
    selectViewpoint,
    selectShouldShowChangeLayer,
} from '../../store/Map/selectors';

import MapView from './MapView';
import {
    Widgets,
    EMUBoundaryLayer,
    ViewEventHandlers,
    QueryLocationGraphic,
    DepthSlider,
    EMUChangeLayer2D,
} from '../';
import { queryEmuData } from '../../store/EMU/thunks';
import { batch } from 'react-redux';

const MapViewContainer = () => {
    const dispatch = useDispatch();

    const view = useSelector(selectView);

    const viewpointInfo = useSelector(selectViewpoint);

    const showChangeLayer = useSelector(selectShouldShowChangeLayer);

    if (view !== '2d') {
        return null;
    }

    return (
        <>
            <MapView webmapId={WEB_MAP_ID} viewpointInfo={viewpointInfo}>
                <ViewEventHandlers
                    viewpointOnChange={(viewpoint, extent) => {
                        console.log(viewpoint);
                        batch(() => {
                            dispatch(updateViewpoint(viewpoint));
                            dispatch(extentChanged(extent));
                        });
                    }}
                    onClickHandler={(mapPoint, zoomLevel) => {
                        dispatch(queryEmuData(mapPoint, zoomLevel));
                    }}
                />
                <Widgets />
                <EMUBoundaryLayer />
                <EMUChangeLayer2D visible={showChangeLayer} />
                <QueryLocationGraphic />
            </MapView>
            <DepthSlider />
        </>
    );
};

export default MapViewContainer;
