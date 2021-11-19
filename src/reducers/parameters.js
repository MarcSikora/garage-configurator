import Parameters from '../logic/Parameters'

const parametersReducer = (state = new Parameters(), action) => {
    let d = action.payload;
    let newState = JSON.parse(JSON.stringify(state));

    switch(action.type)
    {
        case 'CHANGE_PROPERTY':
            return {
                ...state,
                [d.propertyName]: {
                    ...state[d.propertyName],
                    [d.inputName]: action.payload.value
                }
            }

        case 'ADD_ITEM':
            return {
                ...state,
                [d.propertyName]: [
                    ...state[d.propertyName],
                    d.value
                ]
            };

        case 'CHANGE_ITEM_PROPERTY':
            newState[d.propertyName][d.index][d.inputName] = d.value;
            return newState;

        case 'REMOVE_ITEM':
            newState[d.propertyName].splice(d.index, 1);
            return newState;

        default:
            return state;
    }
}
export default parametersReducer;