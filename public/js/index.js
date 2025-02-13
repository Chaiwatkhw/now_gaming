window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.href = '/';
    }
});

window.onload = async function winLoad() {
    
    const account = document.getElementsByClassName('account')[0];
    const isAdmin = await checkAdmin();
    const isLoggedIn = await checklogin(); 
    if(isAdmin){
        account.innerHTML= `
        <a href="javascript:void(0);" class="icon-img" >
        <img src="/img/logo/avatar2.svg" alt="account" class="img-profile-login-succes" onclick="openMenu()" title="Account">
        </a>
        <div class="nav">
            <div class="inNav">
                <div class="user">
                    <div>
                        <img src="/img/logo/avatar2.svg" alt="account" class="img-profile-login-successs" title="Account">
                    </div>
                    <div>
                         ${isAdmin.username}
                    </div>
                </div>
                <hr class="hr">
                <span onclick="goToAccount()">Account</span>
                <span onclick="managePage()">Game Management</span>
                <span onclick="logOut()">Sign Out</span>
            </div>
        </div>
        `;
    }
    else if(isLoggedIn){
        account.innerHTML= `
        <a href="javascript:void(0);" class="icon-img" >
        <img src="/img/logo/avatar2.svg" alt="account" class="img-profile-login-succes" onclick="openMenu()" title="Account">
        </a>
        <div class="nav">
            <div class="inNav">
                <div class="user">
                    <div>
                        <img src="/img/logo/avatar2.svg" alt="account" class="img-profile-login-successs" title="Account">
                    </div>
                    <div>
                        ${isLoggedIn.username}
                    </div>
                </div>
                <hr class="hr">
                <span onclick="goToAccount()">Account</span>
                <span onclick="logOut()">Sign Out</span>
            </div>
        </div>
        `;
    }
    else{
        loginAccount();
        account.innerHTML= `
        <a href="javascript:void(0);" class="icon-img2" title="Account">
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
    amountCart();
}

function gotoHome(){
    window.location.href = '/';
    const trending = document.querySelector(".Trending .hTrending");
    const iconArrow = document.getElementById('icon-arrow');
    trending.style.cursor = "pointer";
    iconArrow.style.cursor = "pointer";
}

function goTocart(){
    window.location.href = '/cart';
}
async function checklogin() {
    try {
        const res = await axios.get('/checklogin', { withCredentials: true }); // ตรวจสอบ login
        //console.log(res.data);
        
        // หากได้รับข้อความว่า "You are authorized" แสดงว่าผู้ใช้ล็อกอิน
        if (res.data.message === 'You are authorized') {
            return res.data.user;  // ส่งข้อมูลผู้ใช้กลับมา
        }
        return false;  // หากไม่ได้ล็อกอิน
    } catch (error) {
        console.log("Error checking login:", error.response ? error.response.data : error);
        return false;  // หากเกิดข้อผิดพลาดในการตรวจสอบ
    }
}

async function checkAdmin() {
    try {
        const res = await axios.get('/checkAdmin', { withCredentials: true });
        if (res.data.message === 'User is an admin') {
           // console.log("✅ User is an Admin");
            return res.data.user;
        }
    } catch (error) {
        //console.log("❌ User is NOT an Admin");
        return false;
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

function togglePassword(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash"); // เปลี่ยนเป็นไอคอนตาปิด
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye"); // เปลี่ยนเป็นไอคอนตาเปิด
    }
}


function loginAccount(){
    const modalContent = document.getElementById('loginModal').getElementsByClassName('modal-content')[0];
    modalContent.innerHTML = `
    <div class="modal-closer">
        <span class="close" onclick="closeModal()" title="close">&times;</span>
    </div>
    <div class="logo-container-login">
        <img src="img/logo/reallogo.png" alt="" class="logo-login"><span class="web-name">Now <br>Gaming</span>
    </div>  
    <form action="" class="formAccount">
        <legend id="legend">Log In</legend>
        <input type="text" id="username_email" name="username_email" placeholder="Username or Email:" required>
        <div class="password-container">
            <i class="fa fa-eye" id="eyeIcon1" onclick="togglePassword('password1', 'eyeIcon1')"></i>
            <input type="password" name="password1" id="password1" placeholder="Your password:" required>
        </div>
        <button type="submit">Log in</button>
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
        <span class="close" onclick="closeModal()" title="close">&times;</span>
    </div>
    <div class="logo-container-login">
        <img src="img/logo/reallogo.png" alt="" class="logo-login"><span class="web-name">Now <br>Gaming</span>
    </div>  
    <form action="" class="formAccount">
        <legend id="legend">Create Your Account</legend>
        <input type="text" id="username" name="username" placeholder="Username:" required>
        <input type="email" name="email" id="email" placeholder="Email:" required>
        <div class="password-container">
            <i class="fa fa-eye" id="eyeIcon2" onclick="togglePassword('password', 'eyeIcon2')"></i>
            <input type="password" id="password" name="password" placeholder="Your password:" required>
        </div>
        <div class="password-container">
            <i class="fa fa-eye" id="eyeIcon3" onclick="togglePassword('repassword', 'eyeIcon3')"></i>
            <input type="password" id="repassword" name="repassword" placeholder="Re-type your password:" required>
        </div>
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
    <div class="xy">
        <span id="login_create" onclick="createAccount()">Back</span>
    </div>
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

function Vaildpass(password,repassword){

    if (password.length < 8) return  true;
    if (password !== repassword) return true;
    return null;
}

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
                alert('Login Success');
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
            const repassword = formData.get('repassword').trim();
            const email = formData.get('email').trim();
            const err = validatePassword(password,repassword);
            if(err){
                if (password.length < 8) alert("รหัสต้องมีความยาวมากกว่า 8 ตัวอักษร") ;
                else if (password !== repassword) alert("รหัสผ่านไม่ตรงกัน") ;
            }
            else{
                axios.patch('/updatePassword',{email,password})
                .then((res)=>{
                    alert('Update Password Success')
                    closeModal();
                })
                .catch((err)=>{
                    alert('Update Password Failed')
                });
            }
            
        }
}});

