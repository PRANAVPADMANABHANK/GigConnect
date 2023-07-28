const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = "User not found";

  return err;
};

export default createError;
