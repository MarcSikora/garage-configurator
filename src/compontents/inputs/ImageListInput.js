import React, { useState } from 'react'
import './ImageListInput.css'
import ImageListInputItem from './ImageListInputItem';

function ImageListInput(props) {
    const [selected, setSelected] = useState(props.value | 0);

    const handleChange = (id) => {
        setSelected(id);
        props.onChange(id);
    }

    return (
        <div className="ImageListInput">
            <label className="ImageListInput--label">{props.label}</label>
            <div className="ImageListInput--content">
                {
                    props.items.map((item, i) => {
                        let isSelected = (i === selected);
                        return (
                            <ImageListInputItem
                                key={item.id} 
                                id={item.id} 
                                src={item.src}
                                alt={item.caption} 
                                selected={isSelected} 
                                onClick={handleChange}
                            ></ImageListInputItem>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ImageListInput
