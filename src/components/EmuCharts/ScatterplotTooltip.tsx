import React from 'react';
import { useSelector } from 'react-redux';
import { selectScatterplotTooltipData } from '../../store/UI/selectors';
import { getEmuUnit } from '../../utils/emu';

const WIDTH = 155;

const ScatterplotTooltip = () => {
    const data = useSelector(selectScatterplotTooltipData);

    if (!data) {
        return null;
    }

    const { xPos, yPos, emuValue, emuVariable, depth } = data;

    return (
        <div
            className="fixed p-1 font-size--2 text-custom-light-blue z-20 pointer-events-none"
            style={{
                width: WIDTH,
                top: yPos - 50,
                left: xPos - WIDTH,
                backgroundColor: `rgba(0,0,0,.8)`,
            }}
        >
            <div className="flex justify-between">
                <span>{emuVariable}</span>
                <span>
                    {emuValue.toFixed(2)} {getEmuUnit(emuVariable)}
                </span>
            </div>

            <div className="flex justify-between">
                <span>Depth</span>
                <span>{depth}m</span>
            </div>
        </div>
    );
};

export default ScatterplotTooltip;
