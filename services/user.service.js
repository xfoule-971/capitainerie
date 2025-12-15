const User = require('../models/user');

const getAllUsers = async () => {
    return User.find().select('-password');
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email }).select('-password');
    if (!user) throw new Error('Utilisateur non trouvé');
    return user;
};

const createUser = async (data) => {
    const user = new User(data);
    return user.save();
};

const updateUser = async (email, data) => {
    const user = await User.findOneAndUpdate(
        { email },
        data,
        { new: true, runValidators: true }
    );
    if (!user) throw new Error('Utilisateur non trouvé');
    return user;
};

const deleteUser = async (email) => {
    const user = await User.findOneAndDelete({ email });
    if (!user) throw new Error('Utilisateur non trouvé');
    return true;
};

module.exports = {
    getAllUsers,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
};
