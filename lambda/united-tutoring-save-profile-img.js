const AWS = require('aws-sdk');

var s3Bucket = new AWS.S3({
    params: {
        Bucket: 'unitedtutoring-profile-images'
    }
});
//put image in s3 bucket
//reference taken from - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
async function createFile(data) {
    return new Promise(function(resolve, reject) {
        s3Bucket.putObject(data, function(err, data) {
            if (err) {
                console.log(err)
                resolve(false);
            } else {
                resolve(true);

            }
        });
    });
}

exports.handler = async (event, context) => {
   
    var body = JSON.stringify(JSON.parse(event.body));
    var imgJson = JSON.parse(body);
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };
    

    try {
        //reference taken from - https://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js
        var contentType = imgJson.file.substring("data:".length, imgJson.file.indexOf(";base64"));
        //creating image buffer
        var imgBuffer = Buffer.from(imgJson.file.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
            Key: imgJson.email, //key as user's email id as received in payload
            Body: imgBuffer,
            ContentEncoding: 'base64',
            ContentType: contentType
        };
        if (await createFile(data)) {
            console.log("done")
        } else {
            console.log("not done")
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {}
    return {
        statusCode,
        body,
        headers,
    };
};
