import React from 'react';
import SelectionCard from './SelectionCard';
import ContentChange from '../../static/img/Asset_Content_Change.jpg';
import ContentEMU from '../../static/img/Asset_Content_EMU.jpg';
import { useSelector } from 'react-redux';
import { selectShouldShowChangeLayer } from '../../store/Map/selectors';
import { updateShowChangeLayer } from '../../store/Map/thunks';
import { useDispatch } from 'react-redux';
import { batch } from 'react-redux';
import { isSidebarOpenToggled } from '../../store/UI/reducer';

const ContentSelector = () => {
    const dispatch = useDispatch();

    const showChangeLayer = useSelector(selectShouldShowChangeLayer);

    return (
        <div className="pt-4 pb-2 border-t border-custom-blue border-opacity-50">
            <h4 className="text-custom-light-blue font-semibold">Conetnt</h4>

            <div className="flex">
                <SelectionCard
                    title="Current EMUs"
                    description="The latest version of Ecological Marine Units, calculated in 2018"
                    backgroundImage={ContentEMU}
                    isSelected={showChangeLayer === false}
                    onSelect={() => {
                        batch(() => {
                            dispatch(updateShowChangeLayer(false));
                            dispatch(isSidebarOpenToggled());
                        });
                    }}
                />

                <SelectionCard
                    title="EMU Change, 2013-2018"
                    description="Where EMU classification has changed due to phenomena or underlying model improvements"
                    backgroundImage={ContentChange}
                    isSelected={showChangeLayer === true}
                    onSelect={() => {
                        batch(() => {
                            dispatch(updateShowChangeLayer(true));
                            dispatch(isSidebarOpenToggled());
                        });
                    }}
                />
            </div>
        </div>
    );
};

export default ContentSelector;
