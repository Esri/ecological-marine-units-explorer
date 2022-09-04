import React, { FC, useMemo, useRef } from 'react';
import { TooltipData } from '../../store/UI/reducer';
// import { EmuVariable } from '../../types/emu';
import { getGlobalSummaryData } from '../../utils/emu';
import EMUInfo from './EMUInfo';
import {
    getTableDataFromEmuChangeData,
    getTableDataFromEmuOptimizedData,
    getTableDataFromGlobalSummaryData,
} from './helper';
import LocationInfo from './LocationInfo';
import Table from './Table';
import WhiskerPlot from './WhiskerPlot';

type Props = {
    data: TooltipData;
    xPosition?: number;
};

const TOOLTIP_WIDTH = 270;
const MARGIN_X_IN_PX = 8; // equivelant to .5rem

const Tootip: FC<Props> = ({ data, xPosition }: Props) => {
    const {
        emuOptimizedData,
        showGlobalStats,
        selectedEmuVariable,
        emuChangeData,
    } = data;

    const Cluster = useMemo(() => {
        if (emuOptimizedData) {
            return emuOptimizedData.Cluster;
        }

        if (emuChangeData) {
            return emuChangeData.ClusterCurrent;
        }

        return -1;
    }, [emuOptimizedData, emuChangeData]);

    const containerRef = useRef<HTMLDivElement>();

    const getLeftPos = () => {
        if (!xPosition) {
            return MARGIN_X_IN_PX;
        }

        let leftPos = xPosition - TOOLTIP_WIDTH / 2;

        if (leftPos + TOOLTIP_WIDTH >= window.innerWidth - MARGIN_X_IN_PX) {
            leftPos = window.innerWidth - TOOLTIP_WIDTH - MARGIN_X_IN_PX;
        }

        return `${leftPos}px`;
    };

    // global summary data for selected EMU cluster and variable, it includes min, max, lower quantile, upper quantile and median
    // it will be used in the table and WhiskerPlot
    const globalSummaryData = useMemo(() => {
        return showGlobalStats
            ? getGlobalSummaryData(Cluster, selectedEmuVariable)
            : null;
    }, [Cluster, selectedEmuVariable, showGlobalStats]);

    const tableData = useMemo(() => {
        if (globalSummaryData && showGlobalStats) {
            return getTableDataFromGlobalSummaryData(
                globalSummaryData,
                emuOptimizedData,
                selectedEmuVariable
            );
        }

        if (emuChangeData) {
            return getTableDataFromEmuChangeData(emuChangeData);
        }

        return getTableDataFromEmuOptimizedData(emuOptimizedData);
    }, [
        emuOptimizedData,
        selectedEmuVariable,
        globalSummaryData,
        showGlobalStats,
        emuChangeData,
    ]);

    return (
        <div
            ref={containerRef}
            className="absolute bottom-350px bg-custom-tooltip z-20 text-white box-border"
            style={{
                left: getLeftPos(),
                width: TOOLTIP_WIDTH,
                boxShadow: `0px 0px 4px 3px rgba(0, 0, 0, 0.70)`,
            }}
        >
            <EMUInfo EMUKey={Cluster} prevEMUKey={emuChangeData?.ClusterPrev} />

            <div className="p-2 font-size--2 text-custom-light-blue">
                {showGlobalStats && <WhiskerPlot data={globalSummaryData} />}

                <Table data={tableData} />

                <LocationInfo
                    depth={emuOptimizedData?.UnitTop || emuChangeData?.UnitTop}
                    thickness={
                        emuOptimizedData?.ThicknessPos ||
                        emuChangeData?.ThicknessPos
                    }
                    oceanName={
                        emuOptimizedData?.OceanName || emuChangeData?.OceanName
                    }
                />
            </div>
        </div>
    );
};

export default Tootip;
