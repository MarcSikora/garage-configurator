import React from 'react'
import Dimensions from './settings-items/Dimensions'
import Roof from './settings-items/Roof'
import './Settings.css'

function Settings(props) {
    return (
        <div className="Settings">
            <Dimensions 
                width={props.parameters.width}
                length={props.parameters.length}
            ></Dimensions>
            <Roof></Roof>
        </div>
    )
}

export default Settings
