const { tokenCheck } = require('../../middleware/auth');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

async function postQuestion(event) {
  const { quizId } = event.pathParameters;
  const { question, answer, longitude, latitude } = event.body;

  if (!question || !answer || !longitude || !latitude) {
    return sendError(400, {
      success: false,
      message: 'Question, answer, longitude, and latitude are required.',
    });
  }

  try {
    const params = {
      TableName: 'quizDB',
      Key: {
        quizId: quizId,
      },
      UpdateExpression:
        'SET questions = list_append(if_not_exists(questions, :emptyList), :newQuestion)',
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
        ':emptyList': [],
      },
      ReturnValues: 'ALL_NEW', // To get the updated item back
    };

    const result = await db.update(params);

    const updatedQuiz = {
      quizName: result.Attributes.quizName,
      quizId: result.Attributes.quizId,
      userId: result.Attributes.userId,
      scores: result.Attributes.scores,
      questions: result.Attributes.questions,
    };

    return sendResponse(200, { success: true, updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return sendError(500, { success: false, error: error.message });
  }
}

module.exports.handler = middy(postQuestion)
  .use(jsonBodyParser())
  .use(tokenCheck);
