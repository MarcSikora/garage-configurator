import { CHANGE_PROPERTY } from './types'

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