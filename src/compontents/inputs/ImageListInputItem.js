import React from 'react'
import './ImageListInputItem.css'

function ImageListInputItem(props) {
    const handleClick = () => {
        props.onClick(props.id);
    }

    return (
        <div className="ImageListInputItem">
            <img 
                className={(props.selected) ? "ImageListInputItem--img-selected" :  "ImageListInputItem--img"}
                src={props.src}
                alt={props.alt}
                onClick={handleClick}
            ></img>
            <div className="ImageListInputItem--caption">{props.alt}</div>
        </div>
    )
}

export default ImageListInputItem
