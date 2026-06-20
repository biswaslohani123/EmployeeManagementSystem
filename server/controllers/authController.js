import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

//  login for employee and admin

import User from "../models/User";

const login = async (req, res) => {
    try {

        const {email, password, role} = req.body;

        if (!email || !password) {

            return res.status(400).json({error: "Email and password are required"});
            
        }

        const user = await User.findOne({email})

        if (!user) {

            return res.status(401).json({error: "Invalid Credentials"})
            
        }

        if (role === 'admin' && user.role !== 'ADMIN') {

            return res.status(401).json({error: "Not Authorized as admin"})
            
        }

        if (role === 'employee' && user.role !== 'EMPLOYEE') {

            return res.status(401).json({error: "Not Authorized as employee"})
            
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return res.status(401).json({error: "Invalid credintials"}) ;        
        }

        const payload = {
            
            userId : user._id.toString(),
            role: user.role,
            email: user.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"})

        return res.json({user: payload, token})


        
    } catch (error) {

        console.log("Login error:", error);
        return res.status(500).json({error: "Login failed"})

        
        
    }
}

// get session for employee and admin
// get /api/auth/session

const session = (req, res) => {

    const session = req.session

    return res.json({user: session})
}

const changePassword = async (req, res) => {

    try {

        const session = req.session
        const {currentPassword, newPassword} = req.body

        if (!currentPassword || !newPassword) {

            return res.status(400).json({error: "Both password are required"})
            
        }

        const user = await User.findById(session.userId)

        if (!user) {

            return res.status(404).json({error:"User not found"})
            
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {

            return res.status(400).json({error: "Current password is incorrect"})
        }

        const hashed = await bcrypt.hash(newPassword, 10)

        await User.findByIdAndUpdate(session.userId, {password: hashed})

        return res.json({success: true})
        
    } catch (error) {

        return res.json({success: false, message: error.message})
        
    }
}


export {login, session, changePassword}