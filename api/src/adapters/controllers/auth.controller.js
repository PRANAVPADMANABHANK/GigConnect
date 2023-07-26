import User from "../../core/entities/user.model.js"

export const register = async(req,res) => {
    try {
        const newUser = new User(req.body)
        await newUser.save()
        res.status(201).send("User has been created.")
    } catch (error) {
        res.status(500).send("Something went wrong!")
    }
}

export const login = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}

export const logout = async(req,res) => {
    try {
        
    } catch (error) {
        
    }
}