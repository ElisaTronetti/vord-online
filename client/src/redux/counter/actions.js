export const increment = () => {
    return {
        type: 'INCREMENT'
    }
}

export const decrement = () => {
    return {
        type: 'DECREMENT'
    }
}

export const setValue = (value) => {
    return {
        type: 'SET_VALUE',
        payload: value
    }
}