import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { TooltipData, tooltipDataChanged } from '../../store/UI/reducer';
import { EmuChangeData, EmuVariable } from '../../types/emu';

export type EmuChangeIndicatorData = {
    topPosInPct: number;
    heightInPct: number;
    data: EmuChangeData;
};

type Props = {
    data: EmuChangeIndicatorData[];
    emuVariable: EmuVariable;
};

const EmuChangeIndicators: FC<Props> = ({ data, emuVariable }: Props) => {
    const dispatch = useDispatch();

    return (
        <>
            {data.map((d) => {
                const { topPosInPct, heightInPct, data } = d;
                const { OBJECTID } = data;

                return (
                    <div
                        key={OBJECTID}
                        className="absolute left-0 w-full opacity-90"
                        style={{
                            top: `${topPosInPct}%`,
                            height: `${heightInPct}%`,
                            background: 'red',
                        }}
                        onMouseEnter={() => {
                            const tooltipData: TooltipData = {
                                emuChangeData: data,
                            };
                            dispatch(tooltipDataChanged(tooltipData));
                        }}
                        onMouseLeave={() => {
                            dispatch(tooltipDataChanged(null));
                        }}
                    ></div>
                );
            })}
        </>
    );
};

export default EmuChangeIndicators;
