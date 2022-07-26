const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();
var ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

//reference taken from - https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
async function putItemToDB(putparams) {
    return new Promise(function(resolve, reject) {
        ddb.putItem(putparams, function(err, data) {
            if (err) {
                console.log("puterror!!!"+err)
                resolve(false);
            } else {
                console.log(data)
                resolve(true);
            }
        })
    });
}

//reference taken from - https://stackoverflow.com/questions/41915438/node-js-aws-dynamodb-updateitem
async function updateItemDb(params) {
    console.log("inside updateItemDb"+params);
    return new Promise(function(resolve, reject) {
        dynamo.update(params, function(err, data) {
            if (err) resolve(false);
            else resolve(true);
        });
    });
}

async function updateSkillsDb(skill, email) {
    return new Promise(function(resolve, reject) {
console.log("inside updateSkillsDb"+skill);
        const skillsParams = {
            TableName: "skills",
            Key: {
                "skill": skill
            },
            UpdateExpression: "add tutors :t",
            ExpressionAttributeValues: {
                ":t":dynamo.createSet([email])
            },
            ReturnValues: "UPDATED_NEW"
        };
         resolve(updateItemDb(skillsParams));


    });
}
exports.handler = async (event, context) => {

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
            if (body.register == true) { //when user registers
                var userType = body.userType;
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
                
                var paramsTutor = {
                    TableName: 'tutor-details',
                    Item: itemsTutor
                };

                if (userType.indexOf(',') != -1) { //when user is both tutor and student put to both tables
                    await putItemToDB(paramsStudent);
                    await putItemToDB(paramsTutor);
                } else {
                    if (userType === "tutor") {
                        await putItemToDB(paramsTutor); //put to tutor table when user is tutor
                    } else {
                        await putItemToDB(paramsStudent); //put to student table when user is student
                    }
                }
            }
        } else {
            var userType = body.userType;
            if (body.skills) { //when user wants to update the details
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
                await updateItemDb(paramsTutor); //update the details in tutor table passing new values


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
                await updateItemDb(paramsStudent); //update the details in students table passing new values
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
