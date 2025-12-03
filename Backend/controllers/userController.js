import User from "../modules/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";
const createAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      provider: user.provider,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } 
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } 
  );
};


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist)
      return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      provider: "local",
      isAdmin: false,
      lastLogin: new Date()
    });

    // Gửi email 
    await sendMail(
      email,
      "Chào mừng đến với Expense Management",
`
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2d6cdf; margin: 0;">Expense Management</h1>
        </div>

        <h2>Xin chào ${name}! 👋</h2>

        <p>
          Chúc mừng bạn đã đăng ký thành công và chính thức trở thành một phần trong cộng đồng 
          <strong>Expense Management</strong>! Chúng tôi rất vui khi được đồng hành cùng bạn trên hành trình 
          quản lý chi tiêu một cách thông minh, chủ động và hiệu quả hơn mỗi ngày.
        </p>

        <p>
          Tại Expense Management, chúng tôi luôn tin rằng việc theo dõi và kiểm soát tài chính cá nhân 
          không chỉ giúp bạn tiết kiệm tốt hơn mà còn mở ra nhiều cơ hội để phát triển và đạt được những mục tiêu lớn hơn trong tương lai. 
          Với các công cụ phân tích rõ ràng, giao diện dễ dùng, và hệ thống nhắc nhở thông minh, chúng tôi hy vọng sẽ mang đến cho bạn 
          một trải nghiệm mượt mà, hiện đại và thực sự hữu ích.
        </p>

        <p>
          Hãy dành một chút thời gian khám phá các tính năng như ghi chép chi tiêu, phân loại giao dịch, 
          phân tích biểu đồ trực quan và mục tiêu tài chính cá nhân. Tất cả đều được thiết kế để giúp bạn làm chủ túi tiền của mình 
          theo cách đơn giản và hiệu quả nhất.
        </p>

        <p>
          Một lần nữa, cảm ơn bạn đã lựa chọn Expense Management. Chúng tôi luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.  
          Chúc bạn có một hành trình thật tuyệt vời cùng chúng tôi! ✨
        </p>

        <div style="margin-top: 30px; text-align: center; color: #888;">
          <p>------ Đội ngũ Expense Management ------</p>
        </div>
      </div>
      `

    );

    res.json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, provider: "local" });
    if (!user)
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    if (!user.active) {
    return res.status(403).json({ message: "Tài khoản không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//    REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Không có token" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Token không hợp lệ" });

    // Check 7 ngày 
    const days = (Date.now() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24);
    if (days > 7) {
      return res.status(403).json({ message: "Đã quá 7 ngày, vui lòng đăng nhập lại" });
    }

    // Verify refresh token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = createAccessToken(user);

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

//   ĐĂNG NHẬP GOOGLE
export const loginWithGoogle = async (req, res) => {
  try {
    const { name, email, providerId, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        provider: "google",
        providerId,
        avatar,
        isAdmin: false,
        lastLogin: new Date()
      });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({ message: "Đăng nhập Google thành công", accessToken, refreshToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//   ĐĂNG NHẬP FACEBOOK
export const loginWithFacebook = async (req, res) => {
  try {
    const { name, email, providerId, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        provider: "facebook",
        providerId,
        avatar,
        isAdmin: false,
        lastLogin: new Date()
      });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.json({ message: "Đăng nhập Facebook thành công", accessToken, refreshToken, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//       QUÊN MẬT KHẨU
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Email không tồn tại" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otpCode = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendMail(
    email,
    <div style="font-family: Arial, sans-serif; color: #333;">
        <img src="cid:logo" style="width: 120px; margin-bottom: 20px;" alt="Smart Coin Logo"/>
        <h2>Xin chào ${name || "người dùng"},</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản Smart Coin của mình.</p>
        <p><b>Mã OTP của bạn:</b></p>
        <h1 style="color: #2F80ED;">${otp}</h1>
        <p>Mã OTP có hiệu lực trong <b>5 phút</b>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        <hr />
        <p>Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ: 
          <a href="mailto:smartcoin152@gmail.com">smartcoin152@gmail.com</a>
        </p>
        <p>Chúc bạn một ngày tốt lành! <br/>Smart Coin Team</p>
      </div>
  );

  res.json({ message: "OTP đã gửi về email" });
};

//       VERIFY OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Email không tồn tại" });

  if (user.otpCode !== otp)
    return res.status(400).json({ message: "OTP không đúng" });

  if (Date.now() > user.otpExpires)
    return res.status(400).json({ message: "OTP đã hết hạn" });

  res.json({ message: "OTP hợp lệ" });
};

//   ĐẶT LẠI MẬT KHẨU
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Email không tồn tại" });

  if (user.otpCode !== otp)
    return res.status(400).json({ message: "OTP không đúng" });

  if (Date.now() > user.otpExpires)
    return res.status(400).json({ message: "OTP đã hết hạn" });

  const hashed = await bcrypt.hash(newPassword, 10);

  user.password = hashed;
  user.otpCode = null;
  user.otpExpires = null;
  await user.save();

  res.json({ message: "Đổi mật khẩu thành công" });
};

//     GET 1 USER
export const getUser = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Bạn không có quyền" });

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//     GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Bạn không có quyền" });

    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//    UPDATE USER
export const updateUser = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Bạn không có quyền" });

    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ message: "Cập nhật thành công", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SOFT DELETE USER — chuyển active thành false
export const deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Bạn không có quyền" });

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json({ message: "Vô hiệu hóa người dùng thành công", user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

