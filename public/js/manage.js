// เรียกใช้งานหลังจากโหลดข้อมูล
document.addEventListener('DOMContentLoaded', () => {
    // เรียกใช้ function เพื่อตรวจสอบการมีแถวใน tbody
    checkAndToggleTbody();
});

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
    document.documentElement.style.overflow = 'hidden';
}


function closeAddGame(){
    let modalAddgame = document.getElementsByClassName('modal')[0];
    modalAddgame.style.display = 'none';
    document.documentElement.style.overflow = '';

    const preview = document.getElementById('preview');
    preview.style.display = 'none';
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
    
    if (fileInput.files.length == 0) {
        imageError.style.display = 'block'; // แสดงข้อความเตือน
        return false;  // คืนค่า false เมื่อไม่พบไฟล์
    } else {
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

function goToHome(){
    window.location.href = '/';
}

function fetchGames() {
    axios.get('/manage/getGameToManage')
        .then(function (response) {
            const games = response.data;
            const tbody = document.getElementById('games-container');
            tbody.innerHTML = ''; // ล้างตารางก่อน
            let i = 1;
            games.forEach(game => {
                const formattedPrice = parseFloat(game.game_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                if (game.game_deleted == 0 ){
                const row = `
                    <tr>
                        <td>${i}</td>
                        <td><img src="../img/game/${game.game_image}" alt="${game.game_title}" style="width: 100px;"></td>
                        <td style="text-align: left;">${game.game_title}</td>
                        <td>฿${formattedPrice}</td>
                        <td>0</td>
                        <td class="editDelButton">
                            <button onclick="editGame(${game.game_id})" class="editButton">Edit</button>
                            <button onclick="confirmDeleteGame(${game.game_id})" class="deleteButton">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
                i += 1;
                }
            });

            checkAndToggleTbody(); // เรียกฟังก์ชันเพื่อตรวจสอบตาราง
        })
        .catch(function (error) {
            console.error('Error fetching games:', error);
        });
}

function confirmDeleteGame(gameId){
    const alertmodal = document.getElementById('alert-modal');
    alertmodal.style.display = 'flex'; 
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
    alertmodal.style.display = 'none'; // ปิด modal
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


function sendGameEdit(gameId) {
    const gameImgFile = document.getElementById('game_imgfile').files[0] || null;  // ใช้ไฟล์ที่เลือกจาก input file หรือ null
    const gameTitle = document.getElementById('game_title').value;
    const gameDescription = document.getElementById('game_description').value;
    const gamePrice = document.getElementById('game_price').value;

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





