window.onload = async function winLoad() {
    const account = document.getElementsByClassName('account')[0];
    const isLoggedIn = await checklogin(); 
    if(isLoggedIn){
        account.innerHTML= `
        <a href="javascript:void(0);" class="icon-img" >
        <img src="/img/logo/avatar2.svg" alt="account" class="img-profile-login-succes" onclick="openMenu()">
        </a>
        <div class="nav">
            <div class="inNav">
                <div class="user">
                    <div>
                        <img src="/img/logo/avatar2.svg" alt="account" class="img-profile-login-successs">
                    </div>
                    <div>
                        Ceraph
                    </div>
                </div>
                <hr class="hr">
                <span>Account</span>
                <span onclick="managePage()">Game Management</span>
                <span>Sign Out</span>
            </div>
        </div>
        `;
    }
    else{
        loginAccount();
        account.innerHTML= `
        <a href="javascript:void(0);" class="icon-img" >
        <span class="material-symbols-outlined" id="account_circle" onclick="openModal()">account_circle</span>
        </a>`;   
    }
    axios.get('/')
    .then((res)=>{
        
    })
    .catch((error)=>{
        console.log("Error to Load Index:",error);
    }
    );
    axios.get('/getGame')
    .then((res)=>{
        games = res.data;
        renderGames(games);    
    })
    .catch((error)=>{
        console.log("Error to Load Product:",error);
    }
    );
}

async function checklogin() {
    try {
        const res = await axios.get('/checklogin', { withCredentials: true }); // ตรวจสอบ login
        console.log(res.data);
        
        // หากได้รับข้อความว่า "You are authorized" แสดงว่าผู้ใช้ล็อกอิน
        if (res.data.message === 'You are authorized') {
            return res.data.user;  // ส่งข้อมูลผู้ใช้กลับมา
        }
        return null;  // หากไม่ได้ล็อกอิน
    } catch (error) {
        console.log("Error checking login:", error.response ? error.response.data : error);
        return null;  // หากเกิดข้อผิดพลาดในการตรวจสอบ
    }
}


function openModal(){
    const loginModal = document.getElementById('loginModal');
    loginModal.style.display = 'flex';
}

function closeModal(){
    loginAccount();
    const loginModal = document.getElementById('loginModal');
    const form = document.getElementsByClassName('formAccount')[0];
    form.reset(); 
    loginModal.style.display = 'none';
}

function loginAccount(){
    const modalContent = document.getElementById('loginModal').getElementsByClassName('modal-content')[0];
    modalContent.innerHTML = `
    <div class="modal-closer">
        <span class="close" onclick="closeModal()">&times;</span>
    </div>
    <div class="logo-container-login">
        <img src="img/logo/reallogo.png" alt="" class="logo-login"><span class="web-name">Now <br>Gaming</span>
    </div>  
    <form action="" class="formAccount">
        <legend id="legend">Log In</legend>
        <input type="text" id="username_email" name="username_email" placeholder="Username or Email:" required>
        <input type="password" name="password1" id="password1" placeholder="Your password:" required>
        <button type="submit" >Log in</button>
    </form>
    <div class="xy">
        <span id="login_create" onclick="createOrLogin()">Create an account</span>
        <span id="forget-password" onclick="forgotPassword1()">Lost password?</span>
    </div>
    `;
}

function createAccount(){
    const modalContent = document.getElementById('loginModal').getElementsByClassName('modal-content')[0];
    modalContent.innerHTML = `
    <div class="modal-closer">
        <span class="close" onclick="closeModal()">&times;</span>
    </div>
    <div class="logo-container-login">
        <img src="img/logo/reallogo.png" alt="" class="logo-login"><span class="web-name">Now <br>Gaming</span>
    </div>  
    <form action="" class="formAccount">
        <legend id="legend">Create Your Account</legend>
        <input type="text" id="username" name="username" placeholder="Username:" required>
        <input type="email" name="email" id="email" placeholder="Email:" required>
        <input type="password" id="password" name="password" placeholder="Your password:" required>
        <input type="password" id="repassword" name="repassword" placeholder="Re-type your password:" required>
        <button type="submit">Submit</button>
    </form>
    <div class="xy">
        <span id="login_create" onclick="createOrLogin()">Log In</span>
        <span id="forget-password" onclick="forgotPassword1()">Lost password?</span>
    </div>
    `;
}

