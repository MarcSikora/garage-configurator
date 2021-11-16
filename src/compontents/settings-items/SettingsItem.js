import React, { useState } from 'react'
import './SettingsItem.css'
import dropdown from '../../imgs/ui/dropdown.png'

function SettingsItem(props) {
    const [isContentVisible, setIsContentVisible] = useState(true);

    const handleDropdown = () => {
        setIsContentVisible(!isContentVisible);
    }

    const content = (isContentVisible) ? <div className="SettingsItem--content">{props.children}</div> : null;

    return (
        <div className="SettingsItem">
            <div className="SettingsItem--header">
                <div className="SettingsItem--header-text">{props.header}</div>
                <img className="SettingsItem--header-dropdown" src={dropdown} onClick={handleDropdown}></img>
            </div>   
            {content}
        </div>
    )
}

export default SettingsItem
