import React from 'react';
import SelectionCard from './SelectionCard';

import Basemap2D from '../../static/img/Asset_Basemap_2D.jpg';
import Basemap3D from '../../static/img/Asset_Basemap_3D.jpg';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { changeView } from '../../store/Map/thunks';
import { selectView } from '../../store/Map/selectors';
import { isSidebarOpenToggled } from '../../store/UI/reducer';
import { batch } from 'react-redux';

const BasemapSelector = () => {
    const dispatch = useDispatch();

    const selectedView = useSelector(selectView);

    return (
        <div className="py-2">
            <h4 className="text-custom-light-blue font-semibold">Basemap</h4>

            <div className="flex justify-between">
                <SelectionCard
                    title="2D"
                    description="Rapid top-down view capable of a global view"
                    backgroundImage={Basemap2D}
                    isSelected={selectedView === '2d'}
                    onSelect={() => {
                        batch(() => {
                            dispatch(changeView('2d'));
                            dispatch(isSidebarOpenToggled());
                        });
                    }}
                />

                <SelectionCard
                    title="3D"
                    description="Immersive view of actual EMU water columns"
                    backgroundImage={Basemap3D}
                    isSelected={selectedView === '3d'}
                    onSelect={() => {
                        batch(() => {
                            dispatch(changeView('3d'));
                            dispatch(isSidebarOpenToggled());
                        });
                    }}
                />
            </div>
        </div>
    );
};

export default BasemapSelector;
