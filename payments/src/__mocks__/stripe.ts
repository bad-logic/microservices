export const stripe = {
    charges:{
        create: jest.fn().mockResolvedValue({
            id:"somestringrandom"
        }) // every time this function is called it automatically
        // returns promise that resolves to an empty object
    }
}