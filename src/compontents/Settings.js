import React from 'react'
import Dimensions from './settings-items/Dimensions'
import Gate from './settings-items/Gate'
import Heights from './settings-items/Heights'
import Roof from './settings-items/Roof'
import Walls from './settings-items/Walls'
import './Settings.css'

function Settings(props) {
    return (
        <div className="Settings">
            <Dimensions></Dimensions>
            <Roof></Roof>
            <Heights></Heights>
            <Walls></Walls>
            <Gate></Gate>
        </div>
    )
}

export default Settings
