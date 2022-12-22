const User = require('../models/user');
const Show = require('../models/show');

const getShows = async (req, res) => {
  try {
    // Get user with shows populated
    const user = await User.findById(req.user.id).populate('shows');

    // Check user exists
    if(!user) return res.status(404).send();

    res.status(200).json(user.shows);
  } catch (err) {
    res.status(500).send();
  }
}

const createShow = async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);

    // Check user exists
    if(!user) return res.status(404).send();

    const { title, apiId } = req.body;

    if (!title || !apiId) return res.status(400).send();

    // Check if show with users id exists
    if (await Show.findOne({ apiId: apiId, user: user._id })) {
      return res.status(409).send();
    }

    // Create show
    const show = await Show.create({
      title: title,
      apiId: apiId,
      user: user._id,
    });

    // Add created shows id to users shows
    user.shows.push(show._id);
    await user.save();
    res.status(201).send();
  } catch (err) {
    res.status(500).send();
  }
}

const deleteShow = async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);

    // Check user exists
    if(!user) return res.status(404).send();

    // Get show
    const show = await Show.findOne({ title: req.params.title, user: user._id });

    // Check show exists
    if (!show) return res.status(404).send();

    // Remove show from users shows
    user.shows = user.shows.filter(showRef => showRef.toString() !== show._id.toString());
    // Delete show
    await show.remove();
    await user.save();
    res.status(204).send();
  } catch (err) {
    res.status(500).send();
  }
}

module.exports = { getShows, createShow, deleteShow }