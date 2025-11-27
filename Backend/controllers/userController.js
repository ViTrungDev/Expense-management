import User from "../modules/User.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Tạo token JWT
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      provider: user.provider,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER USER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      provider: "local",
      isAdmin: false 
    });

    res.json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, provider: "local" });
    if (!user)
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = createToken(user);

    res.json({ message: "Đăng nhập thành công", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN WITH GOOGLE
export const loginWithGoogle = async (req, res) => {
  try {
    const { name, email, providerId, avatar } = req.body;

    let user = await User.findOne({ email, provider: "google" });
    if (!user) {
      user = await User.create({
        name,
        email,
        provider: "google",
        providerId,
        avatar,
        isAdmin: false
      });
    } else if (user.provider !== "google") {
      user.provider = "google";
      user.providerId = providerId;
      user.avatar = avatar;
      await user.save();
    }

    const token = createToken(user);
    res.json({ message: "Đăng nhập Google thành công", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN WITH FACEBOOK
export const loginWithFacebook = async (req, res) => {
  try {
    const { name, email, providerId, avatar } = req.body;

    let user = await User.findOne({ email, provider: "facebook" });
    if (!user) {
      user = await User.create({
        name,
        email,
        provider: "facebook",
        providerId,
        avatar,
        isAdmin: false
      });
    } else if (user.provider !== "facebook") {
      user.provider = "facebook";
      user.providerId = providerId;
      user.avatar = avatar;
      await user.save();
    }

    const token = createToken(user);
    res.json({ message: "Đăng nhập Facebook thành công", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET CURRENT USER
export const getUser = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền" });
    }

    const { id } = req.params; 
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền" });
    }

    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// UPDATE USER (ADMIN ONLY)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Bạn không có quyền" });

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE USER (ADMIN ONLY)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Bạn không có quyền" });

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ message: "Xóa thành công", user: deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
