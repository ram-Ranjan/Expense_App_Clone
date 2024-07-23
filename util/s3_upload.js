const AWS = require('aws-sdk')
const fs = require('fs')
require('dotenv').config()

async function upload_csv(filePath){
    
    // Configure AWS SDK
    AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
    })

    const s3 = new AWS.S3()

    // Read CSV file
    const fileStream = fs.createReadStream(filePath)

    // Set upload parameters
    const uploadParams = {
        Bucket: process.env.BUCKET,
        Key: filePath.split('/')[1],
        Body: fileStream,
        ContentType: 'text/csv',
        ACL: 'public-read'
    }

    // Upload file to S3
    return new Promise((resolve,reject)=>{
        s3.upload(uploadParams, (err, data)=>{
        if (err) {
            console.error('Error uploading file:', err)
            reject(err)
        } else {
            console.log('File uploaded successfully:', data.Location)
            resolve(data.Location)
        }
        })
    })
}

module.exports = upload_csv