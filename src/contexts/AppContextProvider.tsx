import { isMobileDevice } from 'helper-toolkit-ts/dist/misc';
import React, { useState, createContext } from 'react';

type AppContextValue = {
    isMobileDevice: boolean;
};

type AppContextProviderProps = {
    children?: React.ReactNode;
};

export const AppContext = createContext<AppContextValue>(null);

const AppContextProvider: React.FC<AppContextProviderProps> = ({
    children,
}: AppContextProviderProps) => {
    // const [value, setValue] = useState<AppContextValue>({
    //     isMobileDevice: isMobileDevice(),
    // });

    // const init = async () => {
    //     // const contextValue: AppContextValue = {
    //     //     darkMode: false
    //     // };
    //     // setValue(contextValue);
    // };

    // React.useEffect(() => {
    //     init();
    // }, []);

    return (
        <AppContext.Provider
            value={{
                isMobileDevice: isMobileDevice(),
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
