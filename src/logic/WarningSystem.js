import * as C from '../logic/Constants'

class WarningSystem
{
    getWarnings(params)
    {
        const warnings = [];

        if(params.garage.width < params.gate.width)
            warnings.push(C.WARNINGS.GATE_WIDTH);

        if(params.garage.height_min < params.gate.height)
            warnings.push(C.WARNINGS.GATE_HEIGHT);

        if(params.gate.type === C.GATE_TYPES.NONE && params.doors.length === 0)
            warnings.push(C.WARNINGS.NO_ENTRY);

        if(params.garage.height_min > params.garage.height_max)
            warnings.push(C.WARNINGS.GARAGE_HEIGHT);
        
        return warnings;
    }
}
export default WarningSystem;