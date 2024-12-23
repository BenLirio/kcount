const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const COUNTER_ID = "main";

  try {
    if (event.httpMethod === "POST") {
      await dynamodb.send(
        new UpdateCommand({
          TableName: "kill-counter",
          Key: { id: COUNTER_ID },
          UpdateExpression: "SET #count = if_not_exists(#count, :zero) + :inc",
          ExpressionAttributeNames: { "#count": "count" },
          ExpressionAttributeValues: { ":inc": 1, ":zero": 0 },
        })
      );
    }

    const result = await dynamodb.send(
      new GetCommand({
        TableName: "kill-counter",
        Key: { id: COUNTER_ID },
      })
    );

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
