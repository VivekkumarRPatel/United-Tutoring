var AWS = require('aws-sdk');
var sns = new AWS.SNS();
async function subscribe(params) {
    return new Promise(function(resolve, reject) {
        sns.subscribe(params, function(err, data) {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                console.log(data);
                resolve(data.SubscriptionArn);
            }
        })
    });

}

async function setSubscriptionAttributes(params) {
    return new Promise(function(resolve, reject) {
        sns.setSubscriptionAttributes(params, function(err, data) {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                console.log(data);
                resolve(false);
            }
        })
    });

}


exports.handler = async (event) => {
    var id = event.queryStringParameters.id;
    var topicArn = 'arn:aws:sns:us-east-1:861474768799:sendBookingUpdate';
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };
    try {

        const paramsSubscribe = {
            Protocol: 'email',
            TopicArn: topicArn,
            Endpoint: id,
            ReturnSubscriptionArn: true
        }
        var SubscriptionArn = await subscribe(paramsSubscribe);
        console.log(SubscriptionArn);
        var paramsFilterPolicy = {
            AttributeName: 'FilterPolicy',
            SubscriptionArn: SubscriptionArn,
            AttributeValue: '{ \"email\": [ \"' + id + '\" ] }'
        };
        if (await setSubscriptionAttributes(paramsFilterPolicy)) {
            body = '{"message":"Subscribed Successfully"}';
        }
    } catch (error) {
        console.log(error)

    }
    return {
        statusCode,
        body,
        headers,
    };


};
