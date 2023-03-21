const express = require('express');
const multer  = require('multer');
const dotenv = require("dotenv");
const {GridFsStorage} = require('multer-gridfs-storage');

dotenv.config();

const storage = new GridFsStorage({ 
    url: process.env.DB,
    options: { useNewUrlParser: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpg"];

        if(match.indexOf(file.memeType) === -1) 
            return`${Date.now()}-blog-${file.originalname}`;

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        }
    }
 });

module.exports =  multer({storage});
