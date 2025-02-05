
function checkAndToggleTbody() {
    const table = document.getElementById('gamelistTable');
    const tbody = document.getElementById('games-container');
    // ตรวจสอบว่า tbody มีแถวอยู่หรือไม่
    if (tbody && tbody.children.length == 0) {
        table.style.display = 'none';  // แสดง tbody
    } else {
        table.style.display = '';  // ซ่อน tbody
    }
}

function modalAddgame(select) {
    
    const addGameTitle = document.getElementById('addGameTitle');
    const save_button = document.getElementById('save_button');
    const h1 = document.createElement('h1');
    if(select == 0){
        save_button.textContent = 'Save';
        h1.textContent = 'Add Game';
        addGameTitle.innerHTML = '';
        addGameTitle.appendChild(h1);
    }
    else{
        save_button.textContent = 'Save Change';
        h1.textContent = 'Edit Game';
        addGameTitle.innerHTML = '';
        addGameTitle.appendChild(h1);
    }
    let modalAddgame = document.getElementsByClassName('modal')[0];
    modalAddgame.style.display = 'flex';
    setTimeout(()=>{
        modalAddgame.style.opacity = '1';
    },100);
    //document.documentElement.style.overflow = 'hidden';
    const game_title = document.getElementById('game_title');
    game_title.focus();
}


function closeAddGame(){
    let modalAddgame = document.getElementsByClassName('modal')[0];
    //document.documentElement.style.overflow = '';

    const preview = document.getElementById('preview');
    preview.style.display = 'none';
    modalAddgame.style.opacity = '0';
    setTimeout(()=>{   
        modalAddgame.style.display = 'none';
    },300);
}


function previewImage() {
    const fileInput = document.getElementById('game_imgfile');
    const preview = document.getElementById('preview');
    const imageError = document.getElementById('imageError'); // ข้อความเตือน
    // ตรวจสอบว่าไฟล์ถูกเลือกหรือไม่
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        
        // เมื่ออ่านไฟล์เสร็จจะทำการแสดงผล
        reader.onload = function(event) {
            preview.src = event.target.result;
            preview.style.display = 'block'; // แสดงพรีวิว
            imageError.style.display = 'none'; // ซ่อนข้อความเตือน
        };

        reader.readAsDataURL(file); // อ่านไฟล์ภาพเป็น data URL
    } else {
        preview.style.display = 'none'; // ซ่อนพรีวิว
        imageError.style.display = 'block'; // แสดงข้อความเตือน
    }
}

function validateForm() {
    const fileInput = document.getElementById('game_imgfile');
    const imageError = document.getElementById('imageError');  // ข้อความเตือน
    const game_price = document.getElementById('game_price').value;

    if (fileInput.files.length == 0) {
        imageError.style.display = 'block'; // แสดงข้อความเตือน
        return false;  // คืนค่า false เมื่อไม่พบไฟล์
    }
    if (game_price <= 0) {
        document.getElementById('game_price').value = ''; // ล้างค่าในช่องราคาเกม
        alert('กรุณากรอกราคาเกมให้ถูกต้อง'); // แสดงข้อความเตือน
        return false;  // คืนค่า false เมื่อราคาเกมไม่ถูกต้อง
    }
    else {
        imageError.style.display = 'none'; // ซ่อนข้อความเตือนเมื่อมีไฟล์
    }
    return true;  // คืนค่า true ถ้าไฟล์ถูกเลือกหรือมีไฟล์แสดงในพรีวิว
}

function resetForm(){
    document.getElementById('game_imgfile').value = '';
    document.getElementById('game_title').value = '';
    document.getElementById('game_description').value = '';
    document.getElementById('game_price').value = '';
    document.getElementById('preview').style.display = 'none';
    document.getElementById('imageError').style.display = 'none';
}


document.getElementById('addGameForm').addEventListener('submit',async function(event) {
    event.preventDefault(); // ป้องกันการส่งฟอร์มโดยตรง
    const save_button = document.getElementById('save_button'); 
    if(save_button.textContent == 'Save'){
        const isValid = await validateForm(); // ตรวจสอบข้อมูลก่อนส่งฟอร์ม
        if (!isValid) {
            return;  // ถ้าฟอร์มไม่ถูกต้อง ให้หยุดการส่งฟอร์ม
        }
    }
    const game_id = document.getElementById('game_id').value;
    if(save_button.textContent == 'Save'){
        addGame(); // เพิ่มเกม
    }
    else{
        sendGameEdit(game_id); // แก้ไขเกม
    }
    
});


