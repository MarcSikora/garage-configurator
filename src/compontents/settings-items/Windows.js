import React, { useEffect, useState } from 'react'
import uuid from 'react-uuid';
import { useDispatch } from 'react-redux'
import { addItem, changeItemProperty,removeItem } from '../../actions'
import ArrayInput from '../inputs/ArrayInput'
import SettingsItem from './SettingsItem'
import WindowParameters from '../../logic/WindowParameters'
import WindowInput from '../inputs/WindowInput';

function Windows(props) {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [previousLength, setPreviousLength] = useState(0);

    useEffect(() => {
        const handleItemChange = (index, propertyName, value) => {
            dispatch(changeItemProperty("windows", index, propertyName, value));
        }
    
        const handleItemRemove = (index) => {
            dispatch(removeItem("windows", index));
        }
        
        if(previousLength !== props.windows.length)
        {
            setItems(
                props.windows.map((door, i) =>  
                    <WindowInput
                        key={uuid()}
                        index={i}
                        params={door}
                        onItemChange={handleItemChange}
                        onItemRemove={handleItemRemove}
                    ></WindowInput>
                )
            );
        }
        
        setPreviousLength(props.windows.length);
    }, [props.windows, previousLength, dispatch]);

    const handleAddItem = () => {
        dispatch(addItem("windows", new WindowParameters()))
    }

    return (
        <div className="Windows">
            <SettingsItem header="Windows">
               <ArrayInput
                label="Winodws count:"
                items={items}
                onAddItem={handleAddItem}
               ></ArrayInput>
            </SettingsItem>
        </div>
    )
}

export default Windows

