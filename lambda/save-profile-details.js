const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();
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

async function updateItemDb(params) {
    return new Promise(function(resolve, reject) {
        dynamo.update(params, function(err, data) {
            if (err) console.log(err);
            else console.log(data);
        });
    });
}

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
        'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'access-control-allow-methods': 'OPTIONS,POST',
        'access-control-allow-origin': '*'
    };

    try {
        body = JSON.parse(event.body);
        if (body.register) {
            console.log("yes register");
            if (body.register == true) {
                console.log("yes register");
                var userType = body.userType;
                console.log(userType)
                var itemsStudent = {
                    'id': {
                        S: String(body.email)
                    },
                    'firstName': {
                        S: String(body.firstName)
                    },
                    'lastName': {
                        S: String(body.lastName)
                    },
                    'mobileNo': {
                        S: String(body.mobileNo)
                    },
                    'university': {
                        S: String('')
                    },
                    'program': {
                        S: String('')
                    },
                    'courses': {
                        S: String('')
                    },
                    'startyear': {
                        S: String('')
                    },
                    'endyear': {
                        S: String('')
                    }
                };
                var itemsTutor = {
                    'id': {
                        S: String(body.email)
                    },
                    'firstName': {
                        S: String(body.firstName)
                    },
                    'lastName': {
                        S: String(body.lastName)
                    },
                    'mobileNo': {
                        S: String(body.mobileNo)
                    },
                    'skills': {
                        S: String('')
                    },
                    'expyears': {
                        S: String('')
                    },
                    'expdesc': {
                        S: String('')
                    }
                };
                var paramsStudent = {
                    TableName: 'student-details',
                    Item: itemsStudent
                };
                console.log(paramsStudent)
                var paramsTutor = {
                    TableName: 'tutor-details',
                    Item: itemsTutor
                };

                if (userType.indexOf(',') != -1) {
                    await putItemToDB(paramsStudent);
                    await putItemToDB(paramsTutor);
                } else {
                    if (userType === "tutor") {
                        await putItemToDB(paramsTutor);
                    } else {
                        await putItemToDB(paramsStudent);
                    }
                }
            }
        } else {
            console.log("just save");
            var userType = body.userType;
            if (body.skills) {
                const paramsTutor = {
                    TableName: "tutor-details",
                    Key: {
                        "id": body.email
                    },
                    UpdateExpression: "set skills = :skills, expyears = :expyears, expdesc = :expdesc",
                    ExpressionAttributeValues: {
                        ":skills": body.skills,
                        ":expyears": body.expyears,
                        ":expdesc": body.expdesc
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                await updateItemDb(paramsTutor);
            } else {
                const paramsStudent = {
                    TableName: "student-details",
                    Key: {
                        "id": body.email
                    },
                    UpdateExpression: "set university = :university, program = :program, courses = :courses, startyear =:startyear, endyear = :endyear",
                    ExpressionAttributeValues: {
                        ":university": body.university,
                        ":program": body.program,
                        ":courses": body.courses,
                        ":startyear": body.startyear,
                        ":endyear": body.endyear
                    },
                    ReturnValues: "UPDATED_NEW"
                };
                await updateItemDb(paramsStudent);
            }
        }

    } catch (err) {
        statusCode = '400';
        body = err
        console.log(body)
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};