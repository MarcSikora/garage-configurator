import React from 'react'
import './SelectInput.css'

function SelectInput(props) {
    const items = props.options.map(opt => 
        <option key={opt.value} value={opt.value}>{opt.text}</option>
    );

    return (
        <div className="SelectInput">
            <label className="SelectInput--label">{props.label}</label>
            <select className="SelectInput--select">
                {items}
            </select>
            <span className="SelectInput--unit">{props.unit}</span>
        </div>
    )
}

export default SelectInput
