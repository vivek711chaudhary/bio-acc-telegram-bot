const { sendMessage } = require('./bot');

// Send notification to a specific user
async function notifyUser(userId, message) {
  return sendMessage(userId, message);
}

// Send notification to multiple users
async function notifyUsers(userIds, message) {
  const promises = userIds.map(userId => sendMessage(userId, message));
  return Promise.all(promises);
}

// Send notification with action buttons
async function notifyWithActions(userId, message, actions) {
  const buttons = actions.map(action => [{
    text: action.text,
    callback_data: action.data
  }]);
  
  return sendMessage(userId, message, {
    replyMarkup: { inline_keyboard: buttons }
  });
}

module.exports = {
  notifyUser,
  notifyUsers,
  notifyWithActions
}; 