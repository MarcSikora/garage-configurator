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
    const [previous, setPrevious] = useState({
        doorsLength: 0,
        walls: [],
        garageLength: 0,
        garageWidth: 0
    });

    useEffect(() => {
        const handleItemChange = (index, propertyName, value) => {
            dispatch(changeItemProperty("doors", index, propertyName, value));
        }
    
        const handleItemRemove = (index) => {
            dispatch(removeItem("doors", index));
        }

        const checkForChange = () => {
            return (
                checkWalls() ||
                previous.doorsLength !== props.doors.length || 
                previous.garageLength !== props.garage.length || 
                previous.garageWidth !== props.garage.width
            );
        }

        const checkWalls = () => {
            const currentWalls = props.doors.map(door => door.wall);
            console.log(previous.walls)
            return previous.walls.some((wall, i) => wall != currentWalls[i]);
        }

        if(checkForChange())
        {
            setItems(
                props.doors.map((door, i) =>  
                    <DoorInput
                        key={uuid()}
                        index={i}
                        garage={props.garage}
                        params={door}
                        onItemChange={handleItemChange}
                        onItemRemove={handleItemRemove}
                    ></DoorInput>
                )
            );    
            setPrevious({
                doorsLength: props.doors.length,
                wall: props.doors.map(door => door.wall),
                garageLength: props.garage.length,
                garageWidth: props.garage.width
            });        
        }
        
    }, [props.doors, props.garage, previous, dispatch]);

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
