const AWS = require('aws-sdk');

//const dynamo = new AWS.DynamoDB.DocumentClient();
var ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

async function putItemToDB(putparams) {
    return new Promise(function(resolve, reject) {
        ddb.putItem(putparams, function(err, data) {
            if (err) {
                console.log(err)
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}


exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        body = JSON.parse(event.body);
        var putparams = {
            TableName: 'student-details',
            Item: {
                'id': {
                    S: String(context.awsRequestId)
                },
                'university': {
                    S: String(body.university)
                },
                'program': {
                    S: String(body.program)
                },
                'courses': {
                    S: String(body.courses)
                },
                'startyear': {
                    S: String(body.startyear)
                },
                'endyear': {
                    S: String(body.endyear)
                },
            }
        };
        console.log(await putItemToDB(putparams));

    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
