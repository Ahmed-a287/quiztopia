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
    // Check if the username already exists
    const result = await checkUsername(username);
    const usersFound = result.Count;

    if (usersFound === 1) {
      return sendError(400, {
        success: false,
        message: 'Username already exists',
      });
    }

    // Hash the password using bcrypt
    const hashedPwd = await bcrypt.hash(password, 10);

    const params = {
      TableName: 'quizUsersDb',
      Item: {
        userId: uuidv4(),
        username: username,
        password: hashedPwd, // Use the hashed password
      },
    };

    // Save the user to the database
    await db.put(params);

    return sendResponse(200, {
      success: true,
      message: 'User account created',
      username: username,
    });
  } catch (error) {
    console.error('Error creating user account:', error); // Log the error for debugging
    return sendError(500, {
      success: false,
      message: 'Could not create user account',
      error: error.message,
    });
  }
}

module.exports.handler = middy(signup).use(jsonBodyParser());

//THE OLD CODE
/*const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../services/db');
const middy = require('@middy/core');
const { checkUsername } = require('../../../middleware/user');
const { hashPassword } = require('../../../utils');
const { v4: uuidv4 } = require('uuid');
const jsonBodyParser = require('@middy/http-json-body-parser');

async function signup(event) {
  const { username, password } = event.body;

  const hashedPwd = await hashPassword(password);
  const result = await checkUsername(username);
  const usersFound = result.Count;

  try {
    if (usersFound === 1) {
      return sendError(400, {
        success: false,
        message: 'Username already exists',
      });
    }

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
    console.error('Error creating user account:', error); // Log the error for debugging
    return sendError(500, {
      success: false,
      message: 'Could not create user account',
      error: error.message,
    });
  }
}

module.exports.handler = middy(signup).use(jsonBodyParser());*/
