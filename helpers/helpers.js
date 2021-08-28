const getUserName = (req, res) => {
  console.log(req.session.user);
  const userName = req.session.user.username;
  const currentUserName = userName[0].toUpperCase() + userName.slice(1);
  return currentUserName;
};

module.exports = { getUserName };
