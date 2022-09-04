import React, { FC } from 'react';
import Header from './Header';
import About from './About';
import BasemapSelector from './BasemapSelector';
import ContentSelector from './ContentSelector';
import EMUKey from './EmuInfo';
import classNames from 'classnames';

type Props = {
    sidebarOnClose: () => void;
    isSidebarOpen: boolean;
};

const containerDefaultClass = `absolute top-0 left-0 box-border w-full md:w-sidebar px-4 font-semibold z-20`;

const Sidebar: FC<Props> = ({ sidebarOnClose, isSidebarOpen }: Props) => {
    if (!isSidebarOpen) {
        return (
            <div className={`${containerDefaultClass} bg-black-opacity-80`}>
                <Header />
            </div>
        );
    }

    return (
        <>
            <div
                className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-10"
                onClick={sidebarOnClose}
            ></div>

            <div
                className={`${containerDefaultClass} bg-custom-sidebar-default bottom-0 pb-4 overflow-y-auto scroller`}
            >
                <Header />
                <BasemapSelector />
                <ContentSelector />
                <About />
                <EMUKey />
            </div>
        </>
    );
};

export default Sidebar;
