import React from 'react';

const SplineViewer = () => {
    console.log('SplineViewer component rendered');
    return (
        <div>
            <script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.94/build/spline-viewer.js"></script>
            <spline-viewer url="https://prod.spline.design/51sr5PZOfD5nBfJB/scene.splinecode"></spline-viewer>
        </div>
    );
};

export default SplineViewer;

