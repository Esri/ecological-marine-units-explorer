import React, { FC } from 'react';
import { getEmuInfo, getEmuInfoById } from '../../utils/emu';

type Props = {
    EMUKey: number;
    prevEMUKey?: number;
};

const EMUInfo: FC<Props> = ({ EMUKey, prevEMUKey }: Props) => {
    const emuInfo = getEmuInfoById(EMUKey);

    if (!emuInfo) {
        return null;
    }

    const { fill, description } = emuInfo;

    return (
        <div
            className="flex text-white items-stretch"
            style={{
                backgroundColor: prevEMUKey ? 'red' : fill,
            }}
        >
            <div className="relative flex justify-center items-center shrink-0 w-16 py-1 font-semibold bg-gradient-transparent-to-semi-black">
                <div className="text-center text-shadow-black">
                    <span className="">EMU</span>
                    <br />
                    <span className="text-xl">{EMUKey}</span>
                </div>
            </div>

            <div className="flex items-center p-1">
                <p className="font-size--2 text-shadow-black leading-tight ml-1">
                    {prevEMUKey
                        ? `Changed from EMU ${prevEMUKey} to EMU ${EMUKey}`
                        : description}
                </p>
            </div>
        </div>
    );
};

export default EMUInfo;
