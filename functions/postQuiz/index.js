const { tokenCheck } = require('../../middleware/auth');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const { v4: uuidv4 } = require('uuid');

async function postQuiz(event) {
  // Extract quizName from the request body
  const { quizName } = event.body;

  // Check if userId is attached to the event by the token middleware
  const userId = event.userId; // Assuming tokenCheck middleware sets event.userId

  if (!userId || !quizName) {
    return sendError(400, {
      success: false,
      message: !userId ? 'User ID is required.' : 'Quiz name is required.',
    });
  }

  try {
    // Define the DynamoDB put parameters
    const params = {
      TableName: 'quizDB',
      Item: {
        quizId: uuidv4(), // Generates a unique ID
        quizName: quizName, // Uses quizName from the request body
        userId: userId, // Uses userId from the token
        questions: [],
        scores: [],
      },
    };

    // Insert the new quiz item into DynamoDB
    await db.put(params); // Assuming db.put() is your DynamoDB call

    // Send a success response with the created quiz item
    return sendResponse(200, { success: true, item: params.Item });
  } catch (error) {
    console.error('Error creating quiz:', error); // Log error for debugging
    return sendError(500, { success: false, error: error.message });
  }
}

// Export the handler using middy to apply middleware
module.exports.handler = middy(postQuiz)
  .use(jsonBodyParser()) // Parse the body as JSON
  .use(tokenCheck); // Validate token before processing the request

//THE old one, changed at 19:32
/*const { tokenCheck } = require('../../middleware/auth');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const { v4: uuidv4 } = require('uuid');

async function postQuiz(event) {
  // Extract quizName from the request body and userId from the validated token
  const { quizName } = event.body;
  const userId = event.userId; // userId attached from token middleware

  try {
    // Define the DynamoDB put parameters
    const params = {
      TableName: 'quizDB',
      Item: {
        quizId: uuidv4(), // Generates a unique ID
        quizName: event.body.quizName, // Uses quizName from the request body
        userId: event.body.userId, // Uses userId from the request body
        questions: [],
        scores: [],
      },
    };

    // Insert the new quiz item into DynamoDB
    await db.put(params); // Assuming db.put() is your DynamoDB call

    // Send a success response with the created quiz item
    return sendResponse(200, { success: true, item: params.Item });
  } catch (error) {
    console.error('Error creating quiz:', error); // Log error for debugging
    return sendError(500, { success: false, error: error.message });
  }
}

// Export the handler using middy to apply middleware
module.exports.handler = middy(postQuiz)
  .use(jsonBodyParser()) // Parse the body as JSON
  .use(tokenCheck); // Validate token before processing the request*/
