const db = require('../../data/db-config');

const checkSchemeId = async (req, res, next) => {
  try {
    const { scheme_id } = req.params;
    const scheme = await db('schemes').where('scheme_id', scheme_id).first();

    if (!scheme) {
      return res.status(404).json({ message: `scheme with scheme_id ${scheme_id} not found` });
    }

    req.scheme = scheme;
    next();
  } catch (err) {
    next(err);
  }
};

const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body;

  if (!scheme_name || typeof scheme_name !== 'string' || scheme_name.trim() === '') {
    return res.status(400).json({ message: 'invalid scheme_name' });
  }

  next();
};

const validateStep = (req, res, next) => {
  const { instructions, step_number } = req.body;

  if (
    !instructions ||
    typeof instructions !== 'string' ||
    instructions.trim() === '' ||
    typeof step_number !== 'number' ||
    step_number < 1
  ) {
    return res.status(400).json({ message: 'invalid step' });
  }

  next();
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
