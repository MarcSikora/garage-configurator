import React from 'react'
import { useDispatch } from 'react-redux'
import {changeProperty} from '../../actions'
import SettingsItem from './SettingsItem'
import NumberInput from '../inputs/NumberInput'

function Heights() {
    const dispatch = useDispatch();
   
    const handleMinHeightChange = (value) => {
        dispatch(changeProperty("garage", "height_min", value));
    }

    const handleMaxHeightChange = (value) => {
        dispatch(changeProperty("garage", "height_max", value));
    }

    return (
        <div className="Heights">
            <SettingsItem header="Height">
                <div style={{display: "flex"}}>
                    <NumberInput 
                        label="Minimal"
                        unit="m"
                        min={2}
                        max={3}
                        step={0.1}
                        value={2.1}
                        onChange={handleMinHeightChange}
                    ></NumberInput>
                    <NumberInput 
                        label="Maximal"
                        unit="m"
                        min={2.1}
                        max={3.1}
                        step={0.1}
                        value={2.3}
                        onChange={handleMaxHeightChange}
                    ></NumberInput>
                </div>
            </SettingsItem>
        </div>
    )
}

export default Heights
