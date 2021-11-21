import React from 'react'
import './NumberInput.css'

function NumberInput(props) {
    const handleChange = (e) => {
        const v = parseFloat(e.currentTarget.value);
        props.onChange(v);
    }

    return (
        <div className="NumberInput">
            <label className="NumberInput--label">{props.label}</label>
            <input 
                className="NumberInput--input" 
                type="number" 
                min={props.min}
                max={props.max}
                step={props.step}
                defaultValue={props.value}
                onChange={handleChange}
            ></input>
            <span className="NumberInput--unit">{props.unit}</span>
        </div>
    )
}

export default NumberInput
