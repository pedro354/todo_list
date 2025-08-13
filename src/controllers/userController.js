const userModel = require("../models/UserModel")

const userController = {
    index: async (req, res) => {
        const users = await userModel.findAll()
        res.json(users)
    },
    create: async (req, res) => {
        try {
            const newUser = await userModel.createUser(req.body)
            res.status(201).json(newUser)
        } catch (error) {
        res.status(400).json({ error: error.message }) 
        }
    },
    save: async (req, res) => {
        const user = await userModel.saveUser(req.body)
        res.json(user)
    },

    show: async (req, res) => {
        try {
            const user = await userModel.findUser(req.params.id)
            if(!user) return res.status(404).json({error: "User not found"})
                res.json(user)
        } catch (error) {
            res.status(404).json({ error: error.message })
        }
    },
    getByEmail: async (req, res) => {
    try {
        const user = await userModel.findUserByEmail(req.params.email)
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
        res.json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
},

    update: async (req, res) => {
        const updatedUser = await userModel.updateUser(req.params.id, req.body)
        if(!updatedUser) return res.status(404).json({error: "User not found"})
        res.json(updatedUser)
    },
    delete: async (req, res) => {
        const deletedUser = await userModel.deleteUser(req.params.id)
        if(!deletedUser) return res.status(404).json({error: "User not found"})
        res.json(deletedUser)
    }
}

module.exports = userController