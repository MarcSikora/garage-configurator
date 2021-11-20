import React, { useState } from 'react'
import './SliderInput.css'

function SliderInput(props) {
    const [value, setValue] = useState(props.value || 0);

    const handleChange = (e) => {
        const v = parseFloat(e.currentTarget.value);
        setValue(v);
        props.onChange(v);
    }

    return (
        <div className="SliderInput">
            <label className="SliderInput--label">{props.label}</label>
            <input 
                type="range" 
                min={props.min}
                max={props.max}
                step={props.step}
                onChange={handleChange}
                value={value}
            ></input>
            <div className="SliderInput--value">{value} {props.unit}</div>
        </div>
    )
}

export default SliderInput
