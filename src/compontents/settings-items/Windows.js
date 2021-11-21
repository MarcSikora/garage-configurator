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
    const [previous, setPrevious] = useState({
        windowsLength: 0,
        walls: [],
        garageLength: 0,
        garageWidth: 0
    });

    useEffect(() => {
        const handleItemChange = (index, propertyName, value) => {
            dispatch(changeItemProperty("windows", index, propertyName, value));
        }
    
        const handleItemRemove = (index) => {
            dispatch(removeItem("windows", index));
        }

        const checkForChange = () => {
            return (
                checkWalls() ||
                previous.windowsLength !== props.windows.length || 
                previous.garageLength !== props.garage.length || 
                previous.garageWidth !== props.garage.width
            );
        }

        const checkWalls = () => {
            const currentWalls = props.windows.map(window => window.wall);
            return previous.walls.some((wall, i) => wall !== currentWalls[i]);
        }
        
        if(checkForChange())
        {
            setItems(
                props.windows.map((window, i) =>  
                    <WindowInput
                        key={uuid()}
                        index={i}
                        garage={props.garage}
                        params={window}
                        onItemChange={handleItemChange}
                        onItemRemove={handleItemRemove}
                    ></WindowInput>
                )
            );            

            setPrevious({
                windowsLength: props.windows.length,
                walls: props.windows.map(window => window.wall),
                garageLength: props.garage.length,
                garageWidth: props.garage.width
            });        
        }
    }, [props.windows, props.garage, previous, dispatch]);

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

