import parametersReducer from './parameters'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
    parameters: parametersReducer
})

export default allReducers;