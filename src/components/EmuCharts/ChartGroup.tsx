import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    selectEmuChangeData,
    selectEmuData,
    selectEmuOptmizedData,
} from '../../store/EMU/selectors';
import Chart from './Chart';
import ChartNavDots from './ChartNavDots';

import {
    getEmuChangeIndicatorsData,
    getScatterPlotData,
    getStackedAreaData,
} from './helpers';
import ScatterplotTooltip from './ScatterplotTooltip';

const ChartGroup = () => {
    const emuData = useSelector(selectEmuData);

    const emuOptimizedData = useSelector(selectEmuOptmizedData);

    const emuChangeData = useSelector(selectEmuChangeData);

    const [
        idxOfVisibleChartInMobileView,
        setIdxOfVisibleChartInMobileView,
    ] = useState<number>(0);

    const [
        tempCurrent,
        tempPrevious,
        salinityCurrent,
        salinityPrevious,
        dissO2Current,
        dissO2Previous,
        phosphateCurrent,
        phosphatePrevious,
        nitrateCurrent,
        nitratePrevious,
        silicateCurrent,
        silicatePrevious,
        stackedAreaData,
        emuChangeIndicatorsData,
    ] = useMemo(() => {
        return [
            getScatterPlotData(emuData, 'TempCurrent'),
            getScatterPlotData(emuData, 'TempPrev'),

            getScatterPlotData(emuData, 'SalinityCurrent'),
            getScatterPlotData(emuData, 'SalinityPrev'),

            getScatterPlotData(emuData, 'DissO2Current'),
            getScatterPlotData(emuData, 'DissO2Prev'),

            getScatterPlotData(emuData, 'PhosphateCurrent'),
            getScatterPlotData(emuData, 'PhosphatePrev'),

            getScatterPlotData(emuData, 'NitrateCurrent'),
            getScatterPlotData(emuData, 'NitratePrev'),

            getScatterPlotData(emuData, 'SilicateCurrent'),
            getScatterPlotData(emuData, 'SilicatePrev'),

            getStackedAreaData(emuOptimizedData),

            getEmuChangeIndicatorsData(emuChangeData, emuData),
        ];
    }, [emuData, emuOptimizedData, emuChangeData]);

    if (!emuData || !emuData.length) {
        return null;
    }

    return (
        <>
            <div className="w-full flex">
                <Chart
                    emuVariable={'Temperature'}
                    currentEmuData={tempCurrent}
                    previousEmuData={tempPrevious}
                    stackedAreaData={stackedAreaData}
                    emuChangeIndicatorsData={emuChangeIndicatorsData}
                    shouldShowInNarrowScreen={
                        idxOfVisibleChartInMobileView === 0
                    }
                />

                <Chart
                    emuVariable={'Salinity'}
                    currentEmuData={salinityCurrent}
                    previousEmuData={salinityPrevious}
                    stackedAreaData={stackedAreaData}
                    emuChangeIndicatorsData={emuChangeIndicatorsData}
                    shouldShowInNarrowScreen={
                        idxOfVisibleChartInMobileView === 1
                    }
                />

                <Chart
                    emuVariable={'Dissolved O2'}
                    currentEmuData={dissO2Current}
                    previousEmuData={dissO2Previous}
                    stackedAreaData={stackedAreaData}
                    emuChangeIndicatorsData={emuChangeIndicatorsData}
                    shouldShowInNarrowScreen={
                        idxOfVisibleChartInMobileView === 2
                    }
                />

                <Chart
                    emuVariable={'Phosphate'}
                    currentEmuData={phosphateCurrent}
                    previousEmuData={phosphatePrevious}
                    stackedAreaData={stackedAreaData}
                    emuChangeIndicatorsData={emuChangeIndicatorsData}
                    shouldShowInNarrowScreen={
                        idxOfVisibleChartInMobileView === 3
                    }
                />

                <Chart
                    emuVariable={'Nitrate'}
                    currentEmuData={nitrateCurrent}
                    previousEmuData={nitratePrevious}
                    stackedAreaData={stackedAreaData}
                    emuChangeIndicatorsData={emuChangeIndicatorsData}
                    shouldShowInNarrowScreen={
                        idxOfVisibleChartInMobileView === 4
                    }
                />

                <Chart
                    emuVariable={'Silicate'}
                    currentEmuData={silicateCurrent}
                    previousEmuData={silicatePrevious}
                    stackedAreaData={stackedAreaData}
                    emuChangeIndicatorsData={emuChangeIndicatorsData}
                    shouldShowInNarrowScreen={
                        idxOfVisibleChartInMobileView === 5
                    }
                />
            </div>

            <ChartNavDots
                idxOfActiveItem={idxOfVisibleChartInMobileView}
                onSelect={setIdxOfVisibleChartInMobileView}
                prevBtnOnClick={() => {
                    const newIdx =
                        idxOfVisibleChartInMobileView - 1 < 0
                            ? 5
                            : idxOfVisibleChartInMobileView - 1;
                    setIdxOfVisibleChartInMobileView(newIdx);
                }}
                nextBtnOnClick={() => {
                    const newIdx =
                        idxOfVisibleChartInMobileView + 1 > 5
                            ? 0
                            : idxOfVisibleChartInMobileView + 1;
                    setIdxOfVisibleChartInMobileView(newIdx);
                }}
            />

            <ScatterplotTooltip />
        </>
    );
};

export default ChartGroup;
