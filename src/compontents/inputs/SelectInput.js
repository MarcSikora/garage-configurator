import React from 'react'
import './SelectInput.css'

function SelectInput(props) {
    const options = props.options.map(opt => 
        <option key={opt.value} value={opt.value}>{opt.text}</option>
    );

    const handleChange = (e) => {
        props.onChange(parseInt(e.currentTarget.value));
    }

    return (
        <div className="SelectInput">
            <label className="SelectInput--label">{props.label}</label>
            <select className="SelectInput--select" onChange={handleChange} value={props.value}>
                {options}
            </select>
            <span className="SelectInput--unit">{props.unit}</span>
        </div>
    )
}

export default SelectInput