function checkEmail(username,email,password){
    const modalContent = document.getElementById('loginModal').getElementsByClassName('modal-content')[0];
    modalContent.innerHTML = `
    <div class="modal-closer">
        <span class="close" onclick="closeModal()">&times;</span>
    </div>
    <div class="logo-container-login">
        <img src="img/logo/reallogo.png" alt="" class="logo-login"><span class="web-name">Now <br>Gaming</span>
    </div>  
    <form action="" class="formAccount">
        <input type="hidden" name="username" value="${username}">
        <input type="hidden" name="email" value="${email}">
        <input type="hidden" name="password" value="${password}">
        <legend id="legend">Email Verification</legend>
        <label for="" style="font-size: 16px; align-self: flex-start;" >OTP has been sent to your email address.</label>
        <input type="text" id="otp" name="otp" placeholder="Verification Code:" required>
        <button type="submit">Verify</button>
    </form>
    `;
}

function forgotPassword1(){
    const modalContent = document.getElementById('loginModal').getElementsByClassName('modal-content')[0];
    modalContent.innerHTML = `
    <div class="modal-closer">
        <span class="close" onclick="closeModal()">&times;</span>
    </div>
    <div class="logo-container-login">
        <img src="img/logo/reallogo.png" alt="" class="logo-login"><span class="web-name">Now <br>Gaming</span>
    </div>  
    <form action="" class="formAccount">
        <legend id="legend">Forgot Password</legend>
        <label for="" style="font-size: 16px; align-self: flex-start;" >Please enter your email to reset your password.</label>
        <input type="email" id="email" name="email" placeholder="Email:" required>
        <button type="submit">Send OTP</button>
    </form>
    <div class="xy">
        <span id="login_create" onclick="loginAccount()">Back</span>
    </div>
    `;
}

function forgotPassword2(email){
    const modalContent = document.getElementById('loginModal').getElementsByClassName('modal-content')[0];
    modalContent.innerHTML = `
    <div class="modal-closer">
        <span class="close" onclick="closeModal()">&times;</span>
    </div>
    <div class="logo-container-login">
        <img src="img/logo/reallogo.png" alt="" class="logo-login"><span class="web-name">Now <br>Gaming</span>
    </div>  
    <form action="" class="formAccount">
        <legend id="legend">Verification Code</legend>
        <input type="hidden" name="email" value="${email}">
        <label for="" style="font-size: 16px; align-self: flex-start;" >Please enter your OTP to reset your password.</label>
        <input type="text" id="otp" name="otp" placeholder="Verification Code:" required>
        <button type="submit">Send OTP</button>
    </form>
    <div class="xy">
        <span id="login_create" onclick="forgotPassword1()">Back</span>
    </div>
    `;
}

function forgotPassword3(email){
    const modalContent = document.getElementById('loginModal').getElementsByClassName('modal-content')[0];
    modalContent.innerHTML = `
    <div class="modal-closer">
        <span class="close" onclick="closeModal()">&times;</span>
    </div>
    <div class="logo-container-login">
        <img src="img/logo/reallogo.png" alt="" class="logo-login"><span class="web-name">Now <br>Gaming</span>
    </div>  
    <form action="" class="formAccount">
        <legend id="legend">New Password</legend>
        <input type="hidden" name="email" value="${email}">
        <input type="password" id="password" name="password" placeholder="New Password:" required>
        <input type="password" id="repassword" name="repassword" placeholder="Re-type New Password:" required>
        <button type="submit">Submit</button>
    </form>
    <div class="xy">
        <span id="login_create" onclick="forgotPassword1()">Back</span>
    </div>
    `;
}

