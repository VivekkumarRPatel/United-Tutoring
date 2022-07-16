const AWS = require('aws-sdk');

var s3Bucket = new AWS.S3({
    params: {
        Bucket: 'unitedtutoring-profile-images'
    }
});
//function to create file in bucket tagsb00890746
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
    //console.log('Received event:', JSON.stringify(event, null, 2));
    var body = JSON.stringify(JSON.parse(event.body));
    var imgJson = JSON.parse(body);
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };
    console.log(event.body);

    try {
        var contentType = imgJson.file.substring("data:".length, imgJson.file.indexOf(";base64"));

        var imgBuffer = Buffer.from(imgJson.file.replace(/^data:image\/\w+;base64,/, ""), 'base64')
        var data = {
            Key: imgJson.email,
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