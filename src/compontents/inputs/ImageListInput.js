import React from 'react'
import './ImageListInput.css'
import ImageListInputItem from './ImageListInputItem';

function ImageListInput(props) {
    const handleChange = (id) => {
        console.log(id);
        props.onChange(id);
    }

    return (
        <div className="ImageListInput">
            <label className="ImageListInput--label">{props.label}</label>
            <div className="ImageListInput--content">
                {
                    props.items.map((item, i) => {
                        let isSelected = (i === props.value);
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
