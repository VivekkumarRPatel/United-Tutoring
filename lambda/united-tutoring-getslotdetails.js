const AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

exports.handler = async (event) => {

    let body;
    body = JSON.parse(event.body);

    const userID = body.userid;

    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };

    const searchParams = {
        "TableName": "slots",
        "FilterExpression": "#userId = :userIdValue",
        "ExpressionAttributeNames": {
            "#userId": "tutorID"
        },
        "ExpressionAttributeValues": {
            ":userIdValue": {
                "S": userID
            }
        }
    }

    let resMesg = "";

    try {
        //reference taken from - https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
        const data = await dynamodb.scan(searchParams).promise(); //scan db table to get all slots of that user using userid filter
        if (data.Items) {
            resMesg = data.Items;
        } else {
            resMesg = "Data not found";
        }

    } catch (err) {
        console.log("Error while retrieving get item");
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(resMesg),
        headers
    };
    return response;
};
