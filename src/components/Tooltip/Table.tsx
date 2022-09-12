import classNames from 'classnames';
import React, { FC } from 'react';

export type TooltipTableData = {
    label: string;
    value: string;
};

type Props = {
    data: TooltipTableData[];
};

const Table: FC<Props> = ({ data }: Props) => {
    if (!data || !data.length) {
        return null;
    }

    return (
        <div className="mb-2">
            {data.map((row, index) => {
                const { label, value } = row;

                return (
                    <div
                        key={label}
                        className={classNames(
                            'flex items-center justify-between px-1'
                        )}
                        style={{
                            background:
                                index % 2 === 0
                                    ? 'rgba(0, 108, 216, .2)'
                                    : 'transparent',
                        }}
                    >
                        <div>
                            {/* need to render the label text this way because "Disssolved O2" need to be rendered as "Disssolved O<sub>2</sub>" */}
                            <span dangerouslySetInnerHTML={{ __html: label }} />
                        </div>
                        <div className="text-right">{value}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Table;