function addGame(){
    const gamecategory = document.getElementById('game-category').value;
    const gameImgFile = document.getElementById('game_imgfile').files[0];
    const gameTitle = document.getElementById('game_title').value;
    const gameDescription = document.getElementById('game_description').value;
    const gamePrice = document.getElementById('game_price').value;

    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบหรือไม่
    if (!gameImgFile || !gameTitle || !gameDescription || !gamePrice) {
        alert('กรอกข้อมูลให้ครบทุกช่อง'); // แสดงข้อความเตือน
        return;
    }
    
    // สร้าง FormData เพื่อส่งข้อมูลทั้งหมด
    const formData = new FormData();
    formData.append('game_imgfile', gameImgFile);
    formData.append('game_title', gameTitle);
    formData.append('game_description', gameDescription);
    formData.append('game_price', gamePrice);
    formData.append('game_category',gamecategory);
    // ส่งข้อมูลไปที่เซิร์ฟเวอร์ผ่าน axios
    axios.post('/manage/upload', formData)
        .then(function(response) {
            console.log('Game uploaded successfully:', response.data);
            closeAddGame();  // ปิด modal การเพิ่มเกม
            alert('Game uploaded successfully!');
            resetForm();  // รีเฟรชฟอร์ม
            fetchGames();  // รีเฟรชรายการเกม
        })
        .catch(function(error) {
            console.error('Error uploading game:', error);
            alert(error.response.data);
        });
}

function gotoManage(){
    window.location.href = '/manage';
}

function goToHome(){
    window.location.href = '/';
}

let gamesData = []; // เก็บข้อมูลเกมทั้งหมด
let filteredGamesData = []; // เก็บข้อมูลเกมที่กรอง
let currentPage = 1; // หน้าเริ่มต้น
const itemsPerPage = 10; // จำนวนเกมต่อหน้า
let showZeroKey = false; // สถานะการกรองเกมที่ key_count = 0

// ฟังก์ชันดึงข้อมูลเกม
function fetchGames() {
    axios.get('/manage/getGameToManage')
        .then(function (response) {
            gamesData = response.data.filter(game => game.game_deleted == 0); // กรองเกมที่ถูกลบ
            filteredGamesData = [...gamesData]; // เริ่มต้นให้ข้อมูลที่กรองเหมือนข้อมูลทั้งหมด
            currentPage = 1; // รีเซ็ตไปหน้าแรก
            displayGames(); // แสดงผลตามหน้า
            setupPagination(); // สร้างปุ่มแบ่งหน้า
        })
        .catch(function (error) {
            console.error('Error fetching games:', error);
        });
}

// ฟังก์ชันกรองเกมที่ key_count = 0
function filterZeroKey() {
    showZeroKey = !showZeroKey; // เปลี่ยนสถานะการกรอง
    if (showZeroKey) {
        filteredGamesData = gamesData.filter(game => game.key_count === 0); // กรองเกมที่ key_count = 0
    } else {
        filteredGamesData = [...gamesData]; // คืนค่าข้อมูลทั้งหมด
    }
    currentPage = 1; // รีเซ็ตหน้าเป็น 1
    displayGames(); // แสดงผลตามข้อมูลที่กรอง
    setupPagination(); // รีเฟรชปุ่มแบ่งหน้า

    // เปลี่ยนข้อความของปุ่ม
    const filterButton = document.getElementById('filter-zero-key');
    if (showZeroKey) {
        filterButton.textContent = 'Reset Filter'; // เปลี่ยนเป็น Reset เมื่อกรองแล้ว
    } else {
        filterButton.textContent = 'Show Games with 0 Keys'; // เปลี่ยนเป็น Show 0 Key เมื่อไม่กรอง
    }
}