function renderGames(games) {
    const cardWrapper = document.getElementsByClassName('card-wrapper')[0];
    cardWrapper.innerHTML = '';

    for (let i = 0; i < Math.min(9, games.length); i++) {
        const game = games[i];

        const category = game.game_category ? game.game_category.toLowerCase() : 'unknown';

        const div = document.createElement('div');
        div.className = 'game-card';
        div.setAttribute('data-category', category);  // ✅ ใช้ data-category

        const formattedPrice = parseFloat(game.game_price).toLocaleString('en-US', { 
            minimumFractionDigits: 2, maximumFractionDigits: 2 
        });

        div.innerHTML = `
            <div class="baseIMG">
                <picture class="gamePicTure" onclick="openGameModal(${game.game_id})">
                    <img src="/img/game/${game.game_image}" alt="">
                </picture>
            </div>
            <div class="titleANDPrice">
                <div class="title-game">
                    ${game.game_title}
                </div>
                <div class="game-price">
                    ${formattedPrice} THB
                </div>
            </div>
        `;

        cardWrapper.appendChild(div);
    }
}

async function getGame2() {
    axios.get('/getGame')
    .then((res)=>{
        games = res.data;
        renderGames2(games);    
    })
    .catch((error)=>{
        console.log("Error to Load Product:",error);
    }
    );    
}


