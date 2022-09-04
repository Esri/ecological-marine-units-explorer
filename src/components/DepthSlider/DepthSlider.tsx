import './style.css';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { emuLayerDepthLevelChanged } from '../../store/Map/reducer';

import { selectView } from '../../store/Map/selectors';

import ISlider from 'esri/widgets/Slider';
import { loadModules } from 'esri-loader';
import { DEPTH_LEVELS } from './data';
import { useDispatch } from 'react-redux';
import { selectQueryLocation } from '../../store/EMU/selectors';

const DepthSlider = () => {
    const dispatch = useDispatch();

    const activeView = useSelector(selectView);

    const queryLocation = useSelector(selectQueryLocation);

    const containerRef = useRef<HTMLDivElement>();

    const sliderRef = useRef<ISlider>();

    const debounceDelay = useRef<NodeJS.Timeout>();

    const init = async () => {
        type Modules = [typeof ISlider];

        try {
            const [Slider] = await (loadModules([
                'esri/widgets/Slider',
            ]) as Promise<Modules>);

            sliderRef.current = new Slider({
                container: containerRef.current,
                min: -5500,
                max: 0,
                steps: DEPTH_LEVELS.map((d) => d.Depth),
                values: [0],
                // min: 1,
                // max: 15,
                // steps: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                // values: [1],
                snapOnClickEnabled: false,
                visibleElements: {
                    labels: true,
                    rangeLabels: false,
                },
                layout: 'vertical',
            });

            sliderRef.current.on('thumb-drag', (evt) => {
                clearTimeout(debounceDelay.current);

                debounceDelay.current = setTimeout(() => {
                    const depth = +evt.value;

                    const depthData = DEPTH_LEVELS.find(
                        (item) => item.Depth === depth
                    );

                    const depthLevel = depthData ? +depthData.Depth_Level : 0;

                    dispatch(emuLayerDepthLevelChanged(depthLevel));
                }, 500);
            });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        init();

        return () => {
            sliderRef.current.destroy();
        };
    }, []);

    // useEffect(()=>{
    //     if(sliderRef.current && activeView === '2d'){
    //         // reset the value to 0 when switch from 3d to 2d
    //         // sliderRef.current.values = [0]
    //     }
    // }, [activeView]);

    return (
        <div
            id="depth-slider-container"
            className={classNames(
                'absolute top-45px left-0 w-12 p-1 flex flex-col text-custom-light-blue bg-black-opacity-80 font-size--2 z-1',
                {
                    'opacity-0': activeView === '3d',
                    'bottom-382px': queryLocation !== null,
                    'md:bottom-346px': queryLocation !== null,
                    'bottom-0': !queryLocation,
                }
            )}
            // style={{
            //     bottom: queryLocation ? 346 : 0,
            // }}
        >
            <div className="text-center">
                <span>Depth</span>
            </div>
            <div className="flex-grow my-2" ref={containerRef}></div>
        </div>
    );
};

export default DepthSlider;
