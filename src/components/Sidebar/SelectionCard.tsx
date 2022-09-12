import classNames from 'classnames';
import React, { FC } from 'react';

type Props = {
    title: string;
    description: string;
    backgroundImage: string;
    onSelect: () => void;
    isSelected: boolean;
};

const SelectionCard: FC<Props> = ({
    title,
    description,
    backgroundImage,
    onSelect,
    isSelected,
}: Props) => {
    return (
        <div
            className={classNames('p-1 cursor-pointer w-1/2', {
                'bg-custom-sidebar-selected-item': isSelected,
            })}
            onClick={onSelect}
        >
            <div
                className="w-full h-28"
                style={{
                    background: `url(${backgroundImage}) center center no-repeat`,
                    backgroundSize: 'cover',
                }}
            />

            <div className="p-1">
                <h5 className="text-custom-light-blue">{title}</h5>
                <p className="text-custom-blue font-size--1">{description}</p>
            </div>
        </div>
    );
};

export default SelectionCard;
