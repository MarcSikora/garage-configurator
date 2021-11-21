import React, {useEffect, useState} from 'react'
import './WindowInput.css'
import SelectInput from './SelectInput'
import SliderInput from './SliderInput'
import remove from '../../imgs/ui/remove.png'
import Row from './Row'
import {WALLS, SPACE, WINDOW_SIZES} from '../../logic/Constants'

function WindowInput(props) {
    const [maxPosition, setMaxPosition] = useState({
        X: 2,
        Y: 2
    });

    useEffect(() => {
        const side = [WALLS.LEFT, WALLS.RIGHT].includes(props.params.wall) ? 
            props.garage.length : props.garage.width;
            
        setMaxPosition({
            X: parseFloat((side - WINDOW_SIZES[props.params.type].WIDTH*0.01 - SPACE).toFixed(1)),
            Y: parseFloat((props.garage.height_min - WINDOW_SIZES[props.params.type].HEIGHT*0.01 - SPACE).toFixed(1))
        });
    }, [props.garage, props.params, setMaxPosition]);

    const typeOptions = ["60x40", "80x50", "100x50"].map((type, i) => {
        return { value: i, text: type }
    })

    const wallOptions = ["left", "right", "front", "back"].map((wall, i) => {
        return { value: i, text: wall }
    })

    const handleTypeChange = (value) => {
        props.onItemChange(props.index, "type", value);
    }

    const handleWallChange = (value) => {
        props.onItemChange(props.index, "wall", value);
    }

    const handlePositionXChange = (value) => {
        props.onItemChange(props.index, "positionX", value);
    }   
    
    const handlePositionYChange = (value) => {
        props.onItemChange(props.index, "positionY", value);
    }  

    const handleRemove = () => {
        props.onItemRemove(props.index);
    }

    return (
        <div className="WindowInput">
            <div className="WindowInput--remove" onClick={handleRemove}>
                <img src={remove} alt="remove"></img>
            </div>
            <Row>
                <SelectInput
                    label="Type"
                    options={typeOptions}
                    value={props.params.type}
                    onChange={handleTypeChange}
                ></SelectInput>
                <SelectInput
                    label="Wall"
                    options={wallOptions}
                    value={props.params.wall}
                    onChange={handleWallChange}
                ></SelectInput>
            </Row>
            <SliderInput
                label="Position horizontally"
                unit="m"
                min={0.1}
                max={maxPosition.X}
                step={0.1}
                value={props.params.positionX} 
                onChange={handlePositionXChange}
            ></SliderInput>
            <SliderInput
                label="Position vertically"
                unit="m"
                min={0.1}
                max={maxPosition.Y}
                step={0.1}
                value={props.params.positionY} 
                onChange={handlePositionYChange}
            ></SliderInput>
        </div>
    )
}

export default WindowInput