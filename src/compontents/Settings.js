import React from 'react'
import Dimensions from './settings-items/Dimensions'
import Gate from './settings-items/Gate'
import Heights from './settings-items/Heights'
import Roof from './settings-items/Roof'
import Walls from './settings-items/Walls'
import Doors from './settings-items/Doors'
import Windows from './settings-items/Windows'
import './Settings.css'

function Settings(props) {
    return (
        <div className="Settings">
            <Dimensions></Dimensions>
            <Roof></Roof>
            <Heights></Heights>
            <Walls></Walls>
            <Gate></Gate>
            <Doors doors={props.parameters.doors}></Doors>
            <Windows windows={props.parameters.windows}></Windows>
        </div>
    )
}

export default Settings
