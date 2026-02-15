import { Profiler as ReactProfiler } from 'react';

function onRender(id, phase, actualDuration, baseDuration) {
    console.log(`Profiler [${id}] - ${phase} phase: ${actualDuration}ms base: ${baseDuration}ms`);
}

const Profiler = ({ children, id = "App" }) => {
    return (
        <ReactProfiler id={id} onRender={onRender}>
            {children}
        </ReactProfiler>
    );
};

export default Profiler;