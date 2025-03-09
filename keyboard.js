// Helper functions to create Telegram keyboard markup

// Create inline keyboard markup
function createInlineKeyboard(buttons) {
  return {
    inline_keyboard: buttons
  };
}

// Create reply keyboard markup
function createReplyKeyboard(buttons, options = {}) {
  return {
    keyboard: buttons,
    resize_keyboard: options.resize !== false,
    one_time_keyboard: options.oneTime || false,
    selective: options.selective || false
  };
}

// Remove keyboard
function removeKeyboard(selective = false) {
  return {
    remove_keyboard: true,
    selective: selective
  };
}

module.exports = {
  createInlineKeyboard,
  createReplyKeyboard,
  removeKeyboard
}; 