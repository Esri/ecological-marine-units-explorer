import React from 'react';

const About = () => {
    return (
        <div className="pt-4 pb-2 border-t border-custom-blue border-opacity-50">
            <h4 className="text-custom-light-blue font-semibold">About</h4>
            <p className="text-custom-blue font-semibold text-sm">
                The Ecological Marine Units (EMU) explorer portrays a
                3-dimensional classification of physiographic and ecological
                information about ocean water.
                <br />
                Choose any ocean location to see these statistically-unique
                marine slices from sea level down to the ocean floor.
            </p>
        </div>
    );
};

export default About;
