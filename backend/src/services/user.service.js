const User = require('../models/User');

const getById = (id) => User.findById(id);

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }
  if (data.name) {
    user.name = data.name;
  }
  if (data.password) {
    await user.setPassword(data.password);
  }
  await user.save();
  return user;
};

module.exports = {
  getById,
  updateProfile,
};
