import React, { FC } from 'react';
import { GloablSummaryData } from '../../utils/emu';

type Props = {
    data: GloablSummaryData;
};

const HEIGHT = 9;

const WhiskerPlot: FC<Props> = ({ data }: Props) => {
    const { min, max, median, lowerQuantile, upperQuantile } = data;

    const range = Math.abs(max - min);

    const medianXPos = Math.abs(median - min) / range;

    const plotBoxXPos = Math.abs(lowerQuantile - min) / range;

    const plotBoxWidth = (upperQuantile - lowerQuantile) / range;

    return (
        <div
            className="relative w-full border-l border-r border-gray-200 border-opacity-30 mb-2"
            style={{
                height: HEIGHT,
            }}
        >
            {/* full width horizontal line in mid of container */}
            <div
                className="w-full"
                style={{
                    position: 'absolute',
                    top: `calc(50% - 1px)`,
                    left: 0,
                    height: 1,
                    background: 'rgba(255,255,255,.4)',
                }}
            ></div>

            {/* plot box indicates the range between lower quantile and upper quantile */}
            <div
                style={{
                    position: 'absolute',
                    left: `${plotBoxXPos * 100}%`,
                    width: `${plotBoxWidth * 100}%`,
                    height: 5,
                    top: `20%`,
                    background: `rgba(255,255,255,.5)`,
                }}
            ></div>

            {/* dot indicates median value */}
            <div
                className="rounded-full"
                style={{
                    width: 10,
                    height: 10,
                    position: 'absolute',
                    background: 'rgba(255,255,255,.9)',
                    top: `calc(50% - 6px)`,
                    left: `${medianXPos * 100}%`,
                }}
            ></div>
        </div>
    );
};

export default WhiskerPlot;
