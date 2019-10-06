'use strict';

const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.handler = async event => {
    await sleep(2000);

    const message = JSON.parse(event.Records[0].body);

    const numberIsEven = message.input.number % 2 === 0;

    if (numberIsEven) {
        let output = JSON.stringify({
            success: true,
            result: uuidv4()
        });

        let params = {
            output,
            taskToken: message.taskToken
        };

        await stepfunctions.sendTaskSuccess(params).promise();
    }
    else {
        let params = {
            cause: "The input number was uneven.",
            error: "UnevenNumberError",
            taskToken: message.taskToken
        };
        
        await stepfunctions.sendTaskFailure(params).promise();
    }

    return output;
};
