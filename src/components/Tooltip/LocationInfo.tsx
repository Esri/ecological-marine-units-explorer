import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectQueryLocation } from '../../store/EMU/selectors';

type Props = {
    depth: number;
    thickness: number;
    oceanName: string;
};

const LocationInfo: FC<Props> = ({ depth, thickness, oceanName }: Props) => {
    const queryLocation = useSelector(selectQueryLocation);

    return (
        <div>
            <div>
                <span>{oceanName}</span>
                <span className="mx-1">{' | '}</span>
                <span>
                    {queryLocation?.latitude.toFixed(2)},{' '}
                    {queryLocation?.longitude.toFixed(2)}
                </span>
            </div>

            <div>
                <span>
                    {depth}m deep, {thickness}m thick
                </span>
            </div>
        </div>
    );
};

export default LocationInfo;
