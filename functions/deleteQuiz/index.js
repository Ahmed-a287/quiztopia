const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const { tokenCheck } = require('../../middleware/auth');
const middy = require('@middy/core');

async function deleteQuiz(event) {
  const quizId = event.pathParameters.quizId; // Hämta quizId från path parameters

  if (!quizId) {
    return sendError(400, { success: false, message: 'Quiz ID is required.' });
  }

  try {
    const params = {
      TableName: 'quizDB',
      Key: {
        quizId: quizId, // Använd quizId från path parameters
      },
    };

    // Ta bort quizet från DynamoDB
    await db.delete(params); // Ta bort quizet från databasen

    return sendResponse(200, {
      success: true,
      message: 'Quiz deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting quiz:', error); // Logga eventuella fel
    return sendError(500, { success: false, error: error.message });
  }
}
// Exportera handler med middy
module.exports.handler = middy(deleteQuiz).use(tokenCheck); // Validera token innan funktionen körs

/*const { tokenCheck } = require('../../middleware/auth');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const middy = require('@middy/core');

async function deleteQuiz(event) {
  // Extract quizId from the request path parameters
  const quizId = event.pathParameters.quizId; // Assuming quizId is in path parameters
  const userId = event.userId; // userId attached from token middleware

  if (!userId) {
    return sendError(400, { success: false, message: 'User ID is required.' });
  }

  try {
    // Define the DynamoDB delete parameters
    const params = {
      TableName: 'quizDB',
      Key: {
        quizId: quizId,
      },
    };

    // Delete the quiz item from DynamoDB
    const result = await db.delete(params).promise(); // Assuming db.delete() returns a promise

    if (result.Attributes) {
      // If the quiz is successfully deleted, send a success response
      return sendResponse(200, {
        success: true,
        message: 'Quiz deleted successfully.',
      });
    } else {
      return sendError(404, { success: false, message: 'Quiz not found.' });
    }
  } catch (error) {
    console.error('Error deleting quiz:', error); // Log error for debugging
    return sendError(500, { success: false, error: error.message });
  }
}

// Export the handler using middy to apply middleware
module.exports.handler = middy(deleteQuiz).use(tokenCheck); // Validate token before processing the request*/
