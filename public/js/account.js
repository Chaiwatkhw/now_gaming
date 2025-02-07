window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.href = '/';
    }
});

function gotoHome(){
    window.location.href = '/';
}

async function fetchUserData() {
    try {
        const response = await axios.get('/account/getUserData');
        if (response.data.success) {
            document.getElementById('usernameread').value = response.data.username;
            document.getElementById('emailread').value = response.data.email;
        } else {
            console.error('Error fetching user data:', response.data.error);
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

// โหลดข้อมูลเมื่อเปิดหน้า
document.addEventListener("DOMContentLoaded", fetchUserData);

document.addEventListener("DOMContentLoaded", function () {
    const myAccountTab = document.querySelector(".my-account");
    const myOrderTab = document.querySelector(".my-order");
    const accountAndOrderTitle = document.querySelector(".account-and-order");
    const inRightContent = document.querySelector(".in-right-content");
    const sec2 = document.querySelector(".sec2");

    function setActiveTab(activeTab, title, showRightContent) {
        myAccountTab.classList.remove("active-tab");
        myOrderTab.classList.remove("active-tab");
        activeTab.classList.add("active-tab");

        // เปลี่ยนข้อความของ .account-and-order
        accountAndOrderTitle.textContent = title;

        // แสดงหรือซ่อน .in-right-content
        inRightContent.style.display = showRightContent ? 'block' : 'none';

        // แสดงหรือซ่อน .sec2
        sec2.style.display = showRightContent ? 'none' : 'block';
    }

    // เมื่อโหลดหน้า ให้ตั้งค่าเริ่มต้นเป็น "My Account" และแสดง .in-right-content
    setActiveTab(myAccountTab, "My Account", true);

    // เมื่อกด "My Account"
    myAccountTab.addEventListener("click", () => setActiveTab(myAccountTab, "My Account", true));

    // เมื่อกด "My Orders"
    myOrderTab.addEventListener("click", () => setActiveTab(myOrderTab, "My Orders", false));
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".Button").addEventListener("click", async () => {
        const email = document.getElementById("emailread").value;
        const currentPassword = document.getElementById("curpass").value;
        const newPassword = document.getElementById("newpass").value;
        const confirmNewPassword = document.getElementById("connewpass").value;

        const IcurrentPassword = document.getElementById("curpass");
        const InewPassword = document.getElementById("newpass");
        const IconfirmNewPassword = document.getElementById("connewpass");

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            IcurrentPassword.value = '';
            InewPassword.value = '';
            IconfirmNewPassword.value = '';
            return;
        }

        // ตรวจสอบความยาวของรหัสผ่าน
        if (newPassword.length < 8) {
            alert("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
            IcurrentPassword.value = '';
            InewPassword.value = '';
            IconfirmNewPassword.value = '';
            return;
        }

        // ตรวจสอบว่ารหัสผ่านใหม่และการยืนยันรหัสผ่านตรงกัน
        if (newPassword !== confirmNewPassword) {
            alert("รหัสผ่านใหม่ไม่ตรงกัน");
            IcurrentPassword.value = '';
            InewPassword.value = '';
            IconfirmNewPassword.value = '';
            return;
        }

        try {
            const response = await axios.post("/account/change-password", {
                email,
                currentPassword,
                newPassword
            });

            alert(response.data.message);
            IcurrentPassword.value = '';
            InewPassword.value = '';
            IconfirmNewPassword.value = '';
            
        } catch (error) {
            alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
            IcurrentPassword.value = '';
            InewPassword.value = '';
            IconfirmNewPassword.value = '';
        }
    });
});

async function fetchOrders() {
    try {
        const response = await axios.get('/account/getorder');  // เรียก API เพื่อดึงข้อมูลคำสั่งซื้อ
        if (response.data.orders && response.data.orders.length > 0) {
            let orders = response.data.orders;

            // จัดเรียงคำสั่งซื้อจากใหม่ไปเก่า (โดยพิจารณาจากวันที่ของคำสั่งซื้อ)
            orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

            const ordersContainer = document.getElementById('ordersContainer');
            
            // ลบข้อมูลเก่าออกก่อน
            ordersContainer.innerHTML = '';

            // คำนวณและแสดงคำสั่งซื้อแยกตาม order_id
            let currentOrderId = null;
            let currentOrderItems = [];
            let currentTotalPrice = 0;

            orders.forEach(order => {
                if (order.order_id !== currentOrderId) {
                    // ถ้าเป็นคำสั่งซื้อใหม่ (order_id ใหม่) ให้แสดงคำสั่งซื้อเก่าก่อน
                    if (currentOrderItems.length > 0) {
                        renderOrderTable(currentOrderItems, currentTotalPrice);
                    }

                    // รีเซ็ตตัวแปรสำหรับคำสั่งซื้อใหม่
                    currentOrderId = order.order_id;
                    currentOrderItems = [];
                    currentTotalPrice = 0;
                }

                // เพิ่มรายการสินค้าในคำสั่งซื้อ
                currentOrderItems.push(order);
                currentTotalPrice += parseFloat(order.game_price);
            });

            // แสดงคำสั่งซื้อสุดท้าย
            if (currentOrderItems.length > 0) {
                renderOrderTable(currentOrderItems, currentTotalPrice);
            }
        } else {
            console.log('No orders found');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

function renderOrderTable(orderItems, totalPrice) {
    const ordersContainer = document.getElementById('ordersContainer');

    // สร้างตารางใหม่สำหรับคำสั่งซื้อแต่ละคำสั่ง
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order-container');
    
    // สร้างตาราง
    const table = document.createElement('table');
    table.classList.add('order-table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Game Title</th>
                <th>Key</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            ${orderItems.map(order => `
                <tr>
                    <td>${order.game_title}</td>
                    <td>${order.keygame}</td>
                    <td>${order.game_price}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    orderDiv.appendChild(table);

    // แสดงราคารวม
    const totalPriceDiv = document.createElement('div');
    totalPriceDiv.classList.add('total-price');
    totalPriceDiv.innerHTML = `<span>Total Price: </span><span>${totalPrice.toFixed(2)}</span>`;
    orderDiv.appendChild(totalPriceDiv);

    // เพิ่มคำสั่งซื้อที่แยกเป็นกลุ่มไปยัง container
    ordersContainer.appendChild(orderDiv);
}

// โหลดข้อมูลคำสั่งซื้อเมื่อหน้าโหลด
document.addEventListener('DOMContentLoaded', fetchOrders);
