const Contract = require('../models/Contract');

// Get all contracts
const getContracts = async (req, res) => {
  try {
    const { search, status, type, client, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = {};

    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { contractNumber: { $regex: search, $options: 'i' } }
    ];
    if (status) query.status = status;
    if (type) query.type = type;
    if (client) query.client = client;

    const total = await Contract.countDocuments(query);
    const contracts = await Contract.find(query)
      .populate('client', 'name email company')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ contracts, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single contract
const getContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('client', 'name email company phone address')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('notes.createdBy', 'name');
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create contract
const createContract = async (req, res) => {
  try {
    const contract = await Contract.create({ ...req.body, createdBy: req.user._id });
    await contract.populate('client', 'name email company');
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contract
const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('client', 'name email company')
      .populate('assignedTo', 'name email');
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete contract
const deleteContract = async (req, res) => {
  try {
    await Contract.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add note to contract
const addNote = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: { text: req.body.text, createdBy: req.user._id } } },
      { new: true }
    ).populate('notes.createdBy', 'name');
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get expiring contracts (within next N days)
const getExpiringContracts = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const contracts = await Contract.find({
      status: 'active',
      endDate: { $gte: now, $lte: future }
    }).populate('client', 'name company').sort({ endDate: 1 });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContracts, getContract, createContract, updateContract, deleteContract, addNote, getExpiringContracts };
