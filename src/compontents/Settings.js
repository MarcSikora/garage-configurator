import React from 'react'
import Dimensions from './settings-items/Dimensions'
import Roof from './settings-items/Roof'
import './Settings.css'

function Settings() {
    return (
        <div className="Settings">
            <Dimensions></Dimensions>
            <Roof></Roof>
        </div>
    )
}

export default Settings
