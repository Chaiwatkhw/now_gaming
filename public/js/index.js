window.onload = async function winLoad() {
    const account = document.getElementsByClassName('account')[0];
    const isLoggedIn = await checklogin(); 
    if(isLoggedIn){
        account.innerHTML= `
        <a href="javascript:void(0);" class="icon-img" >
        <img src="/img/logo/avatar2.svg" alt="account" class="img-profile-login-succes" onclick="">
        </a>
        `;
    }
    else{
        account.innerHTML= `
        <a href="javascript:void(0);" class="icon-img" ><span class="material-symbols-outlined" id="account_circle" onclick="openLoginModal()">account_circle</span></a>`
        
    }
    loginAccount();
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
    
};


async function checklogin(){
    try {
        const res = await axios.get('/checklogin', { withCredentials: true }); // ตรวจสอบ login
        console.log(res.data);
        if (res.data.message === 'You are authorized') {
            return true;  // หากผู้ใช้ล็อกอิน
        }
        return false;  // หากไม่ได้ล็อกอิน
    } catch (error) {
        console.log("Error checking login:", error.response ? error.response.data : error);
        return false;  // หากเกิดข้อผิดพลาดในการตรวจสอบ
    }
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

function openLoginModal(){
    if(checklogin()){  
        document.getElementById('loginModal').style.display = 'flex'; 
    }
}
        // ฟังก์ชั่นปิด modal
function closeLoginModal() {
    const loginform = document.querySelector('.login-form');
    const createform = document.querySelector('.create-form');  
    document.getElementById("loginModal").style.display = "none";
    loginform.reset();
    createform.reset();
}
        // ปิด modal ถ้าคลิกภายนอก
window.onclick = function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        loginAccount();
        closeLoginModal();
    }
}

function loginAccount(){
    const loginform = document.querySelector('.login-form');
    const createform = document.querySelector('.create-form');
    let textDom = document.getElementById('login_create');
    textDom.innerHTML = "Create an account";
    loginform.style.display = 'flex';
    createform.style.display = 'none';
}

function createAccount(){
    const loginform = document.querySelector('.login-form');
    const createform = document.querySelector('.create-form');
    let textDom = document.getElementById('login_create');
    textDom.innerHTML = "Log in";
    loginform.style.display = 'none';
    createform.style.display = 'flex';
}

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

const validateInput = (username, email, password, repassword) => {
    if (/^[^a-zA-Z0-9]/.test(username)) return "ชื่อห้ามขึ้นต้นด้วยตัวเลขหรืออักษรพิเศษ";
    if (username.length < 3) return "ชื่อผู้ใช้ต้องมีความยาวมากกว่า 3 ตัวอักษร";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return "Please enter a valid email address!";
    if (password.length < 8) return "รหัสต้องมีความยาวมากกว่า 8 ตัวอักษร";
    if (password !== repassword) return "รหัสผ่านไม่ตรงกัน";
    return null;
};

document.querySelector('.create-form').addEventListener('submit', async function(e){
    e.preventDefault();
    const form = e.target; 
    const formData = new FormData(form);
    const username = formData.get('username').trim().toLowerCase();
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password').trim();
    const repassword = formData.get('repassword').trim();

    const errorMsg = validateInput(username, email, password, repassword);
    if (errorMsg) {
        alert(errorMsg);
        return;
    }

    axios.post('/register', {
        username,
        email,
        password
    })
    .then((res)=>{
        console.log(res);
        alert('Register success');
        closeLoginModal();
    }).catch((error)=>{
        console.log(error);
        alert('Register fail Username or email already exists');
    });
});


document.querySelector('.login-form').addEventListener('submit', async function(e){
    e.preventDefault();
    const form = e.target; 
    const formData = new FormData(form);
    const username = formData.get('username_email').trim();
    const password = formData.get('password1').trim();

    axios.post('/login', {
        username,
        password
    })
    .then((res)=>{
        console.log(res);
        alert('Login success');
        loginAccount();
        closeLoginModal();
        window.location.reload();
    }).catch((error)=>{
        console.log(error);
        alert('Login fail');
    });
});