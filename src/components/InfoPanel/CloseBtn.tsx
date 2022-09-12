import React from 'react';
import { useDispatch } from 'react-redux';
import { clearQueryResult } from '../../store/EMU/thunks';

const CloseBtn = () => {
    const dispatch = useDispatch();

    return (
        <div
            className="absolute top-2 right-2 cursor-pointer text-custom-light-blue z-10"
            onClick={() => {
                dispatch(clearQueryResult());
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                height="32"
                width="32"
                fill="currentColor"
            >
                <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z" />
                <path fill="none" d="M0 0h32v32H0z" />
            </svg>
        </div>
    );
};

export default CloseBtn;
