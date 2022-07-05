var initialState = {
    username: null,
    id: null,
    token: null
}

const userDataReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_USERNAME': return Object.assign({}, state, {
            username: action.payload
        })
        case 'SET_ID': return Object.assign({}, state, {
            id: action.payload
        })
        case 'SET_TOKEN': return Object.assign({}, state, {
            token: action.payload
        })
        default: return state
    }
}

export default userDataReducer