import React, { useEffect, useRef, useState } from 'react'
import Parameters from '../logic/Parameters'
import Visualisation from '../logic/Visualisation'
import WarningSystem from '../logic/WarningSystem'
import './Display.css'
import uuid from 'react-uuid'

function Display(props) {
    const display = useRef(null);
    const vis = useRef(null);
    const [infoItems, setInfoItems] = useState([]);

    useEffect(() => {
        vis.current = new Visualisation();
        vis.current.init(display.current, new Parameters());
    }, []);

    useEffect(() => {
        let ws = new WarningSystem();
        setInfoItems(ws.getWarnings(props.parameters).map(w => <div key={uuid()}>Warning: {w}</div>));
            
        vis.current.update(props.parameters);
    }, [props.parameters]);


    return (
        <div className="Display">
            <div className="Display--container" ref={display}></div>
            <div className="Display--info">
                {infoItems}
            </div>
        </div>
    )
}

export default Display
