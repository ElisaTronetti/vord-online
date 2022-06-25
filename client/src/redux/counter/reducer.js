var initialState = {
    value: 0,
    test: true
}

const counterReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'INCREMENT': return Object.assign({}, state, {
            value: state.value + 1
        })
        case 'DECREMENT': return Object.assign({}, state, {
            value: state.value - 1
        })
        case 'SET_VALUE':  return Object.assign({}, state, {
            value: action.payload
        })
        default: return state
    }
}

export default counterReducer