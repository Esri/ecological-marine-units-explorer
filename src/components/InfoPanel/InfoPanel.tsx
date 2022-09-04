import React, { useEffect } from 'react';
import EMULegend from '../EMULegend/EMULegend';
import { EmuCharts } from '..';
import { useSelector } from 'react-redux';
import { selectShouldOpenInfoPanel } from '../../store/EMU/selectors';
import CloseBtn from './CloseBtn';
import { Tooltip } from '..';

const InfoPanel = () => {
    const shouldOpen = useSelector(selectShouldOpenInfoPanel);

    if (!shouldOpen) {
        return null;
    }

    return (
        <>
            <Tooltip />

            <div
                className="absolute left-0 bottom-0 right-0 md:top-auto p-4 box-border bg-black-opacity-80 overflow-hidden"
                style={{
                    zIndex: 1,
                }}
            >
                <CloseBtn />

                <div className="relative flex">
                    <div className="w-2/5 md:w-40 shrink-0">
                        <EMULegend />
                    </div>

                    <div className="w-3/5 md:w-auto md:grow">
                        <EmuCharts />
                    </div>
                </div>
            </div>
        </>
    );
};

export default InfoPanel;
