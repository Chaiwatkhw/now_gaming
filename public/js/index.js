function openLoginModal(){
    document.getElementById('loginModal').style.display = 'flex';
}
        // ฟังก์ชั่นปิด modal
function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}
        // ปิด modal ถ้าคลิกภายนอก
window.onclick = function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
        loginAccount();
        closeLoginModal();
    }
}

window.onload = async function winLoad() {
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

function createOrLogin(){
    const loginform = document.querySelector('.login-form');
    const createform = document.querySelector('.create-form');
    let textDom = document.getElementById('login_create');
    
    if(textDom.innerText === "Create an account"){
        createAccount();
    }
    else{
        loginAccount();
    }
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