function createOrLogin(){
    let textDom = document.getElementById('login_create');
    
    if(textDom.innerText === "Create an account"){
        createAccount();
    }
    else{
        loginAccount();
    }
}

const validateInput = (username, email, password, repassword) => {
    if (/^[^a-zA-Z0-9]/.test(username)) return "ชื่อห้ามขึ้นต้นด้วยตัวเลขหรืออักษรพิเศษ";
    if (username.length < 3) return "ชื่อผู้ใช้ต้องมีความยาวมากกว่า 3 ตัวอักษร";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return "Please enter a valid email address!";
    if (password.length < 8) return "รหัสต้องมีความยาวมากกว่า 8 ตัวอักษร";
    if (password !== repassword) return "รหัสผ่านไม่ตรงกัน";
    return null;
};

function checkOTP(otp) {
    // ตรวจสอบความยาวของ OTP
    if (otp.length !== 6) {
        alert('Please enter an OTP that is exactly 6 digits long.');
        return false;
    }

    // ตรวจสอบว่า OTP มีเฉพาะตัวเลข
    if (!/^\d+$/.test(otp)) {
        alert('OTP must contain only numeric digits.');
        return false;
    }

    return true;
}
const validatePassword = (password, repassword) => {
    if (password.length < 8) return "รหัสต้องมีความยาวมากกว่า 8 ตัวอักษร";
    if (password !== repassword) return "รหัสผ่านไม่ตรงกัน";
    return null;
};

document.body.addEventListener('submit', async function(e) {
    if (e.target.classList.contains('formAccount')) {
        e.preventDefault();
        const legend = document.getElementById('legend');
        //Login
        if (legend.innerText === "Log In") {
            const formData = new FormData(e.target);
            const username = formData.get('username_email').trim();
            const password = formData.get('password1').trim();

            try {
                const res = await axios.post('/login', { username, password });
                console.log(res);
                alert('Login success');
                closeModal();
                window.location.reload();
            } catch (error) {
                console.error(error);
                alert(error.response.data.error);
            }
        }
        
        else if(legend.innerText === "Create Your Account"){
            const formData = new FormData(e.target);
            const username = formData.get('username').trim();
            const email = formData.get('email').trim();
            const password = formData.get('password').trim();
            const repassword = formData.get('repassword').trim();
            const errorMsg = validateInput(username, email, password, repassword);
            if (errorMsg) {
                alert(errorMsg);
                return;
            }
            try{
                const res = await axios.get('/checkuser', {
                params: { username, email }
            });
                console.log(res);
                alert('OTP has been sent to your email address.');
                checkEmail(username,email,password);
            }
            catch(error){
                alert(error.response.data.error); 
                return
            }   
        }
        else if (legend.innerText === "Email Verification"){
            const formData = new FormData(e.target);
            const otp = formData.get('otp').trim();
            const otpCorrect = checkOTP(otp);
            if (otpCorrect){
                axios.post('/verifyOtp',{otp})
                .then((res)=>{
                    const username = formData.get('username').trim();
                    const email = formData.get('email').trim();
                    const password = formData.get('password').trim();
                    axios.post('/register', {username,email,password})
                    .then((res)=>{
                        console.log(res);
                        alert('Register success');
                        closeModal();
                    }).catch((error)=>{
                        console.log(error);
                        alert('Register fail Username or email already exists');
                    });
                }).catch((error)=>{
                    alert(error.response.data.error);
                    return;
                });   
            }
        }
        else if (legend.innerText === "Forgot Password"){
            const formData = new FormData(e.target);
            const email = formData.get('email').trim();
            try{
                const res = await axios.get('/forgotPassword', {
                    params: {email}
                });
                forgotPassword2(email);
                alert('OTP has been sent to your email address.');
            }
            catch(error){
                alert(error.response.data.error); 
            }
        }
        else if(legend.innerText === "Verification Code"){
            const formData = new FormData(e.target);
            const otp = formData.get('otp').trim();
            const email = formData.get('email').trim();
            const otpCorrect = checkOTP(otp);
            if(otpCorrect){
                axios.post('/verifyOtp',{otp})
                .then((res)=>{
                    forgotPassword3(email);
                    alert('OTP is Vaild.');
                })
                .catch((error)=>{
                    alert(error.response.data.error); 
                });
            }
        }
        else if(legend.innerText === "New Password"){
            const formData = new FormData(e.target);
            const password = formData.get('password').trim();
            const repassword = formData.get('password').trim();
            const email = formData.get('email').trim();
            const err = validatePassword(password,repassword);
            if(err){
                alert(err)
                return;
            }
            axios.patch('/updatePassword',{email,password})
            .then((res)=>{
                alert('Update Password Success')
                closeModal();
            })
            .catch((err)=>{
                alert('Update Password Failed')
            });
        }
}});

