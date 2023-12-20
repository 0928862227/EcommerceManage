# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

Video 1 : Set up localhost 2 cuc package.js
    1 file src/server/server.js
    1 file env 
    Cách ẩn những file ko dùng đến (File/Setting/..) in VScode 
    1 file .gitignore
    1 file .git (dùng git để control source code)
    tạo 1 github và kết nối project lên github bằng terminal trong VScode
    1 folder config để connect database
    1 folder models để lưu/tạo bảng và ràng buộc đối tượng của bảng trong db
    1 folder models 
    1 folder routes để lấy những api 
    1 folder middlewartes
    1 folder ultils

Video 2 : Kết nối mongodb và tạo document user
    xử lí folder config (10:25)
    fix lỗi ko connect laptop local vs mongo compass (8:01)
    tên database trong mogo có ở file .env 6:52
    xử lí folder models ,các file này giúp tạo bảng 
    cú pháp tạo nhanh 1 bảng model: |mdbgum + tab
    tạo vài bảng trong file models/user này (validate/trigger)
    xử lí folder routes 
    dừng ở khúc 24:21
    xử lí folder controllers/user (26)
    vocabulary :request~yêu cầu
                detect~phát hiện
                register~đăng ký
                hash~chia nhỏ việc/băm 
                handle~ xử lý
                async~không đồng bộ
                compare~so sách
                response~phản ứng
                token~mã thông báo
                await~chờ đợi (vid4/34:00)
                access~truy cập
                refresh~làm mới lại..
                verify~xác minh
                request~ Yêu cầu
                current~hiện tại
                Expires~ Hết hạn
                utils~Tiện ích

    xử lí folder routes/user (32)
    xử lí folder routes/index (36:44) để gọi links api các file cùng cấp
    test (user) ,postman và api 40
   
   err : funcion async in server/config/dbConnect.js có function connection.readyState thông báo không thể kết nối đến csdl với local host mặc định .
   fix bug : thêm biến url ở server/config/dbConnect.js line 3 và kết nối bằng localhost đó 
   nguyên nhân bug : có thể ko thể tham chiếu tới file .env để lấy localhost
   và bug khác là file .env ko hoạt động ~

    test (user) gửi api lên postman thành công.file controller/user đã active 42:29
    add data user bằng postman 42:50
    check data on mongoDB 45:06

Video 3 : Hash password in mongodb
    tăng tính bảo mật ,leak ra cũng an toàn 
    lý thuyết muối vào cốc nước 10:50
    vào file models/user line78
    function pre(việc sẽ làm ,việc đang làm)
    function bcrypt.genSaltSync(số lượng kí tự) : mã hóa mật khẩu không đọc được
    xóa 1 documents trong mongodb 13:29
    function isModified giúp phát hiện thay đổi mật khẩu 17:22
    tạo file middlewares/errHandler để custom lỗi trên terminal để dễ hiểu 39:32
    gọi function cus err bên router/index 24:08 để khi đọc api có err thì báo err 26:42
    git add 32:30

Video 4 : Code logic register and login 
    register : 
        1. check email này đã login hay chưa và bắt đầu nạp dư liệu tạo account mới
            ? 4:13->6:33 coding controllers/user
        2. Tạo enviromments base_url để dễ dàng connect API trong postman 14:02 
        3. Viết function login trong controllers/user 18:10 và 25:06
        4. Viết function check password có tồn tại hay không trong models/user
        5. Viết function câu api login trong routes/user 25:29
        6. Vào postman tạo new request đặt tên là login 29:52
        7. SThử login trên postman bằng body/x-www-form-urlencoded 30:34
        8. Ẩn thông tin quan trọng như ps,role,.. trong controller/user để 
            sau này hiển thị lên cho người dùng 37:05
        9. Ẩn node_module 39:21

Video 5 : access token & refresh token 
token : mã token này sẽ được tạo khi lượt truy cập diễn ra và token này đánh dấu và lưu trong cookie. Sau này ,khi lượt truy cập thứ 2 diễn ra thì chỉ cần token đã tạo là thành công.giống căn cước công dân.
    1. Viết function tạo mã token trong file middlewares/jwt.js
    2. Vào controllers/user gọi function trên trong function login 7:41
    3. Giải thích luồn đi của token 10:00
    4. Viết hàm cấp lại mã token mới khi đã hết hạn 13:26
    5. Lưu token trong cookie ,giờ tải cookie 15:07
    6. Gọi cookie trong server.js 16:44
    7. Cài đặt cookie trong controller/user 20:30
    8. Test login với cookie thử? 23:36

    err : mes báo secretOrPrivateKey phải có giá trị trên postman .Nghĩa là nó ko đọc được biến JWT từ file .env . 
    Lại 1 lần nữa app này vẫn không đọc được biến từ môi trường .Tôi đã thử mọi cách và đã sử dụng backtick để bọc biến trong file middlewares/jwt như sau:
     "${process.env...}" thì nó mới đọc được.

    9. Viết hàm xác thực role nhờ token trong file middlewares/verifyToken 27:28
        Lỗi 401 : lỗi xác thực .Bên fe dựa vào lỗi này để nó viết hàm tự động gửi qua be để làm lại 1 cái access token mới
    10. Vào routes/user để thêm chức năng xác minh token cho user 40:42
    11. Vào controller/user viết hàm lấy tt hiện tại của user 37:44 43:45
    12. Test 1 token để coi thử có xác minh được không? 42:44
         admin tìm 1 user bằng token trên postman
    
