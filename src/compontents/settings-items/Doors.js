import React, { useEffect, useState } from 'react'
import uuid from 'react-uuid';
import { useDispatch } from 'react-redux'
import { addItem, changeItemProperty,removeItem } from '../../actions'
import ArrayInput from '../inputs/ArrayInput'
import DoorInput from '../inputs/DoorInput'
import SettingsItem from './SettingsItem'
import DoorParameters from '../../logic/DoorParameters'

function Doors(props) {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [previousLength, setPreviousLength] = useState(0);

    useEffect(() => {
        const handleItemChange = (index, propertyName, value) => {
            dispatch(changeItemProperty("doors", index, propertyName, value));
        }
    
        const handleItemRemove = (index) => {
            dispatch(removeItem("doors", index));
        }
        
        if(previousLength !== props.doors.length)
        {
            setItems(
                props.doors.map((door, i) =>  
                    <DoorInput
                        key={uuid()}
                        index={i}
                        params={door}
                        onItemChange={handleItemChange}
                        onItemRemove={handleItemRemove}
                    ></DoorInput>
                )
            );
        }
        
        setPreviousLength(props.doors.length);
    }, [props.doors, previousLength, dispatch]);

    const handleAddItem = () => {
        dispatch(addItem("doors", new DoorParameters()))
    }

    return (
        <div className="Doors">
            <SettingsItem header="Doors">
               <ArrayInput
                label="Doors count:"
                items={items}
                onAddItem={handleAddItem}
               ></ArrayInput>
            </SettingsItem>
        </div>
    )
}

export default Doors
