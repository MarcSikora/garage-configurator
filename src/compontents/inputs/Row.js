import React from 'react'
import './Row.css'

function Row(props) {
    return (
        <div className="Row">
            <div className="Row--label">{props.label}</div>
            <div className="Row--content">{props.children}</div>
        </div>
    )
}

export default Row
