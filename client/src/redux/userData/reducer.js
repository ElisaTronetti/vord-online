var initialState = {
    id: null,
    email: null,
    token: null
}

const userDataReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_ID': return Object.assign({}, state, {
            id: action.payload
        })
        case 'SET_EMAIL': return Object.assign({}, state, {
            email: action.payload
        })
        case 'SET_TOKEN': return Object.assign({}, state, {
            token: action.payload
        })
        case 'RESET_USER': return initialState
        default: return state
    }
}

export default userDataReducer