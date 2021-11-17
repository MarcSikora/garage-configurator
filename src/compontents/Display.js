import React, { useEffect, useRef } from 'react'
import Parameters from '../logic/Parameters'
import Visualisation from '../logic/Visualisation'
import './Display.css'

function Display(props) {
    const display = useRef(null);
    const vis = useRef(null);

    useEffect(() => {
        vis.current = new Visualisation();
        vis.current.init(display.current, new Parameters());
    }, []);

    useEffect(() => {
        vis.current.update(props.parameters);
    }, [props.parameters]);

    return (
        <div className="Display">
            <div className="Display--container" ref={display}>

            </div>
        </div>
    )
}

export default Display
