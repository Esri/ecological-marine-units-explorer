import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { isSidebarOpenToggled } from '../../store/UI/reducer';

import { selectIsSidebarOpen } from '../../store/UI/selectors';

const MenuIcon = () => {
    return (
        <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M3 5h18v1H3zm0 8h18v-1H3zm0 7h18v-1H3z"></path>
        </svg>
    );
};

const CloseIcon = () => {
    return (
        <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M18.01 6.697L12.707 12l5.303 5.303-.707.707L12 12.707 6.697 18.01l-.707-.707L11.293 12 5.99 6.697l.707-.707L12 11.293l5.303-5.303z" />
        </svg>
    );
};

const Header = () => {
    const dispatch = useDispatch();

    const isSidebarOpen = useSelector(selectIsSidebarOpen);

    const menuButOnClick = () => {
        dispatch(isSidebarOpenToggled());
    };

    return (
        <div className="w-full flex items-center text-custom-light-blue h-header">
            <div
                className="mr-2 md:mr-4 cursor-pointer"
                onClick={menuButOnClick}
            >
                {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </div>

            <span className="text-base md:text-21px flex-grow">
                <span className="uppercase font-bold">
                    ECOLOGICAL MARINE UNIT
                </span>{' '}
                <span className="italic">explorer</span>
            </span>
        </div>
    );
};

export default Header;
