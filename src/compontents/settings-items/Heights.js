import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
            <SettingsItem header="Heights">
                <div style={{display: "flex"}}>
                    <NumberInput 
                        label="Min. height"
                        unit="m"
                        min={2}
                        max={3}
                        step={0.1}
                        value={2.1}
                        onChange={handleMinHeightChange}
                    ></NumberInput>
                    <NumberInput 
                        label="Max. height"
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
