import React from 'react';
import { useSelector } from 'react-redux';
import Tooltip from './Tooltip';
import {
    selectTooltipData,
    selectTooltipXPosition,
} from '../../store/UI/selectors';

const TooltipContainer = () => {
    const data = useSelector(selectTooltipData);
    const xPosition = useSelector(selectTooltipXPosition);

    if (!data) {
        return null;
    }

    return <Tooltip data={data} xPosition={xPosition} />;
};

export default TooltipContainer;
