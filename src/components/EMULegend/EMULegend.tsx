import classNames from 'classnames';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectEmuOptmizedData } from '../../store/EMU/selectors';
import { objectIdOfHighlightedEmuOptimizedFeatureChanged } from '../../store/Map/reducer';

import { selectObjectIdOfHighlightedEmuOptimizedFeature } from '../../store/Map/selectors';

import { getEmuColorById } from '../../utils/emu';
import { TooltipData, tooltipDataChanged } from '../../store/UI/reducer';

const EMULegend = () => {
    const dispatch = useDispatch();

    const emuOptimizedData = useSelector(selectEmuOptmizedData);

    const objectIdOfHighlightedEmuOptimizedFeature = useSelector(
        selectObjectIdOfHighlightedEmuOptimizedFeature
    );

    if (!emuOptimizedData || !emuOptimizedData.length) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="info-panel-item-header flex items-end">
                <div className="w-2/5 text-center">
                    <span>EMU</span>
                </div>

                <div className="w-3/5 text-center">
                    <span>Depth and (Thickness) m</span>
                </div>
            </div>

            <div className="relative h-info-panel-item-content flex flex-col font-size--2 bg-gradient-transparent-to-semi-black">
                {emuOptimizedData.map((d) => {
                    const { Cluster, ThicknessPos, UnitTop, OBJECTID } = d;

                    const isHighlighed =
                        OBJECTID === objectIdOfHighlightedEmuOptimizedFeature;

                    return (
                        <div
                            key={OBJECTID}
                            className={classNames(
                                'flex flex-grow items-center text-white text-shadow-black cursor-pointer box-border border'
                            )}
                            style={{
                                backgroundColor: getEmuColorById(Cluster),
                                borderColor: isHighlighed
                                    ? '#00FFFF'
                                    : 'transparent',
                            }}
                            onClick={() => {
                                dispatch(
                                    objectIdOfHighlightedEmuOptimizedFeatureChanged(
                                        OBJECTID
                                    )
                                );
                            }}
                            onMouseEnter={() => {
                                const tooltipData: TooltipData = {
                                    // emuKey: Cluster,
                                    // thickness: ThicknessPos,
                                    // depth: UnitTop,
                                    emuOptimizedData: d,
                                };
                                dispatch(tooltipDataChanged(tooltipData));
                            }}
                            onMouseLeave={() => {
                                dispatch(tooltipDataChanged(null));
                            }}
                        >
                            <div className="w-2/5 text-center z-10">
                                <span className="">{Cluster}</span>
                            </div>

                            <div className="w-3/5 text-center z-10">
                                <span>{`${UnitTop} (${ThicknessPos})`}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EMULegend;