function renderGames2(games) {
    const cardWrapper = document.getElementsByClassName('card-wrapper')[0];
    cardWrapper.innerHTML = '';

    games.forEach(game => {  // ✅ ใส่ callback function ใน forEach()
        const category = game.game_category ? game.game_category.toLowerCase() : 'unknown';

        const div = document.createElement('div');
        div.className = 'game-card';
        div.setAttribute('data-category', category);

        const formattedPrice = parseFloat(game.game_price).toLocaleString('en-US', { 
            minimumFractionDigits: 2, maximumFractionDigits: 2 
        });

        div.innerHTML = `
            <div class="baseIMG">
                <picture class="gamePicTure" onclick="openGameModal(${game.game_id})">
                    <img src="/img/game/${game.game_image}" alt="">
                </picture>
            </div>
            <div class="titleANDPrice">
                <div class="title-game">
                    ${game.game_title}
                </div>
                <div class="game-price">
                    ${formattedPrice} THB
                </div>
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
    const searchinput = document.getElementById('searchinput');
    const x = document.getElementById('x');
    // ซ่อน searchIcon และแสดง x
    searchIcon.style.display = 'none';
    x.style.display = 'block';
    searchinput.focus();
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

async function logOut(){
    try {
        const response = await axios.post('/logout', {}, {
            withCredentials: true // เพื่อส่ง cookie ไปพร้อมกับ request
        });

        if (response.status === 200) {
            console.log(response.data.message); // แสดงข้อความ "Logged out successfully"
            window.location.href = '/'; // เปลี่ยนเส้นทางไปหน้า Login
        }
    } catch (error) {
        console.error('Logout error:', error.response?.data || error.message);
    }
}

async function openGameModal(gameId){
    await axios.get('/gameModal',{
        params:{
            game_id: gameId
        }
    })
    .then((res)=>{
        const game = res.data[0];
        const GameBlack = document.getElementsByClassName('GameBlack')[0];
        const GameModal = document.getElementsByClassName('GameModal')[0];
        const gameTitle = document.getElementById('gameTitle');
        const pgameDes = document.getElementById('pgameDes');
        const Genre = document.getElementsByClassName('Genre')[0];
        const gamePrice = document.getElementsByClassName('gamePrice')[0];
        const gameIMG = document.getElementById('gameIMG');
        const keyAmount = document.getElementsByClassName('keyAmount')[0];
        const addCardButton = document.getElementsByClassName('addCardButton')[0];
        GameBlack.style.display = 'flex';
        setTimeout(() => { 
            GameBlack.classList.add('active');
            GameModal.classList.add('active');
        }, 10);
        gamePrice.innerHTML = `${game.game_price} THB`;
        gameTitle.innerHTML = `${game.game_title}`;        
        pgameDes.innerHTML = `${game.game_description}`
        Genre.innerHTML = `Genre: ${game.game_category}`;
        gameIMG.src = `img/game/${game.game_image}`
        keyAmount.innerHTML = `Key Amount: ${game.key_count}`;
        addCardButton.setAttribute("onclick", `addCart(${game.game_id})`);
    })
    .catch((error)=>{

    });
} 

function closeGameModal(){
    const GameBlack = document.getElementsByClassName('GameBlack')[0];
        const GameModal = document.getElementsByClassName('GameModal')[0];
        GameBlack.classList.remove('active');
        GameModal.classList.remove('active'); 
        
        setTimeout(() => { 
            GameBlack.style.display = 'none';
        }, 500);
}

async function getGame3(categoryName) {
    axios.get('/getGame')
    .then((res)=>{
        games = res.data;
        renderGames3(games,categoryName);    
    })
    .catch((error)=>{
        console.log("Error to Load Product:",error);
    }
    );    
}


function renderGames3(games,categoryName) {
    const trending = document.querySelector(".Trending .hTrending");
    const cardWrapper = document.getElementsByClassName('card-wrapper')[0];
    cardWrapper.innerHTML = '';
    let i = 0;
    games.forEach(game => {  
        const category = game.game_category ? game.game_category.toLowerCase() : 'unknown';
        if (category === categoryName){

        
        const div = document.createElement('div');
        div.className = 'game-card';
        div.setAttribute('data-category', category);

        const formattedPrice = parseFloat(game.game_price).toLocaleString('en-US', { 
            minimumFractionDigits: 2, maximumFractionDigits: 2 
        });

        div.innerHTML = `
            <div class="baseIMG">
                <picture class="gamePicTure" onclick="openGameModal(${game.game_id})">
                    <img src="/img/game/${game.game_image}" alt="">
                </picture>
            </div>
            <div class="titleANDPrice">
                <div class="title-game">
                    ${game.game_title}
                </div>
                <div class="game-price">
                    ${formattedPrice} THB
                </div>
            </div>
        `;
        cardWrapper.appendChild(div);
        i++;
        }
    });
    if(i == 0){
        trending.textContent = "No games found";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchinput");
    const gameCards = document.getElementsByClassName("game-card");
    const pictureBackground = document.querySelector(".pictureBackground");
    const containWeb = document.querySelector(".Contain-web");
    const categoriesWrapper = document.querySelector(".Categories-wrapper");
    const gameCategories = document.querySelector(".gameCategories");
    const showGameIMG = document.querySelector(".showGameIMG");
    
    const categoryCards = document.querySelectorAll(".Categories-card");
    const trending = document.querySelector(".Trending .hTrending");
    const iconArrow = document.getElementById('icon-arrow');

    function updateDisplay(show) {
        pictureBackground.style.display = show ? "block" : "none";
        containWeb.style.paddingTop = show ? "0px" : "150px";
        categoriesWrapper.style.display = show ? "flex" : "none";
        gameCategories.style.display = show ? "block" : "none";
        showGameIMG.style.display = show ? "block" : "none";
    }

    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase().trim();

        for (let gameCard of gameCards) {
            const titleElement = gameCard.querySelector(".title-game");
            if (titleElement) {
                const titleText = titleElement.textContent.toLowerCase();
                if (titleText.includes(searchText)) {
                    gameCard.style.display = "block";
                    hasMatch = true;
                } else {
                    gameCard.style.display = "none";
                }
            }
        }

        if (searchText.length > 0) {
            updateDisplay(false);
            trending.textContent = "Results";
            trending.style.cursor = 'default';
            iconArrow.style.cursor = 'default';
        } else {
            getGame2();
            //updateDisplay(true);
            //trending.textContent = "Trending";
            //trending.style.cursor = 'pointer';
            //iconArrow.style.cursor = 'pointer';
        }
    });

    categoryCards.forEach(card => {
        card.addEventListener("click", function () {
            const categoryName = this.querySelector(".nameCat").textContent.trim().toLowerCase();
            trending.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
            getGame3(categoryName);
            updateDisplay(false); 
            trending.style.cursor = 'default';
            iconArrow.style.cursor = 'default';
        });
    });
});

document.addEventListener("DOMContentLoaded",function(){
    const pictureBackground = document.querySelector(".pictureBackground");
    const containWeb = document.querySelector(".Contain-web");
    const categoriesWrapper = document.querySelector(".Categories-wrapper");
    const gameCategories = document.querySelector(".gameCategories");
    const showGameIMG = document.querySelector(".showGameIMG");
    const trending = document.querySelector(".Trending .hTrending");
    const iconArrow = document.getElementById('icon-arrow');
    function updateDisplay(show) {
        pictureBackground.style.display = show ? "block" : "none";
        containWeb.style.paddingTop = show ? "0px" : "150px";
        categoriesWrapper.style.display = show ? "flex" : "none";
        gameCategories.style.display = show ? "block" : "none";
        showGameIMG.style.display = show ? "block" : "none";
    }
    const mTrending = document.getElementsByClassName('mTrending')[0];
    mTrending.addEventListener("click",function(){
        const hTrending = document.getElementsByClassName('hTrending')[0];
        if(hTrending.innerHTML.trim() == 'Trending'){
            updateDisplay(false);
            getGame2();
            trending.textContent = "Results";
            trending.style.cursor = 'default';
            iconArrow.style.cursor = 'default';
        } 
    });
})

async function amountCart() {
    const amountCart = document.getElementsByClassName('amountCart')[0];
    const gameAmountCart = document.getElementsByClassName('gameAmountCart')[0];
    try {
        const res = await axios.post('/amountCart', {}, { withCredentials: true });
        const count = res.data.count;

        if (count > 0) {
            gameAmountCart.style.visibility = 'visible';
            amountCart.textContent = count; // แสดงจำนวนเกมในตะกร้า
        } else {
            gameAmountCart.style.visibility = 'hidden';
        }
    } catch (error) {
        gameAmountCart.style.visibility = 'hidden';
        console.error("Error fetching cart amount:", error);
    }
}


async function addCart(game_id) {
    const isLoggedIn = await checklogin(); 
    if(isLoggedIn){
        await axios.post('/addcart',{
            game_id
        })
        .then((res)=>{
            amountCart();
            closeGameModal();
        })
        .catch((error)=>{
    
        });
    }
    else{
        openModal()
        closeGameModal();
    }
    
    
}

function goToAccount(){
    window.location.href ='/account';
}


