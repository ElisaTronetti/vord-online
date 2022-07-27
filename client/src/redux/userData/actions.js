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

export const setUsername = (username) => {
    return {
        type: "SET_USERNAME",
        payload: username
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