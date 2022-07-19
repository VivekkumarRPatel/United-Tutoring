const aws = require('aws-sdk');
const s3 = new aws.S3();
var body = "";
async function getimg(id) {
    return new Promise(function(resolve, reject) {

        const myBucket = 'unitedtutoring-profile-images'
        const myKey = id
        const signedUrlExpireSeconds = 60 * 5
        const url = s3.getSignedUrl('getObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
        })

        resolve(url);
    });

}
exports.handler = async (event) => {
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': '*',
        'access-control-allow-origin': '*'
    };
    console.log('Received event:', JSON.stringify(event, null, 2));
    var id = event.queryStringParameters.id;
    var imgUrl = await getimg(id);
    console.log(imgUrl)
    body = JSON.stringify(imgUrl)
    return {
        statusCode,
        body,
        headers,
    };
};