Video 6 : access token & refresh token 2 và logout
Video này xử lí vấn đề khi accessToken đã hết hạn 
nên phải viết cái api để cấp lại 1 cái accessToken mới trong TH refreshToken vẫn còn hạn .fix hạn sử dụng accessToken
TH : nếu cả 2 loại token access và refresh đều hết hạn thì yêu cầu người dùng đăng nhập lại
    1. Viết hàm refreshAccessToken trong controller/user 7:39
    2. Vào router/user gọi hàm trên 20:35
    3. Tạo 1 New Request trong postman tên refreshToken 22:11 để test
    4. Viết logout trong controller/user 34:30
    5. vào router/user gọi logout 41:37
    6. Test logout 42:55
    
Video 7 : Reset Password và Cấu hình email no-reply
Video [1:21] này xử lí vấn đề khi user quên mật khẩu hoặc muốn thay đổi mật khẩu ,muốn lấy lại mật khẩu mới thì user đó phải có email đã đăng ký 
- Phía giao diện gửi email của user đã đăng ký để phía server xác thực hợp lệ email
- Hợp lệ thì gửi 1 cái link tới mail 
link này bao gồm : mã token để xác nhận thay đổi password 
Khi user click vào link 
link tự động kích hoạt 1 cái API ,Phía giao diện sẽ gửi API chứa token 
Server sẽ kiểm tra token từ giao diện có giống với token mà server gửi mail hay không?=> Trùng thì cho thay đổi mật khẩu 
    1. Viết function forgotPassword trong controller/user [7:30 22:30]
    2. Viết function  createPasswordChangedToken trong models/user 9:11
    3. npm i crypto-js 12:15
    4. tìm hiểu gg app ps 24:00 để lấy 24:25 
    5. Vào file .env thêm mã token của google 26:36
    6. npm i nodemailer 26:54
    7. xử lí mail trong file utils/sendMail 28:23
    8. viết html thiết kế trong controller/user 32:58
    9. Test bằng postman 41:32
    Dừng ở 48:47 để fix bug
    bug: Postman không gọi được api forgotPassword 
    fix thành công ,chỉnh get thành post

    bug: gg vẫn ko hỗ trợ 
    file hướng dẫn cách sử dụng OAuth2 : https://dev.to/chandrapantachhetri/sending-emails-securely-using-node-js-nodemailer-smtp-gmail-and-oauth2-g3a

    Link lấy refreshToken :https://developers.google.com/oauthplayground/?code=4/0AfJohXmcl4jDSQiB8mk9qCCsmQevMxZFukg8TBnxeSC5cnnSXxSVx2S4m5abCr2HmUyhKg&scope=https://mail.google.com/

    Link lấy ID và Sceret : https://console.cloud.google.com/apis/credentials/oauthclient/535677816384-a4qa52l3ki1sblkrdsrdi60m2s7mti91.apps.googleusercontent.com?project=ecom9423

    fix bug thành công 
    Design email theo chủ đề của project 
    10. Viết function resetPassword xử lí nút kích hoạt mật khẩu trong mail 51:38
    11. Test function này trên postman 1:02:46

Video 8 : CRUD user /Phân quyền admin (Creat là resiger ,Read là login )
    1. Viết function GetAllUser trong file controller/user 4:19 (dành cho admin)
    2. Phân quyền admin trong file middlewares/verifyToken bằng accessToken 6:57
    3. Test quyền admin cho 1 user để thử lấy thông tin tất cả user trên postman   16:12 => 18:10
    4. Trao quyền admin cho 1 user trên mongodb 17:17 
        Admin là 1945 
        User là 1975
        Sales là 1999
    5. Viết function delete user trong file controller/user 21:54 (chỉ dành cho admin)
    6. Test trong postman (err vì code khác vid)
    7. Viết function updateUser trong file controller/user 28:47,vào router gọi function
    8. Viết function updateUserByAdmin trong file controller/user 40:00,vào router gọi function
    9. Vào postman test đổi tên user thử 44:10

Video 9 : CRUD product 

    1. Tạo file controller/product để xử lí 1:20
    2. Tạo file models/product để lưu trữ 2:00=>12:45
    3. Viết function createProdcut 13:31 16:54
    4. Tải thư viện npm i slugify giúp 16:12
    5. Tạo file routes/product 23:23
    6. Tạo folder product trong postman 25:44 ,vào router gọi function
    7. Tạo 1 sản phẩm trên postman 31:40
    8. Viết function lấy 1 sản phẩm bất kì 32:03,vào router gọi function
    9. Tạo request get product trên postman 35:47
    10.Viết function lấy nhiều sản phẩm (getProducts) 36:17,vào router gọi function
    11.Tạo request getProducts trên postman 38:42
    12.Viết function updateProduct trong controller/product 39:54 ,vào router gọi function
    13.Tạo request updateProduct bằng id trên Postman 44:22
    14.Viết function deleteProduct 47:08,vào router gọi function
    15.Tạo request deleteProduct bằng id trên Postman 48:32

Video 10: 



    