function renderGames(games){
    const cardWrapper = document.getElementsByClassName('card-wrapper')[0];
    cardWrapper.innerHTML ='';

    games.forEach(game => {
        const div = document.createElement('div');
        div.className = 'game-card';
        const formattedPrice = parseFloat(game.game_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        div.innerHTML = `
            <img src="/img/game/${game.game_image}" alt="">
            <div class="title-game">
                ${game.game_title}
            </div>
            <div class="game-price">
                ${formattedPrice} THB
            </div>
        `;
        cardWrapper.appendChild(div);
    });
}

function managePage(){
    openMenu();
    window.location.href = '/manage';
}

window.addEventListener('scroll', function () {
    const header = document.querySelector(".header-container");
    header.classList.toggle('sticky', window.scrollY > 0);

    const image = document.querySelector(".sx-img");
    const scrollY = window.scrollY;

    // จำกัดการเลื่อนภาพในช่วง 0 ถึง 200px
    const maxScroll = 200; // ระยะที่ต้องการให้ภาพเลื่อน
    const translateY = Math.min(scrollY * 0.1, maxScroll * 0.1);

    // ปรับเลื่อนภาพตาม scroll แต่ไม่เกิน maxScroll
    image.style.transform = `translateY(${translateY}px)`;

    const nav = document.querySelector('.nav');

});


document.getElementById('search-icon').addEventListener('click',searchBoxChange);
function searchBoxChange() {
    const searchBox = document.querySelector('.search-box');
    const searchIcon = document.getElementById('search-icon');
    const x = document.getElementById('x');
    // ซ่อน searchIcon และแสดง x
    searchIcon.style.display = 'none';
    x.style.display = 'block';
    searchBox.classList.add('active');
}

document.getElementById('x').addEventListener('click', closeSearch);
function closeSearch() {
    console.log('s')
    const searchBox = document.querySelector('.search-box');
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('searchinput');
    searchInput.value = '';
    const x = document.getElementById('x');
    
    searchBox.classList.remove('active');
    
    // ใช้ visibility แทน display
    searchIcon.style.display = 'flex';
    x.style.display = 'none'
}

function openMenu(){
    const cart = document.querySelector('.cart');
    const bgblack = document.querySelector('.bgblack');
    const nav = document.querySelector('.nav');
    if(nav.style.display == 'flex'){
        cart.style.zIndex ='1';
        nav.style.zIndex ='3';
        nav.style.display = 'none';  
        bgblack.style.display = 'none'; 
    }
    else{
        cart.style.zIndex ='0';
        nav.style.zIndex ='0';
        nav.style.display = 'flex';
        bgblack.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.nav');
    const bgblack = document.querySelector('.bgblack');

    // Event to close the menu when mouse leaves
    bgblack.addEventListener('click', openMenu); // Close when clicking outside

    // Close the menu when the mouse leaves the nav area
    bgblack.addEventListener('mouseover', function () {
        openMenu();
    });
});




