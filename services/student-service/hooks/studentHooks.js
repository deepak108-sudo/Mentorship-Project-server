import bcrypt from 'bcryptjs';

export const hashPasswordHook = async function (next) {
  if (!this.isModified('password')) return next(); // only hash if changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
};