function displayGames() {
    const tbody = document.getElementById('games-container');
    tbody.innerHTML = ''; // ล้างตารางก่อน
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedGames = filteredGamesData.slice(start, end); // ตัดเฉพาะเกมของหน้านั้นๆ

    paginatedGames.forEach((game, index) => {
        const formattedPrice = parseFloat(game.game_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const row = `
            <tr>
                <td>${start + index + 1}</td>
                <td><img src="../img/game/${game.game_image}" alt="${game.game_title}" style="width: 100px;"></td>
                <td style="text-align: left;">${game.game_title}</td>
                <td>฿${formattedPrice}</td>
                <td>${game.key_count}</td>
                <td class="editDelButton">
                    <button onclick="openKeyGame(${game.game_id})" class="addKey">Add Key</button>
                    <button onclick="editGame(${game.game_id})" class="editButton">Edit</button>
                    <button onclick="confirmDeleteGame(${game.game_id})" class="deleteButton">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    checkAndToggleTbody();
}


// ฟังก์ชันแบ่งหน้า
function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // ล้างปุ่มเก่าออก

    const totalPages = Math.ceil(filteredGamesData.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.classList.add('page-btn');
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', function () {
            currentPage = i;
            displayGames(); // แสดงเกมของหน้านั้น
            setupPagination(); // รีเฟรชปุ่มแบ่งหน้า
        });
        paginationContainer.appendChild(btn);
    }
}

// ฟังก์ชันค้นหาจากลำดับที่แสดงบนตาราง
function searchGames() {
    const searchQuery = document.getElementById('searchinput').value.toLowerCase();
    
    if (searchQuery.trim() === "") {
        filteredGamesData = [...gamesData]; // ถ้าไม่กรอกข้อความ ค้นหาทั้งหมด
    } else {
        filteredGamesData = gamesData.filter((game, index) => {
            // ค้นหาจากลำดับที่แสดง
            const displayId = (index + 1).toString(); // ใช้ลำดับที่แสดง (เริ่มจาก 1)
            return game.game_title.toLowerCase().includes(searchQuery) || displayId.includes(searchQuery);
        });
    }
    currentPage = 1; // รีเซ็ตหน้าเป็น 1
    displayGames(); // แสดงผล
    setupPagination(); // รีเฟรชปุ่มแบ่งหน้า
}

// เพิ่ม event listener ให้กับช่องค้นหา
document.getElementById('searchinput').addEventListener('input', searchGames);



function confirmDeleteGame(gameId){
    const alertmodal = document.getElementById('alert-modal');
    alertmodal.classList.add('show'); 
    const alertcontain = document.getElementById('alert-contain');
    alertcontain.innerHTML = `
        <span class="headalert">Confirm Deletion</span>
        <hr width="100%" style="">
        <span class="alertdes" style="text-align:center">Are you sure you want to <br> delete this game?</span>
        <div class="alert-button">
                <button id="confirmbt" onclick="deleteGame(${gameId})">Comfirm</button>
                <button id="cancelbt" onclick="closeAlert()">Cancel</button>
        </div>
    `;
}

function closeAlert(){
    const alertmodal = document.getElementById('alert-modal');
    alertmodal.classList.remove('show');
}


// เรียกใช้ฟังก์ชันเมื่อโหลดหน้าเสร็จ
document.addEventListener('DOMContentLoaded', fetchGames);

function deleteGame(gameId){
    axios.patch(`/manage/deleteGame/${gameId}`)
    .then(function(response){
        console.log('Game deleted successfully:', response.data);
        closeAddGame();
        fetchGames();
        closeAlert();
    })
    .catch(function(error){
        console.error('Error deleting game:', error);
        alert('Error deleting game');
    });
}


function editGame(gameId) {
    modalAddgame();  // เปิด modal การเพิ่มเกม
    axios.get(`/manage/getGameDetails/${gameId}`)
        .then(function(response) {
            const game = response.data;
            document.getElementById('game-category').value = game.game_category;
            document.getElementById('game_id').value = game.game_id;
            document.getElementById('game_title').value = game.game_title;
            document.getElementById('game_description').value = game.game_description;
            document.getElementById('game_price').value = game.game_price;
            
            // แสดงภาพเดิมใน preview
            document.getElementById('preview').src = `../img/game/${game.game_image}`;
            document.getElementById('preview').style.display = 'block';  // แสดงภาพพรีวิว
            
            // ซ่อนข้อความเตือนหากมีภาพเดิม
            document.getElementById('imageError').style.display = 'none';
        })
        .catch(function(error) {
            if (error.response && error.response.data) {
                console.error('Error fetching game details:', error.response.data);
                alert('Error: ' + error.response.data);  // แสดงข้อความที่เซิร์ฟเวอร์ส่งกลับ
            } else {
                console.error('Unexpected error:', error);
                alert('Unexpected error occurred. Please try again.');
            }
        });
}

async function sendGameEdit(gameId) {
    const gamecategory = document.getElementById('game-category').value;
    const gameImgFile = document.getElementById('game_imgfile').files[0] || null;  // ใช้ไฟล์ที่เลือกจาก input file หรือ null
    const gameTitle = document.getElementById('game_title').value;
    const gameDescription = document.getElementById('game_description').value;
    const gamePrice = document.getElementById('game_price').value;
    if(gamePrice <= 0){
        alert('กรุณากรอกราคาเกมให้ถูกต้อง');
        return
    }
    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบหรือไม่
    if (!gameTitle || !gameDescription || !gamePrice) {
        alert('กรอกข้อมูลให้ครบทุกช่อง'); // แสดงข้อความเตือน
        return;
    }

    // สร้าง FormData เพื่อส่งข้อมูลทั้งหมด
    const formData = new FormData();
    
    if (gameImgFile) {
        formData.append('game_imgfile', gameImgFile);  // ถ้ามีไฟล์ใหม่ให้ส่งไป
    } else {
        // ถ้าไม่มีไฟล์ใหม่ ให้ส่งชื่อไฟล์เดิม
        const currentImage = document.getElementById('preview').src.split('/').pop();
        formData.append('game_imgfile', currentImage); 
    }

    formData.append('game_title', gameTitle);
    formData.append('game_description', gameDescription);
    formData.append('game_price', gamePrice);

    axios.patch(`/manage/updateGame/${gameId}`, formData)
        .then(function(response) {
            console.log('Game edited successfully:', response.data);
            closeAddGame();  // ปิด modal การเพิ่มเกม
            resetForm();  // รีเฟรชฟอร์ม
            alert('Game edited successfully!');
            fetchGames();  // รีเฟรชรายการเกม
        })
        .catch(function(error) {
            console.error('Error editing game:', error);
            alert(error.response.data);
        });
}

const img = document.getElementById('preview');
        if (!img.src || img.src === window.location.href) {
            // ตรวจสอบว่าค่า src เป็นค่าว่าง หรือยังไม่ถูกตั้งค่า
            img.style.display = 'none';
        }

document.getElementById('search-icon').addEventListener('click',searchBoxChange);
function searchBoxChange() {
    const searchBox = document.querySelector('.search-box');
    const searchIcon = document.getElementById('search-icon');
    const searchinput = document.getElementById('searchinput');
    const x = document.getElementById('x');
    // ซ่อน searchIcon และแสดง x
    searchIcon.style.display = 'none';
    x.style.display = 'block';
    searchBox.classList.add('active');
    searchinput.focus();   
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

async function openKeyGame(gameId){
    const modalKeygame = document.getElementsByClassName('modalKeygame')[0];
    const addkeyGameModal = document.getElementsByClassName('addkeyGameModal')[0];
    addkeyGameModal.innerHTML = `
    <div class="headKeygame">
                <input type="hidden" id="gameKeyid" value="${gameId}">
    </div>
            <div class="mainKeygame">
                <div class="leftKey">
                     
                </div>
                <div class="rightKey">
                    
                </div>
            </div>
            <div class="footerKeyGame">
    </div>
    `;
    await axios.post('/manage/getKeyGameIMG',{gameId})
    .then((res)=>{
        const game = res.data[0];
        const headKeygame = document.getElementsByClassName('headKeygame')[0];
        const rightKey = document.getElementsByClassName('rightKey')[0];
        headKeygame.innerHTML = `
            <div class="keyAmount">Key Amount: 0</div>
            <div class="gameName">${game.game_title}</div>
            <div class="saveOrClose" id="sorc">
                    <button class="close_button" onclick="closeKeyGame()">Close</button>
            </div>
        `;
        rightKey.innerHTML = `
            <img src="img/game/${game.game_image}" alt="" class="imgKeyGame">
            <input type="text" name="" id="inputKeyGame" class="inputKeyGame" placeholder="Input Key Game:">
            <button class="addKeyButton" onclick="addKey(${game.game_id})">Add Key</button>
        `;
        
    })
    .catch((error)=>{
        console.log(error);
    });
    await fetchKeys(gameId);
    modalKeygame.classList.add('show');
    setTimeout(() => {
        const inputKeyGame = document.getElementById('inputKeyGame');
        if (inputKeyGame) {
            inputKeyGame.focus(); // โฟกัสเมื่อ DOM พร้อม
        }
    }, 50);
}

async function fetchKeys(gameId) {
    await axios.post('/manage/getKeyGame', { game_id: gameId })
    .then((res) => {
        let leftKey = document.getElementsByClassName('leftKey')[0];
        leftKey.innerHTML ='';
        // สร้างตารางใหม่ที่ถูกต้อง
        leftKey.innerHTML = `
            <table style="width: 100%;" class="tableKey">

                <tbody></tbody>
            </table>
        `;
        const keyAmount = document.getElementsByClassName('keyAmount')[0];
        const tableKey = document.getElementsByClassName('tableKey')[0].getElementsByTagName('tbody')[0];
        let i = 0;
        // ลูปเพื่อเพิ่มข้อมูลในแถว
        res.data.forEach((key) => { 
            let tr = document.createElement('tr');
            tr.id = `${key.keygame}`;
        // สร้างเซลล์ในแถว
        let td1 = document.createElement('td');
        td1.style.border = 'none';
        td1.style.width = '70%';
        let input = document.createElement('input');
        input.type = 'text';
        input.readOnly = true;
        input.value = key.keygame;
        td1.appendChild(input);      
        let td2 = document.createElement('td');
        td2.id = `td${key.keygame}`;
        td2.style.border = 'none';
        //let editButton = document.createElement('button');
        //editButton.className = 'editButton';
        //editButton.textContent = 'Edit';
        let deleteButton = document.createElement('button');
        deleteButton.className = `deleteButton`;
        deleteButton.id = `deleteButton${key.keygame}`;
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteKey(key.keygame,gameId);
        //td2.appendChild(editButton);
        td2.appendChild(deleteButton);
        // เพิ่มเซลล์เข้าแถว
        tr.appendChild(td1);
        tr.appendChild(td2); 
        // เพิ่มแถวใน tbody ของตาราง
        tableKey.appendChild(tr);
        i++;
    });
    keyAmount.innerHTML = `Key Amount: ${i}`; 
    })
    .catch((err)=>{

    });         
}

function closeKeyGame(){
    const modalKeygame = document.getElementsByClassName('modalKeygame')[0];
    modalKeygame.classList.remove('show');
    fetchGames();
}

async function addKey(gameId) {
    const keyInput = document.getElementsByClassName('inputKeyGame')[0];
    const keyGame = keyInput.value.trim();

    if (!keyGame || keyGame === '') {
        alert('Please input a valid key');
        return;
    }

    try {
        // ส่งข้อมูลไปยังเซิร์ฟเวอร์
        const res = await axios.post('/manage/addkey', {
            game_id: gameId,
            keygame: keyGame
        });

        // อัพเดตข้อมูลตารางหลังเพิ่มคีย์สำเร็จ
        keyInput.value = '';
        //alert('Add Key Success');
        fetchKeys(gameId); // อัพเดตคีย์ใหม่ในหน้าตาราง
    } catch (error) {
        // จัดการข้อผิดพลาดจากเซิร์ฟเวอร์
        keyInput.value = '';
        if (error.response && error.response.data) {
            alert(error.response.data); // แสดงข้อความจากเซิร์ฟเวอร์
        } else {
            console.error(error);
            alert('An unexpected error occurred.');
        }
    }
}

async function deleteKey(key,gameId) {
    const tdbutton = document.getElementById(`td${key}`);

    // รีเซ็ตปุ่มทั้งหมด
    resetAllDeleteButtons();

    // ล้างปุ่มเดิมใน td
    tdbutton.innerHTML = '';

    // สร้างปุ่ม Confirm และ Cancel ใหม่
    const confirmButton = document.createElement('button');
    const cancelButton = document.createElement('button');

    confirmButton.id = 'confirmDelKey'; // เพิ่ม class สำหรับ CSS
    cancelButton.id = 'cancelDelKey';  // เพิ่ม class สำหรับ CSS

    confirmButton.textContent = 'Confirm';
    cancelButton.textContent = 'Cancel';

    confirmButton.onclick = async () => {
        try {
            await axios.delete('/manage/deletekey',  { 
                params: { keygame: key } // ส่ง keygame ผ่าน URL params
            });
            document.getElementById(key).remove(); // ลบแถวออกจากตาราง
            openKeyGame(gameId);
        } catch (error) {
            console.error(error);
            alert('Failed to delete key.');
        } finally {
            resetAllDeleteButtons(); // รีเซ็ตปุ่มเมื่อเสร็จสิ้น
        }
    };

    cancelButton.onclick = () => resetAllDeleteButtons();

    // เพิ่มปุ่มใหม่เข้าใน td
    tdbutton.appendChild(confirmButton);
    tdbutton.appendChild(cancelButton);
}


function resetAllDeleteButtons() {
    const allKeys = document.querySelectorAll('[id^="td"]'); // เลือกทุก td ที่เริ่มต้นด้วย id="td"
    allKeys.forEach((td) => {
        const keyId = td.id.replace('td', ''); // ดึง id ของคีย์ (เอาส่วน "td" ออก)
        // ล้างเนื้อหาของ td
        td.innerHTML = '';

        // สร้างปุ่ม Delete ใหม่
        const deleteButton = document.createElement('button');
        deleteButton.className = 'deleteButton'; // เพิ่ม class เพื่อให้ CSS เดิมใช้งานได้
        deleteButton.textContent = 'Delete'; // กำหนดข้อความบนปุ่ม
        deleteButton.onclick = () => deleteKey(keyId); // กำหนดฟังก์ชันเมื่อกดปุ่ม

        // เพิ่มปุ่มเข้าไปใน td
        td.appendChild(deleteButton);
    });
}


