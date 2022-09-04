import './Chart.css';
import React, { FC } from 'react';
import { ScatterplotDataItem } from './Scatterplot';
import { selectShouldShowChangeLayer } from '../../store/Map/selectors';
import { useSelector } from 'react-redux';
import Scatterplot from './Scatterplot';
import StackedArea, { StackedAreaDataItem } from './StackedArea';
import classNames from 'classnames';
import {
    tooltipDataChanged,
    tooltipXPositionChanged,
} from '../../store/UI/reducer';
import { useDispatch } from 'react-redux';
import { EmuVariable } from '../../types/emu';
import EmuChangeIndicators, {
    EmuChangeIndicatorData,
} from './EmuChangeIndicators';

type Props = {
    emuVariable: EmuVariable;
    // emu data from current release
    currentEmuData: ScatterplotDataItem[];
    // emu data from previous release
    previousEmuData: ScatterplotDataItem[];
    stackedAreaData: StackedAreaDataItem[];
    emuChangeIndicatorsData: EmuChangeIndicatorData[];
    shouldShowInNarrowScreen?: boolean;
};

const Chart: FC<Props> = ({
    emuVariable,
    currentEmuData,
    previousEmuData,
    stackedAreaData,
    emuChangeIndicatorsData,
    shouldShowInNarrowScreen,
}: Props) => {
    const dispatch = useDispatch();

    const showChangeData = useSelector(selectShouldShowChangeLayer);

    return (
        <div
            className={classNames('w-full md:w-1/6 shrink-0', {
                hidden: shouldShowInNarrowScreen === false,
                'md:block': true,
            })}
        >
            <div className="info-panel-item-header flex justify-center">
                <span>{emuVariable}</span>
            </div>
            <div
                className="h-info-panel-item-content relative bg-gradient-transparent-to-black"
                onMouseMove={(evt) => {
                    dispatch(tooltipXPositionChanged(evt.clientX));
                }}
                onMouseLeave={() => {
                    dispatch(tooltipXPositionChanged(null));
                    dispatch(tooltipDataChanged(null));
                }}
            >
                <StackedArea data={stackedAreaData} emuVariable={emuVariable} />
                {showChangeData && (
                    <EmuChangeIndicators
                        data={emuChangeIndicatorsData}
                        emuVariable={emuVariable}
                    />
                )}
                <Scatterplot
                    current={currentEmuData}
                    previous={previousEmuData}
                    showPrevData={showChangeData}
                    emuVariable={emuVariable}
                />
            </div>
        </div>
    );
};

export default Chart;
