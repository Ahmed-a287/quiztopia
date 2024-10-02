async function postQuestion(event) {
  // Extract quizId and other necessary data from the request
  const { quizId, question, answer, longitude, latitude } = event.body;

  // Check if userId is attached to the event by the token middleware
  const userId = event.userId; // Assuming tokenCheck middleware sets event.userId

  if (!userId) {
    return sendError(400, { success: false, message: 'User ID is required.' });
  }
  if (!quizId) {
    return sendError(400, { success: false, message: 'Quiz ID is required.' });
  }
  if (!question || !answer || !longitude || !latitude) {
    return sendError(400, {
      success: false,
      message: 'Question, answer, longitude, and latitude are required.',
    });
  }

  try {
    // Define the DynamoDB update parameters
    const params = {
      TableName: 'quizDB',
      Key: {
        quizId: quizId, // Specify the quizId to update the correct item
      },
      UpdateExpression: 'SET questions = list_append(questions, :newQuestion',
      ExpressionAttributeValues: {
        ':newQuestion': [
          {
            question: question,
            answer: answer,
            coordinates: {
              longitude: longitude,
              latitude: latitude,
            },
          },
        ],
      },
      ReturnValues: 'ALL_NEW', // To get the updated item back
    };

    // Update the quiz item in DynamoDB
    const result = await db.update(params);

    // Structure the response to have quizName, quizId, and userId before scores and questions
    const updatedQuiz = {
      quizName: result.Attributes.quizName,
      quizId: result.Attributes.quizId,
      userId: result.Attributes.userId,
      scores: result.Attributes.scores,
      questions: result.Attributes.questions,
    };

    // Send a success response with the updated quiz item
    return sendResponse(200, { success: true, updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error); // Log error for debugging
    return sendError(500, { success: false, error: error.message });
  }
}

/*const { tokenCheck } = require('../../middleware/auth');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

async function postQuestion(event) {
  const { quizId, question, answer, longitude, latitude } = event.body;
  const userId = event.userId; // Användarens ID från tokenCheck middleware

  if (!quizId || !question || !answer || !longitude || !latitude) {
    return sendError(400, {
      success: false,
      message: 'Missing fields in request.',
    });
  }

  try {
    // Hämta quizet för att kontrollera om användaren äger det
    const quiz = await db.get({
      TableName: 'quizDB',
      Key: { quizId },
    });

    if (!quiz.Item) {
      return sendError(404, { success: false, message: 'Quiz not found.' });
    }

    // Kontrollera att den inloggade användaren är quizets skapare
    if (quiz.Item.userId !== userId) {
      return sendError(403, {
        success: false,
        message: 'Only the quiz creator can add questions.',
      });
    }

    // Lägg till frågan i questions-arrayen
    const params = {
      TableName: 'quizDB',
      Key: { quizId },
      UpdateExpression:
        'SET questions = list_append(if_not_exists(questions, :emptyList), :newQuestion)',
      ExpressionAttributeValues: {
        ':newQuestion': [
          {
            question,
            answer,
            coordinates: {
              longitude,
              latitude,
            },
          },
        ],
        ':emptyList': [], // Definiera en tom lista om questions inte finns
      },

      /*UpdateExpression: 'SET questions = list_append(questions, :newQuestion)',
      ExpressionAttributeValues: {
        ':newQuestion': [
          {
            question,
            answer,
            coordinates: {
              longitude,
              latitude,
            },
          },
        ],
      },
      ReturnValues: 'UPDATED_NEW',*/
    };

    const result = await db.update(params);

    // Returnera uppdaterat quiz med nya frågor
    return sendResponse(200, {
      success: true,
      message: 'Your question has been added successfully!',
      updatedQuiz: result.Attributes,
    });
  } catch (error) {
    console.error('Error adding question:', error);
    return sendError(500, { success: false, message: error.message });
  }
}

// Exportera funktionen med middy för att applicera middleware
module.exports.handler = middy(postQuestion)
  .use(jsonBodyParser()) // För att parsa JSON body
  .use(tokenCheck); // För att validera token
  */
