import React from 'react'
import ImageListInput from '../inputs/ImageListInput'
import SettingsItem from './SettingsItem'
import roofTypeLeft from '../../imgs/roofTypes/left.png'
import roofTypeRight from '../../imgs/roofTypes/right.png'
import roofTypeGable from '../../imgs/roofTypes/double.png'
import roofTypeFront from '../../imgs/roofTypes/front.png'
import roofTypeBack from '../../imgs/roofTypes/back.png'

function Roof() {
    const types = [
        {
            id: 0,
            src: roofTypeLeft,
            caption: "left"
        },
        {
            id: 1,
            src: roofTypeRight,
            caption: "right"
        },
        {
            id: 2,
            src: roofTypeGable,
            caption: "gable"
        },
        {
            id: 3,
            src: roofTypeFront,
            caption: "front"
        },
        {
            id: 4,
            src: roofTypeBack,
            caption: "back"
        }
    ]
    return (
        <div className="Roof">
            <SettingsItem header="Roof">
                <ImageListInput
                    label="Roof type"
                    items={types}
                    value={0}
                ></ImageListInput>
            </SettingsItem>
        </div>
    )
}

export default Roof
