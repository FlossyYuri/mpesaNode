module.exports = (app) => {
  const db = app.config.firebase;

  const signIn = async (req, resp) => {
    const data = { ...req.body };
    resp.send('Sem dados');
  };
  const signUp = async (req, resp) => {
    const data = { ...req.body };
    resp.send('Sem dados');
  };
  const update = async (req, resp) => {
    const data = { ...req.body };
    resp.send('Sem dados');
  };

  return { signIn, signUp, update };
};
