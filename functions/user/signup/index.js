const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../database/db');
const middy = require('@middy/core');
const { checkUsername } = require('../../../middleware/user');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jsonBodyParser = require('@middy/http-json-body-parser');

async function signup(event) {
  const { username, password } = event.body;

  try {
    const result = await checkUsername(username);
    const usersFound = result.Count;

    if (usersFound === 1) {
      return sendError(400, {
        success: false,
        message: 'Username already exists',
      });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const params = {
      TableName: 'quizUsersDb',
      Item: {
        userId: uuidv4(),
        username: username,
        password: hashedPwd,
      },
    };

    await db.put(params);

    return sendResponse(200, {
      success: true,
      message: 'User account created',
      username: username,
    });
  } catch (error) {
    console.error('Error creating user account:', error);
    return sendError(500, {
      success: false,
      message: 'Could not create user account',
      error: error.message,
    });
  }
}

module.exports.handler = middy(signup).use(jsonBodyParser());
