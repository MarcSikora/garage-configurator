import React from 'react'
import { useDispatch } from 'react-redux'
import { changeProperty } from '../../actions'
import MaterialInput from '../inputs/MaterialInput'
import SettingsItem from './SettingsItem'

function Walls() {
    const dispatch = useDispatch();

    const handleMaterialChange = (type, color) => {
        dispatch(changeProperty("garage", "materialType", type));
        dispatch(changeProperty("garage", "material", color));
    }  

    return (
        <div className="Walls">
            <SettingsItem header="Walls">
                <MaterialInput
                    onChange={handleMaterialChange}
                ></MaterialInput>
            </SettingsItem>
        </div>
    )
}

export default Walls
