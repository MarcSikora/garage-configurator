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

        if(params.gate.type !== C.GATE_TYPES.NONE && this.checkDoorGateOverlap(params))
            warnings.push(C.WARNINGS.DOOR_GATE_OVERLAP);

        if(this.checkDoorDoorOverlap(params))
            warnings.push(C.WARNINGS.DOOR_DOOR_OVERLAP);

        if(this.checkWindowGateOverlap(params))
            warnings.push(C.WARNINGS.WINDOW_GATE_OVERLAP);

        if(this.checkDoorWindowOverlap(params))
            warnings.push(C.WARNINGS.DOOR_WINDOW_OVERLAP);

        if(this.checkWindowWindowOverlap(params))
            warnings.push(C.WARNINGS.WINDOW_WINDOW_OVERLAP);

        if(this.checkDoorOutside(params))
            warnings.push(C.WARNINGS.DOOR_OUTSIDE);

        if(this.checkWindowOutside(params))
            warnings.push(C.WARNINGS.WINDOW_OUTSIDE);

        return warnings;
    }

    checkDoorGateOverlap(params)
    {
        let lefts = [
            0, 
            params.garage.width*0.5 - params.gate.width*0.5, 
            params.garage.width - params.gate.width 
        ];

        let gateLeft = lefts[params.gate.position];
        let gateRight = gateLeft + params.gate.width;
        
        let frontDoors = params.doors.filter(door => door.wall === C.WALLS.FRONT);

        return frontDoors.some(door => 
            gateLeft < door.position + C.DOOR_WIDTH && 
            door.position < gateRight
        );
    }

    checkDoorDoorOverlap(params)
    {
        return params.doors.some(door => {
            let sameWallDoors = params.doors.filter(d => d !== door).filter(d => door.wall === d.wall);

            return sameWallDoors.some(d => 
                d.position < door.position + C.DOOR_WIDTH && 
                door.position < d.position + C.DOOR_WIDTH
            )
        });
    }

    checkRectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2)
    {
        if (x1 < x2 + w2 &&
            x1 + w1 > x2 &&
            y1 < y2 + h2 &&
            h1 + y1 > y2) 
            return true;
        return false;
    }

    checkWindowGateOverlap(params)
    {
        let lefts = [
            0, 
            params.garage.width*0.5 - params.gate.width*0.5, 
            params.garage.width - params.gate.width 
        ];

        let gateX = lefts[params.gate.position];
        
        let frontWindows = params.windows.filter(door => door.wall === C.WALLS.FRONT);
        return frontWindows.some(window => 
            this.checkRectsOverlap(
                gateX, 
                0, 
                params.gate.width, 
                params.gate.height,
                window.positionX, 
                window.positionY, 
                C.WINDOW_SIZES[window.type].WIDTH, 
                C.WINDOW_SIZES[window.type].HEIGHT
            ));
    }

    checkDoorWindowOverlap(params)
    {
        return params.doors.some(door => {
            let sameWallWindows = params.windows.filter(window => door.wall === window.wall);
            return sameWallWindows.some(window => 
                this.checkRectsOverlap(
                    door.position, 
                    0, 
                    C.DOOR_WIDTH, 
                    C.DOOR_HEIGHT,
                    window.positionX, 
                    window.positionY, 
                    C.WINDOW_SIZES[window.type].WIDTH * 0.01, 
                    C.WINDOW_SIZES[window.type].HEIGHT * 0.01
                ));
        })
    }

    checkWindowWindowOverlap(params)
    {
        return params.windows.some(window => {
            let sameWallWindows = params.windows.filter(w => w !== window).filter(w => window.wall === w.wall);
            return sameWallWindows.some(w => 
                this.checkRectsOverlap(
                    window.positionX, 
                    window.positionY, 
                    C.WINDOW_SIZES[window.type].WIDTH * 0.01, 
                    C.WINDOW_SIZES[window.type].HEIGHT * 0.01,
                    w.positionX, 
                    w.positionY, 
                    C.WINDOW_SIZES[w.type].WIDTH * 0.01, 
                    C.WINDOW_SIZES[w.type].HEIGHT * 0.01
                ));
        })
    }

    checkDoorOutside(params)
    {
        return params.doors.some(door => {
            let side = [C.WALLS.LEFT, C.WALLS.RIGHT].includes(door.wall) ? 
                params.garage.length : params.garage.width;
            
            let maxDoorPosition = parseFloat((side - C.DOOR_WIDTH - C.SPACE).toFixed(1));
            return (maxDoorPosition < door.position)
        })
    }

    checkWindowOutside(params)
    {
        return params.windows.some(window => {
            let side = [C.WALLS.LEFT, C.WALLS.RIGHT].includes(window.wall) ? 
                params.garage.length : params.garage.width;
            
            let maxWindowPositionX = parseFloat((side - C.WINDOW_SIZES[window.type].WIDTH*0.01 - C.SPACE).toFixed(1));
            let maxWindowPositionY = parseFloat((params.garage.height_min - C.WINDOW_SIZES[window.type].HEIGHT*0.01 - C.SPACE).toFixed(1));
            return (maxWindowPositionX < window.positionX || maxWindowPositionY < window.positionY)
        })
    }
}
export default WarningSystem;