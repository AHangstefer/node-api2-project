const express = require("express")

const router = express.Router()

router.get("/", (req, res)=> {
    res.json({
        message: "Hey! This is your posts.js",
    })
})

















module.export =router