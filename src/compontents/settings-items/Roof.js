import React from 'react'
import { useDispatch } from 'react-redux'
import { changeProperty } from '../../actions'
import ImageListInput from '../inputs/ImageListInput'
import MaterialInput from '../inputs/MaterialInput'
import SettingsItem from './SettingsItem'
import { RoofTypes } from '../../logic/RoofTypes' 

function Roof() {
    const dispatch = useDispatch();

    const handleTypeChange = (id) => {
        dispatch(changeProperty("roof", "type", id))
    }

    const handleRoofMaterialChange = (type, color) => {
        dispatch(changeProperty("roof", "materialType", type));
        dispatch(changeProperty("roof", "material", color));
    }    

    return (
        <div className="Roof">
            <SettingsItem header="Roof">
                <ImageListInput
                    label="Roof type"
                    items={RoofTypes}
                    onChange={handleTypeChange}
                ></ImageListInput>
                <MaterialInput
                    onChange={handleRoofMaterialChange}
                ></MaterialInput>
            </SettingsItem>
        </div>
    )
}

export default Roof
