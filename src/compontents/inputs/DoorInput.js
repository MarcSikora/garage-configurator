import React from 'react'
import './DoorInput.css'
import SelectInput from './SelectInput'
import MaterialInput from './MaterialInput'
import remove from '../../imgs/ui/remove.png'
import SliderInput from './SliderInput'

function DoorInput(props) {
    const wallOptions = ["left", "right", "front", "back"].map((wall, i) => {
        return { value: i, text: wall }
    })

    const handleWallChange = (value) => {
        props.onItemChange(props.index, "wall", value);
    }

    const handlePositionChange = (value) => {
        props.onItemChange(props.index, "position", value);
    }    

    const handleMaterialChange = (type, color) => {
        props.onItemChange(props.index, "materialType", type);
        props.onItemChange(props.index, "material", color);
    }

    const handleRemove = () => {
        props.onItemRemove(props.index);
    }

    return (
        <div className="DoorInput">
            <div className="DoorInput--remove" onClick={handleRemove}>
                <img src={remove} alt="remove"></img>
            </div>
            <SelectInput
                label="Wall"
                options={wallOptions}
                value={props.params.wall}
                onChange={handleWallChange}
            ></SelectInput>
            <SliderInput
                label="Position"
                unit="m"
                min={0.1}
                max={2}
                step={0.1}
                value={props.params.position} 
                onChange={handlePositionChange}
            ></SliderInput>
            <MaterialInput
                onChange={handleMaterialChange}
                typeValue={props.params.materialType}
                colorValue={props.params.material}
            ></MaterialInput>
        </div>
    )
}

export default DoorInput
