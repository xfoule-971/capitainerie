const Catway = require('../models/catway');

const getAllCatways = async () => {
    return Catway.find();
};

const getCatwayById = async (id) => {
    const catway = await Catway.findById(id);
    if (!catway) throw new Error('Catway non trouvé');
    return catway;
};

const createCatway = async (data) => {
    const catway = new Catway(data);
    return catway.save();
};

const updateCatway = async (id, data) => {
    const catway = await Catway.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
    if (!catway) throw new Error('Catway non trouvé');
    return catway;
};

const deleteCatway = async (id) => {
    const catway = await Catway.findByIdAndDelete(id);
    if (!catway) throw new Error('Catway non trouvé');
    return true;
};

module.exports = {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    deleteCatway
};
