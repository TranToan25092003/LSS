# Middleware Authentication System

## Middleware Overview

### 1. `checkHeaders`

- **Chức năng**: Kiểm tra headers request có chứa token hợp lệ
- **Xử lý**:
  - Kiểm tra sự tồn tại của token trong headers
  - Xác minh định dạng cơ bản của token
  - Chuyển token cho các middleware tiếp theo

### 2. `requireAuth()`

- **Chức năng**: Xác thực người dùng
- **Xử lý**:
  - Kiểm tra tính hợp lệ của token
  - Xác minh người dùng tồn tại trong hệ thống
  - Gắn `userId` vào `req.userId` cho các xử lý tiếp theo

### 3. `roleProtected`

- **Chức năng**: Kiểm tra quyền truy cập
- **Xử lý**:
  - Xác minh vai trò (role) của người dùng
  - Trả về lỗi 403 nếu không đủ quyền
  - Chỉ sử dụng sau middleware xác thực

## Cách Sử Dụng Middleware

### 1. Flow đầy đủ (Xác thực + Kiểm tra quyền)

```javascript
app.use(
  "/admin",
  checkHeaders, // B1: Kiểm tra token
  requireAuth(), // B2: Xác thực người dùng
  roleProtected, // B3: Kiểm tra quyền
  adminRouter // Xử lý route
);
```

### 2. Flow (xác thực đăng nhập, Không kiểm tra quyền)

```javascript
app.use(
  "/user",
  checkHeaders, // 1. Kiểm tra token
  requireAuth(), // 2. Xác thực
  userController // Xử lý nghiệp vụ
);
```

### 3:Lấy userId cơ bản

// Dùng sau middleware requireAuth()
const userId = req.userId;
or
get userId by: req.auth.userId

### 4. Lấy toàn bộ thông tin user (dùng Clerk)

```javascript
const { clerkClient } = require("@clerk/clerk-sdk-node");

const user = await clerkClient.users.getUser(req.userId);
```

### ⚠️ Lưu Ý Quan Trọng

- ## **Thứ tự middleware: Luôn theo đúng thứ tự:**
  -checkHeaders → requireAuth() → roleProtected

### 5. thêm data cho user trong clerk public data

```javascript
const { clerkClient } = require("../../config/clerk");

await clerkClient.users.updateUserMetadata(userId, {
  publicMetadata: {
    data: data,
  },
});
```
