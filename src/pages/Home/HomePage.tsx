import React from 'react';
import { ErrorBoundary, Layout } from '../../components';

const HomePage = () => {
    return (
        <ErrorBoundary>
            <Layout />
        </ErrorBoundary>
    );
};

export default HomePage;
