import classNames from 'classnames';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { scatterplotTooltipChanged } from '../../store/UI/reducer';
import { EmuData, EmuVariable } from '../../types/emu';

export type ScatterplotDataItem = {
    key: string;
    x?: number;
    y?: number;
    translateXByPct?: number;
    translateYByPct?: number;
    label?: string;
    data: Partial<EmuData>;
};

type Props = {
    current: ScatterplotDataItem[];
    previous: ScatterplotDataItem[];
    showPrevData?: boolean;
    emuVariable?: EmuVariable;
};

const Scatterplot: FC<Props> = ({
    current,
    previous,
    showPrevData,
    emuVariable,
}: Props) => {
    const dispatch = useDispatch();

    if (!current || !current.length) {
        return null;
    }

    const getDots = (data: ScatterplotDataItem[], fillColor = '#fff') => {
        // console.log(data);

        return data.map((d) => {
            const { translateXByPct, translateYByPct, key, x, y } = d;

            return (
                <div
                    key={key}
                    className={classNames(
                        `absolute rounded-full pointer-events-auto`
                    )}
                    onMouseOver={(evt) => {
                        // console.log('mouse enter scatterplote dot')
                        dispatch(
                            scatterplotTooltipChanged({
                                xPos: evt.clientX,
                                yPos: evt.clientY,
                                depth: y,
                                emuValue: x,
                                emuVariable,
                            })
                        );
                    }}
                    onMouseOut={() => {
                        // console.log('mouse leave scatterplote dot')
                        dispatch(scatterplotTooltipChanged(null));
                    }}
                    style={{
                        height: 4,
                        width: 4,
                        left: `${translateXByPct}%`,
                        top: `${translateYByPct}%`,
                        background: fillColor,
                    }}
                ></div>
            );
        });
    };

    return (
        <div className="absolute top-0 left-0 h-full w-full py-2 px-1 pointer-events-none z-10">
            <div className="h-full w-full relative pointer-events-none">
                {getDots(current)}
                {showPrevData && getDots(previous, 'red')}
            </div>
        </div>
    );
};

export default Scatterplot;
