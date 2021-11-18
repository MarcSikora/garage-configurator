import React from 'react'
import { useDispatch } from 'react-redux'
import { changeProperty } from '../../actions'
import ImageListInput from '../inputs/ImageListInput'
import MaterialInput from '../inputs/MaterialInput'
import NumberInput from '../inputs/NumberInput'
import SettingsItem from './SettingsItem'
import Row from '../inputs/Row'
import { GateTypes } from '../../logic/GateTypes'
import { GatePositions } from '../../logic/GatePositions' 

function Gate() {
    const dispatch = useDispatch();

    const handleTypeChange = (id) => {
        dispatch(changeProperty("gate", "type", id));
    }

    const handlePositionChange = (id) => {
        dispatch(changeProperty("gate", "position", id));
    }

    const handleMaterialChange = (type, color) => {
        dispatch(changeProperty("gate", "materialType", type));
        dispatch(changeProperty("gate", "material", color));
    }

    return (
        <div className="Gate">
            <SettingsItem header="Gate">
                <ImageListInput
                    label="Gate type"
                    items={GateTypes}
                    onChange={handleTypeChange}
                ></ImageListInput>
                <ImageListInput
                    label="Gate position"
                    items={GatePositions}
                    onChange={handlePositionChange}
                ></ImageListInput>
                <MaterialInput
                    onChange={handleMaterialChange}
                ></MaterialInput>
                <Row label="Gate dimensions">
                    <NumberInput
                        label="Width"
                        unit="m"
                        min={2}
                        max={3}
                        step={0.1}
                        value={2}
                    ></NumberInput>
                    <NumberInput
                        label="Height"
                        unit="m"
                        min={1.9}
                        max={2.9}
                        step={0.1}
                        value={1.9}
                    ></NumberInput>
                </Row>
            </SettingsItem>
        </div>
    )
}

export default Gate
