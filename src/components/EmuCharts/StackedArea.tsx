import React, { FC } from 'react';
import { EmuOptimizedData, EmuVariable } from '../../types/emu';
import { TooltipData, tooltipDataChanged } from '../../store/UI/reducer';
import { useDispatch } from 'react-redux';

export type StackedAreaDataItem = {
    heightInPct: number;
    fillColor: string;
    data: EmuOptimizedData;
};

type Props = {
    data: StackedAreaDataItem[];
    emuVariable: EmuVariable;
};

const StackedArea: FC<Props> = ({ data, emuVariable }: Props) => {
    const dispatch = useDispatch();

    if (!data || !data.length) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full">
            {data.map((item) => {
                const { heightInPct, fillColor, data } = item;

                return (
                    <div
                        key={data.OBJECTID}
                        className="w-full"
                        style={{
                            height: `${heightInPct}%`,
                            backgroundColor: fillColor,
                        }}
                        onMouseEnter={() => {
                            const tooltipData: TooltipData = {
                                selectedEmuVariable: emuVariable,
                                emuOptimizedData: data,
                                showGlobalStats: true,
                            };
                            console.log(data);
                            dispatch(tooltipDataChanged(tooltipData));
                        }}
                        // onMouseLeave={() => {
                        //     dispatch(tooltipDataChanged(null));
                        // }}
                    ></div>
                );
            })}
        </div>
    );
};

export default StackedArea;
