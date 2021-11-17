import React from 'react'
import { useDispatch } from 'react-redux'
import {changeProperty} from '../../actions'
import SettingsItem from './SettingsItem'
import SelectInput from '../inputs/SelectInput'

function Dimensions() {
    const dispatch = useDispatch();

    const getSizes = () => {
        const sizes = [];

        for(let i = 2; i <= 6; i+=0.5)
            sizes.push({
                value: i,
                text: i
            });
        return sizes;
    }

    const handleWidthChange = (value) => {
        dispatch(changeProperty("garage", "width", value));
    }

    const handleLengthChange = (value) => {
        dispatch(changeProperty("garage", "length", value));
    }

    return (
        <div className="Dimensions">
            <SettingsItem header="Dimensions">
                <div style={{display: "flex"}}>
                    <SelectInput 
                        label="Width"
                        unit="m"
                        options={getSizes()}
                        onChange={handleWidthChange}
                    ></SelectInput>
                    <SelectInput 
                        label="Length"
                        unit="m"
                        options={getSizes()}
                        onChange={handleLengthChange}
                    ></SelectInput>
                </div>
            </SettingsItem>
        </div>
    )
}

export default Dimensions
