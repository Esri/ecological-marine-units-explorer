import { loadModules } from 'esri-loader';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Sidebar, MapView, SceneView, InfoPanel, OverviewGlobe } from '../';
import { AppContext } from '../../contexts/AppContextProvider';
import { queryEmuDataUsingLocationFromHashParams } from '../../store/EMU/thunks';

const Layout = () => {
    const dispatch = useDispatch();

    const { isMobileDevice } = useContext(AppContext);

    useEffect(() => {
        dispatch(queryEmuDataUsingLocationFromHashParams());
    }, []);

    return (
        <>
            <Sidebar />
            <MapView />
            <SceneView />
            <InfoPanel />
            {!isMobileDevice && <OverviewGlobe />}
        </>
    );
};

export default Layout;
