const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const COUNTER_ID = "main";

  try {
    if (event.httpMethod === "POST") {
      await dynamodb
        .update({
          TableName: "kill-counter",
          Key: { id: COUNTER_ID },
          UpdateExpression: "SET #count = if_not_exists(#count, :zero) + :inc",
          ExpressionAttributeNames: { "#count": "count" },
          ExpressionAttributeValues: { ":inc": 1, ":zero": 0 },
        })
        .promise();
    }

    const result = await dynamodb
      .get({
        TableName: "kill-counter",
        Key: { id: COUNTER_ID },
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        count: result.Item?.count || 0,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
