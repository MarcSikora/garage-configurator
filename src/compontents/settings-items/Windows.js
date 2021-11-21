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
    const [previousGarageLength, setPreviousGarageLength] = useState(0);
    const [previousGarageWidth, setPreviousGarageWidth] = useState(0);

    useEffect(() => {
        const handleItemChange = (index, propertyName, value) => {
            dispatch(changeItemProperty("windows", index, propertyName, value));
        }
    
        const handleItemRemove = (index) => {
            dispatch(removeItem("windows", index));
        }

        const checkForChange = () => {
            return (
                previousLength !== props.windows.length || 
                previousGarageLength !== props.garage.length || 
                previousGarageWidth !== props.garage.width
            );
        }
        
        if(checkForChange())
        {
            setItems(
                props.windows.map((window, i) =>  
                    <WindowInput
                        key={uuid()}
                        index={i}
                        params={window}
                        onItemChange={handleItemChange}
                        onItemRemove={handleItemRemove}
                    ></WindowInput>
                )
            );            
        }
        
        setPreviousLength(props.windows.length);
        setPreviousGarageLength(props.garage.length);
        setPreviousGarageWidth(props.garage.width);
    }, [props.windows, props.garage, previousLength, previousGarageLength, previousGarageWidth, dispatch]);

    const handleAddItem = () => {
        dispatch(addItem("windows", new WindowParameters()))
    }

    return (
        <div className="Windows">
            <SettingsItem header="Windows">
               <ArrayInput
                label="Windows count:"
                items={items}
                onAddItem={handleAddItem}
               ></ArrayInput>
            </SettingsItem>
        </div>
    )
}

export default Windows

