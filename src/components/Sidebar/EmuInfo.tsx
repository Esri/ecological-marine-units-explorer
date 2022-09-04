import React from 'react';
import { getEmuInfo } from '../../utils/emu';
// import { EMUKeysData } from '../../constants/emu';

const emuKeysData = getEmuInfo();

const EMUKey = () => {
    return (
        <div className="pt-4 border-t border-custom-blue border-opacity-50">
            <h4 className="text-custom-light-blue font-semibold">EMU Key</h4>
            <p className="text-custom-blue font-semibold text-sm">
                A three-dimensional mesh of over 50 million points was fed into
                a systematic statistical clustering which generated XX
                ecologically/physiographically unique classifications of ocean
                water: Ecological Marine Units (EMU). This segmentation is
                represented as slices of the water column, from sea surface to
                floor, at a 1/4 degree by 1/4 degree resolution.
            </p>

            <div className="mt-2">
                {emuKeysData.map((d) => {
                    const { Cluster, fill, description } = d;

                    return (
                        <div className="flex" key={Cluster}>
                            <div
                                className="shrink-0 w-10 text-white flex justify-center items-center mr-2 font-size--2 border-b border-gray-100 border-opacity-70 text-shadow-black"
                                style={{
                                    background: fill,
                                }}
                            >
                                {Cluster}
                            </div>

                            <div className="leading-tight py-1">
                                <span className="text-custom-blue font-size--2">
                                    {description}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EMUKey;
