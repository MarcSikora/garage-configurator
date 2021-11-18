import React, { useState } from 'react'
import './MaterialInput.css'
import SelectInput from './SelectInput'
import ImageListInput from './ImageListInput'
import {WallTypes} from '../../logic/WallTypes';

function MaterialInput(props) {
    const [type, setType] = useState(0);
    const [color, setColor] = useState(0);

    const getTypes = () => {
        const names = ["Galvanized", "Mat", "Shiny", "Woodlike"];
        const types = [];

        for(let i = 0; i < names.length; i++)
            types.push({ value: i, text: names[i] });

        return types;
    }

    const handleTypeChange = (value) => {
        setType(value);
        props.onChange(value, color);
    }

    const handleColorChange = (value) => {
        setColor(value);
        props.onChange(type, value);
    }

    const imageList = (WallTypes[type].length > 0) ? (
        <ImageListInput
            label="Color"
            items={WallTypes[type]}
            onChange={handleColorChange}
        ></ImageListInput>
    ): null;

    return (
        <div className="MaterialInput">
            <SelectInput
                label="Material type"
                options={getTypes()}
                onChange={handleTypeChange}
            ></SelectInput>
            {imageList}
        </div>
    )
}

export default MaterialInput
