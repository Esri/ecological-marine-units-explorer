import React from 'react';
import { useSelector } from 'react-redux';
import { WEB_SCENE_ID } from './config';
import { extentChanged } from '../../store/Map/reducer';
import { updateViewpoint } from '../../store/Map/thunks';

import {
    selectView,
    selectViewpoint,
    selectShouldShowChangeLayer,
} from '../../store/Map/selectors';
import {
    Widgets,
    ViewEventHandlers,
    EMUChangeLayer3D,
    QueryLocationGraphic,
    EMU2018OptimizedLayerHighlight,
} from '../';
import SceneView from './SceneView';
import { useDispatch } from 'react-redux';
import { queryEmuData } from '../../store/EMU/thunks';
import { batch } from 'react-redux';

const SceneViewContainer = () => {
    const dispatch = useDispatch();

    const view = useSelector(selectView);

    const viewpointInfo = useSelector(selectViewpoint);

    const showChangeLayer = useSelector(selectShouldShowChangeLayer);

    if (view !== '3d') {
        return null;
    }

    return (
        <SceneView webSceneId={WEB_SCENE_ID} viewpointInfo={viewpointInfo}>
            <ViewEventHandlers
                viewpointOnChange={(viewpoint, extent) => {
                    // console.log(viewpoint)
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
            <EMUChangeLayer3D visible={showChangeLayer} />
            <QueryLocationGraphic />
            <EMU2018OptimizedLayerHighlight />
        </SceneView>
    );
};

export default SceneViewContainer;
