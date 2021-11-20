import React, { useState } from 'react'
import './SettingsItem.css'
import dropdown from '../../imgs/ui/dropdown.png'

function SettingsItem(props) {
    const [isContentVisible, setIsContentVisible] = useState(false);

    const handleDropdown = () => {
        setIsContentVisible(!isContentVisible);
    }

    const displayValue = (isContentVisible) ?  "block": "none";

    return (
        <div className="SettingsItem">
            <div className="SettingsItem--header">
                <div className="SettingsItem--header-text">{props.header}</div>
                <img 
                    className="SettingsItem--header-dropdown" 
                    src={dropdown} 
                    alt="dropdown"
                    onClick={handleDropdown}
                ></img>
            </div>   
            <div 
                className="SettingsItem--content"
                style={{display: displayValue}}
            >{props.children}</div>
        </div>
    )
}

export default SettingsItem
