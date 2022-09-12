import { urlFns } from 'helper-toolkit-ts';
import { QueryLocation } from '../../store/EMU/reducer';
import { CameraInfo, View, ViewPointInfo } from '../../store/Map/reducer';

type UrlHashParamKey = 'view' | 'showChange' | 'query' | 'viewpoint' | 'camera';

type HashParams = Partial<Record<UrlHashParamKey, string>>;

type GetDataFromHashParamsResponse = {
    view?: View;
    showChangeLayer?: boolean;
    query?: {
        queryLocation: QueryLocation;
        zoom: number;
    };
    viewpoint?: ViewPointInfo;
};

// export const DEFAULT_HASH_PARAMS: HashParams = urlFns.parseHash();

export const getDataFromHashParams = (): GetDataFromHashParamsResponse => {
    const parsed: HashParams = urlFns.parseHash() || {};

    const { view, showChange, query, viewpoint, camera } = parsed;

    const res: GetDataFromHashParamsResponse = {};

    if (view) {
        if (view === '2d' || view === '3d') {
            res.view = view as View;
        }
    }

    if (showChange) {
        if (showChange === 'true' || showChange === 'false') {
            res.showChangeLayer = showChange === 'true';
        }
    }

    if (query) {
        const [longitude, latitude, zoom] = query.split(',').map((d) => +d);

        res.query = {
            queryLocation: {
                longitude,
                latitude,
            },
            zoom,
        };
    }

    if (viewpoint || camera) {
        res.viewpoint = decodeViewpointData(viewpoint, camera);
    }

    return res;
};

export const saveViewInHashParam = (view: View) => {
    setHashParam('view', view);
};

export const saveShowChangeLayerInHashParam = (shouldShow: boolean) => {
    setHashParam('showChange', shouldShow ? 'true' : 'false');
};

export const saveQueryInHashParam = (
    queryLocation?: QueryLocation,
    zoom?: number
) => {
    if (queryLocation === undefined || zoom === undefined) {
        setHashParam('query', '');
        return;
    }

    const { longitude, latitude } = queryLocation;

    const values = [longitude.toFixed(3), latitude.toFixed(3), zoom.toFixed(0)];

    setHashParam('query', values.join(','));
};

export const saveViewpointInHashParam = (viewpoint: ViewPointInfo) => {
    const {
        rotation,
        scale,
        targetGeometry: { x, y, z, spatialReference },
        camera,
    } = viewpoint;

    // console.log(rotation, scale, x, y, z, spatialReference.wkid, camera)

    const values = [
        rotation.toFixed(0),
        scale.toFixed(0),
        spatialReference.wkid,
        x.toFixed(3),
        y.toFixed(3),
        z?.toFixed(3),
    ].join(',');

    setHashParam('viewpoint', values);

    saveCameraInHashParam(camera);
};

const saveCameraInHashParam = (camera: CameraInfo) => {
    if (!camera) {
        setHashParam('camera', '');
        return;
    }

    const {
        heading,
        tilt,
        position: { x, y, z, spatialReference },
    } = camera;

    // console.log(heading, tilt, x, y, z, spatialReference.wkid)

    const values = [
        heading.toFixed(0),
        tilt.toFixed(0),
        spatialReference.wkid,
        x.toFixed(3),
        y.toFixed(3),
        z?.toFixed(3),
    ].join(',');

    setHashParam('camera', values);
};

const decodeViewpointData = (
    viewpointStr: string,
    cameraStr: string
): ViewPointInfo => {
    const [rotation, scale, wkid, x, y, z] = viewpointStr
        .split(',')
        .map((d) => +d);

    const viewpoint: ViewPointInfo = {
        rotation,
        scale,
        targetGeometry: {
            x,
            y,
            z,
            spatialReference: {
                wkid,
            },
        },
    };

    if (cameraStr) {
        const [heading, tilt, wkid, x, y, z] = cameraStr
            .split(',')
            .map((d) => +d);

        viewpoint.camera = {
            heading,
            tilt,
            position: {
                spatialReference: {
                    wkid,
                },
                x,
                y,
                z,
            },
        };
    }

    return viewpoint;
};

const setHashParam = (key: UrlHashParamKey, value: string) => {
    urlFns.updateHashParam({
        key,
        value,
    });
};
