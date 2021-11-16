import React from 'react'
import SettingsItem from './SettingsItem'
import './Dimensions.css'
import SelectInput from '../inputs/SelectInput'

function Dimensions() {
    const getSizes = () => {
        const sizes = [];

        for(let i = 2; i <= 6; i+=0.5)
            sizes.push({
                value: i,
                text: i
            });
        return sizes;
    }

    return (
        <div className="Dimensions">
            <SettingsItem header="Dimensions">
                <div style={{display: "flex"}}>
                    <SelectInput 
                        label="Width"
                        unit="m"
                        options={getSizes()}
                    ></SelectInput>
                    <SelectInput 
                        label="Length"
                        unit="m"
                        options={getSizes()}
                    ></SelectInput>
                </div>
            </SettingsItem>
        </div>
    )
}

export default Dimensions
