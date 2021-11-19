import React from 'react'
import './ArrayInput.css'
import plus from '../../imgs/ui/plus.png'
function ArrayInput(props) {
    return (
        <div className="ArrayInput">
            <div className="ArrayInput--header">
                <div className="ArrayInput--header-button" onClick={props.onAddItem}>
                    <img src={plus} alt="add item"></img>
                </div>
                <div className="ArrayInput--header-label">{props.label}</div>
                <div className="ArrayInput--header-count">{props.items.length}</div>
            </div>
            <div className="ArrayInput--content">
                {props.items}
            </div>
        </div>
    )
}

export default ArrayInput
