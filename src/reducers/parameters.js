import Parameters from '../logic/Parameters'

const parametersReducer = (state = new Parameters(), action) => {
    switch(action.type)
    {
        case 'CHANGE_PROPERTY':
            let obj = JSON.parse(JSON.stringify(state));
            obj[action.payload.propertyName][action.payload.inputName] = action.payload.value;
            return obj;
        default:
            return state;
    }
}
export default parametersReducer;