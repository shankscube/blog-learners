const User = require('../models/User');

exports.getAllUsers = async () => {
    return await User.findAll();
}

exports.createUser = async (userData) => {
    const { fullname, email, password, age, gender } = userData;
    const createdUser = await User.create({
                                        name: fullname,
                                        email,
                                        password,
                                        age,
                                        gender
                                    });
    if(!createdUser)
        return null;
    
    return createdUser;
}