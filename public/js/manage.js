function modalAddgame() {
    let modalAddgame = document.getElementsByClassName('modal')[0];
    modalAddgame.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
}
// เรียกใช้งานหลังจากโหลดข้อมูล
document.addEventListener('DOMContentLoaded', () => {
    // เรียกใช้ function เพื่อตรวจสอบการมีแถวใน tbody
    checkAndToggleTbody();
});

function closeAddGame(){
    let modalAddgame = document.getElementsByClassName('modal')[0];
    modalAddgame.style.display = 'none';
    document.documentElement.style.overflow = '';

    const preview = document.getElementById('preview');
    preview.style.display = 'none';
}

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
    const imageError = document.getElementById('imageError');

    // ตรวจสอบว่าไฟล์ถูกเลือกหรือไม่
    if (!fileInput.files.length) {
        imageError.style.display = 'block'; // แสดงข้อความเตือน
        return ;
    }
}

document.getElementById('addGameForm').addEventListener('submit',async function(event) {
    event.preventDefault(); // ป้องกันการส่งฟอร์มโดยตรง
    await validateForm(); // ตรวจสอบข้อมูลก่อนส่งฟอร์ม
    const gameImgFile = document.getElementById('game_imgfile').files[0];
    const gameTitle = document.getElementById('game_title').value;
    const gameDescription = document.getElementById('game_description').value;
    const gamePrice = document.getElementById('game_price').value;

    // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบหรือไม่
    if (!gameImgFile || !gameTitle || !gameDescription || !gamePrice) {
        alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
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
            window.location.reload();
        })
        .then(function() {
            console.log('Game upload success message shown');
            fetchGames();  // รีเฟรชรายการเกม
        })
        .catch(function(error) {
            console.error('Error uploading game:', error);
            alert(error.data);
        });
});

function goToHome(){
    window.location.href = '/';
}

function fetchGames() {
    axios.get('/manage/getGameToManage')
        .then(function (response) {
            const games = response.data;
            console.log(games);
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


function editPreviewImage() {
    const fileInput = document.getElementById('edit_game_imgfile');
    const preview = document.getElementById('editPreview');
    const imageError = document.getElementById('editImageError');

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.src = event.target.result;
            preview.style.display = 'block';
            imageError.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        imageError.style.display = 'block';
    }
}
document.getElementById('editGameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const gameId = document.getElementById('edit_game_id').value; // Pass the gameId if needed
    const gameImgFile = document.getElementById('edit_game_imgfile').files[0];
    const gameTitle = document.getElementById('edit_game_title').value;
    const gameDescription = document.getElementById('edit_game_description').value;
    const gamePrice = document.getElementById('edit_game_price').value;

    // Create FormData
    const formData = new FormData();
    if (gameImgFile) {
        formData.append('edit_game_imgfile', gameImgFile);
    }
    formData.append('game_title', gameTitle);
    formData.append('game_description', gameDescription);
    formData.append('game_price', gamePrice);

    // Send to the server to update
    axios.patch(`/manage/updateGame/${gameId}`, formData)
        .then(function(response) {
            closeEditGame();  // Close the edit modal
        })
        .catch(function(error) {
            console.error('Error updating game:', error);
        });
});







