import { CHANGE_PROPERTY, ADD_ITEM, CHANGE_ITEM_PROPERTY, REMOVE_ITEM } from './types'

export const changeProperty = (propertyName, inputName, value) => {
    return {
        type: CHANGE_PROPERTY,
        payload: {
            propertyName: propertyName,
            inputName: inputName,
            value: value
        }
    }
}

export const addItem = (propertyName, value) => {
    return {
        type: ADD_ITEM,
        payload: {
            propertyName: propertyName,
            value: value
        }
    }
}

export const changeItemProperty = (propertyName, index, inputName, value) => {
    return {
        type: CHANGE_ITEM_PROPERTY,
        payload: {
            propertyName: propertyName,
            index: index,
            inputName: inputName,
            value: value
        }
    }
}

export const removeItem = (propertyName, index) => {
    return {
        type: REMOVE_ITEM,
        payload: {
            propertyName: propertyName,
            index: index
        }
    }
}