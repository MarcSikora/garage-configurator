import React, {useState} from 'react'
import './SelectInput.css'

function SelectInput(props) {
    const [value, setValue] = useState(props.value || 0);

    const options = props.options.map(opt => 
        <option key={opt.value} value={opt.value}>{opt.text}</option>
    );

    const handleChange = (e) => {
        const v = parseInt(e.currentTarget.value);
        setValue(v);
        props.onChange(v);
    }

    return (
        <div className="SelectInput">
            <label className="SelectInput--label">{props.label}</label>
            <select className="SelectInput--select" onChange={handleChange} value={value}>
                {options}
            </select>
            <span className="SelectInput--unit">{props.unit}</span>
        </div>
    )
}

export default SelectInput