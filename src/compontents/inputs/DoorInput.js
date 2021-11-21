import React, { useEffect, useState } from 'react'
import './DoorInput.css'
import SelectInput from './SelectInput'
import MaterialInput from './MaterialInput'
import remove from '../../imgs/ui/remove.png'
import SliderInput from './SliderInput'
import {WALLS, DOOR_WIDTH, SPACE} from '../../logic/Constants'

function DoorInput(props) {
    const [maxPosition, setMaxPosition] = useState(2);

    useEffect(() => {
        const side = [WALLS.LEFT, WALLS.RIGHT].includes(props.params.wall) ? 
            props.garage.length : props.garage.width;
            
        const max = parseFloat((side - DOOR_WIDTH - SPACE).toFixed(1));
        setMaxPosition(max);
    }, [props.garage, props.params, setMaxPosition]);

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
                min={SPACE}
                max={maxPosition}
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
