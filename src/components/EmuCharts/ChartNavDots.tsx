import classNames from 'classnames';
import React, { FC } from 'react';

type Props = {
    idxOfActiveItem: number;
    onSelect: (idx: number) => void;
    prevBtnOnClick: () => void;
    nextBtnOnClick: () => void;
};

const ChartNavDots: FC<Props> = ({
    idxOfActiveItem,
    onSelect,
    prevBtnOnClick,
    nextBtnOnClick,
}: Props) => {
    const getDots = () => {
        const dots: JSX.Element[] = [];

        for (let i = 0; i < 6; i++) {
            dots.push(
                <div
                    key={i}
                    className={classNames(
                        'w-3 h-3 rounded-full cursor-pointer mx-2 bg-custom-light-blue',
                        {
                            'opacity-100': idxOfActiveItem === i,
                            'opacity-70': idxOfActiveItem !== i,
                        }
                    )}
                    onClick={onSelect.bind(null, i)}
                ></div>
            );
        }

        return <div className="flex justify-center">{dots}</div>;
    };

    return (
        <div className="flex md:hidden mt-3 justify-between items-center text-custom-light-blue">
            {/* chevron icon to left */}
            <div className="cursor-pointer" onClick={prevBtnOnClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                >
                    <path
                        d="M6.793 12l7-7h1.414l-7 7 7 7h-1.414z"
                        fill="currentColor"
                    />
                    <path fill="none" d="M0 0h24v24H0z" />
                </svg>
            </div>

            {getDots()}

            {/* chevron icon to right */}
            <div className="cursor-pointer" onClick={nextBtnOnClick}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                >
                    <path
                        d="M8.793 5h1.414l7 7-7 7H8.793l7-7z"
                        fill="currentColor"
                    />
                    <path fill="none" d="M0 0h24v24H0z" />
                </svg>
            </div>
        </div>
    );
};

export default ChartNavDots;
