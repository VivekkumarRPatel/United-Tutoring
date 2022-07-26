var AWS = require("aws-sdk");
const s3 = new AWS.S3();
var body = "";
AWS.config.update({
    region: "us-east-1"
});

var dynamodb = new AWS.DynamoDB({
    apiVersion: "2012-08-10"
});


//reference taken from - https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
async function getUserDetails(params) {
    return new Promise(function(resolve, reject) {
        dynamodb.getItem(params, function(err, data) {
            if (err) {
                console.log(err);
                resolve("");
            } else {
                resolve(data);
            }
        })
    });
}

async function getTutorList(Tutorskills) {
    console.log(Tutorskills)
    var tutorsSet = new Set();
    if (Tutorskills === " ") {
        var params = {
            TableName: "tutor-details"
        };
        var result = await dynamodb.scan(params).promise();
        for (let i = 0; i < result.Items.length; i++) {
            var firstName = "{\"firstName\":\"" + result.Items[i].firstName.S + "\",";
            var lastName = "\"lastName\":\"" + result.Items[i].lastName.S + "\",";
            var mobileNo = "\"mobileNo\":\"" + result.Items[i].mobileNo.S + "\",";
            var email = "\"email\":\"" + result.Items[i].id.S + "\",";
            var expyears = "\"expyears\":" + result.Items[i].expyears.N + ",";
            var expdesc = "\"expdesc\":\"" + result.Items[i].expdesc.S + "\",";
            var skill = "\"skills\":\"" + result.Items[i].skills.S + "\"";
            var tutor = firstName + lastName + mobileNo + email + expyears + expdesc + skill + "}";
            console.log(tutor)
            tutorsSet.add(tutor);
        }

    } else {
        const skills = Tutorskills.split(",");
        console.log("len:" + skills.length);

        for (let j = 0; j < skills.length; j++) {
            try {
                var params = {
                    TableName: "tutor-details",
                    FilterExpression: "contains(skills,:s)",
                    ExpressionAttributeValues: {
                        ":s": {
                            S: skills[j]
                        }
                    },
                };
                var result = await dynamodb.scan(params).promise()
                console.log(skills[j] + result.Items.length);
                for (let i = 0; i < result.Items.length; i++) {
                    var firstName = "{\"firstName\":\"" + result.Items[i].firstName.S + "\",";
                    var lastName = "\"lastName\":\"" + result.Items[i].lastName.S + "\",";
                    var mobileNo = "\"mobileNo\":\"" + result.Items[i].mobileNo.S + "\",";
                    var email = "\"email\":\"" + result.Items[i].id.S + "\",";
                    var expyears = "\"expyears\":" + result.Items[i].expyears.N + ",";
                    var expdesc = "\"expdesc\":\"" + result.Items[i].expdesc.S + "\",";
                    var skill = "\"skills\":\"" + result.Items[i].skills.S + "\"";
                    var tutor = firstName + lastName + mobileNo + email + expyears + expdesc + skill + "}";
                    console.log(tutor)
                    tutorsSet.add(tutor);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    return tutorsSet;
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

    if (JSON.parse(event.body).id) {
        var userType = JSON.parse(event.body).userType;

        if (userType.indexOf(',') != -1) {
            var paramsTutor = {
                TableName: 'tutor-details',
                Key: {
                    'id': {
                        S: JSON.parse(event.body).id
                    }
                }
            };
            var tutordetails = await getUserDetails(paramsTutor);
            console.log("tutordetails");
            console.log(tutordetails);
            var paramsStudent = {
                TableName: 'student-details',
                Key: {
                    'id': {
                        S: JSON.parse(event.body).id
                    }
                }
            };

            var studentdetails = await getUserDetails(paramsStudent);

            body = {
                "firstName": tutordetails.Item.firstName.S,
                "lastName": tutordetails.Item.lastName.S,
                "mobileNo": tutordetails.Item.mobileNo.S,
                "email": tutordetails.Item.id.S,
                "expyears": tutordetails.Item.expyears.S,
                "expdesc": tutordetails.Item.expdesc.S,
                "skills": tutordetails.Item.skills.S,
                "courses": studentdetails.Item.courses.S,
                "program": studentdetails.Item.program.S,
                "university": studentdetails.Item.university.S,
                "startyear": studentdetails.Item.startyear.S,
                "endyear": studentdetails.Item.endyear.S,
            };

        } else {
            if (userType === "tutor") {
                var paramsTutor = {
                    TableName: 'tutor-details',
                    Key: {
                        'id': {
                            S: JSON.parse(event.body).id
                        }
                    }
                };
                var tutordetails = await getUserDetails(paramsTutor);
                body = {
                    "firstName": tutordetails.Item.firstName.S,
                    "lastName": tutordetails.Item.lastName.S,
                    "mobileNo": tutordetails.Item.mobileNo.S,
                    "email": tutordetails.Item.id.S,
                    "expyears": tutordetails.Item.expyears.S,
                    "expdesc": tutordetails.Item.expdesc.S,
                    "skills": tutordetails.Item.skills.S
                };

            } else {
                var paramsStudent = {
                    TableName: 'student-details',
                    Key: {
                        'id': {
                            S: JSON.parse(event.body).id
                        }
                    }
                };

                var studentdetails = await getUserDetails(paramsStudent);
                body = {
                    "firstName": studentdetails.Item.firstName.S,
                    "lastName": studentdetails.Item.lastName.S,
                    "mobileNo": studentdetails.Item.mobileNo.S,
                    "email": studentdetails.Item.id.S,
                    "courses": studentdetails.Item.courses.S,
                    "program": studentdetails.Item.program.S,
                    "university": studentdetails.Item.university.S,
                    "startyear": studentdetails.Item.startyear.S,
                    "endyear": studentdetails.Item.endyear.S,
                };
            }
        }
        body = JSON.stringify(body);
    } else if (JSON.parse(event.body).skills) {
        var tutorStr = "";
        if (JSON.parse(event.body).skills === " ") {
            console.log("has skills=");
            var tutorList = await getTutorList(" ");
            for (const tutor of tutorList) {
                tutorStr = tutorStr + tutor + ",";
            }
            body = '{"tutors":[' + tutorStr.slice(0, -1) + ']}';

        } else {
            var tutorStr = "";
            var skillset = JSON.parse(event.body).skills;
            console.log(skillset);
            var tutorList = await getTutorList(skillset);
            for (const tutor of tutorList) {
                tutorStr = tutorStr + tutor + ",";
            }
            body = '{"tutors":[' + tutorStr.slice(0, -1) + ']}';
        }
    }

    return {
        statusCode,
        body,
        headers,
    };
};