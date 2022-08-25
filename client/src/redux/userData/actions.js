export const setId = (id) => {
    return {
        type: "SET_ID",
        payload: id
    }
}

export const setEmail = (email) => {
    return {
        type: "SET_EMAIL",
        payload: email
    }
}

export const setToken = (token) => {
    return {
        type: "SET_TOKEN",
        payload: token
    }
}

export const resetUser = () => {
    return {
        type: "RESET_USER"
    }
}