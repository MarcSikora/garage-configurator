class Parameters
{
    constructor()
    {
        this.garage = {
            width: 2,
            length: 2,
            height_min: 2.1,
            height_max: 2.3,
            materialType: 0,
            material: 0
        };
        this.roof = {
            type: 0,
            materialType: 0,
            material: 0
        };
        this.gate = {
            type: 0,
            position: 0,
            width: 2,
            height: 1.9,
            materialType: 0,
            material: 0
        };
        this.doors = [];
        this.windows = [];
    }
}

export default Parameters;