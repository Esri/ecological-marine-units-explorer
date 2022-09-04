import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { isSidebarOpenToggled } from '../../store/UI/reducer';

import { selectIsSidebarOpen } from '../../store/UI/selectors';

import Sidebar from './Sidebar';

const SidebarContainer = () => {
    const dispatch = useDispatch();

    const isSidebarOpen = useSelector(selectIsSidebarOpen);

    // if(!isSidebarOpen){
    //     return null;
    // }

    return (
        <Sidebar
            isSidebarOpen={isSidebarOpen}
            sidebarOnClose={() => {
                dispatch(isSidebarOpenToggled());
            }}
        />
    );
};

export default SidebarContainer;
