const db = require('../../data/db-config');

function find() {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .orderBy('sc.scheme_id', 'asc');
}

function findById(scheme_id) {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .select('sc.scheme_id', 'sc.scheme_name', 'st.step_id', 'st.step_number', 'st.instructions')
    .orderBy('st.step_number', 'asc')
    .then(rows => {
      if (rows.length === 0) {
        return null; 
      }

      const scheme = {
        scheme_id: rows[0].scheme_id,
        scheme_name: rows[0].scheme_name,
        steps: rows
          .filter(row => row.step_id) 
          .map(row => ({
            step_id: row.step_id,
            step_number: row.step_number,
            instructions: row.instructions,
          })),
      };

      return scheme;
    });
}

function findSteps(scheme_id) {
  return db('steps as st')
    .join('schemes as sc', 'st.scheme_id', 'sc.scheme_id')
    .where('st.scheme_id', scheme_id)
    .select('st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
    .orderBy('st.step_number', 'asc');
}

function add(scheme) {
  return db('schemes')
    .insert(scheme)
    .then(([id]) => {
      return db('schemes').where('scheme_id', id).first();
    });
}


function addStep(scheme_id, step) {
  return db('steps')
    .insert({ ...step, scheme_id })
    .then(() => {
      return findSteps(scheme_id);
    });
}


module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
