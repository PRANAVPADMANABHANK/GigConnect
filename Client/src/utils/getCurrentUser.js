const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser"))
}

const getCurrentAdmin = () => {
    return JSON.parse(localStorage.getItem("currentAdmin"))
}

export default {getCurrentUser, getCurrentAdmin};