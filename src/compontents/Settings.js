import React from 'react'
import Dimensions from './settings-items/Dimensions'
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
        </div>
    )
}

export default Settings
