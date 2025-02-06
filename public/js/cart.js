window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.href = '/';
    }
});

function goIndex(){
    window.location.href = '/';
}

async function loadCart() {
    try {
        const res = await axios.post('/cart/getCart', {}, { withCredentials: true });
        const cartItems = res.data.cart;
        const cartContainer = document.querySelector('.gameCart');
        const summaryPrice = document.querySelector('.summary-row span:last-child'); // ตำแหน่งของราคารวม
        cartContainer.innerHTML = ""; // เคลียร์ข้อมูลเก่าก่อน

        let subtotal = 0; // ตัวแปรเก็บราคารวม

        cartItems.forEach(item => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('game-item');
            const maxAmount = Math.min(5, item.available_keys);

            // คำนวณราคารวมของสินค้าแต่ละรายการ
            subtotal += item.game_price * item.quantity;

            gameElement.innerHTML = `
            <img src="img/game/${item.game_image}" alt="" class="gameIMG">
            <div class="game-info" id="game-info">
                <div class="game-title">
                    ${item.game_title}
                </div>
                <div class="recycle">
                    <i class="fa fa-trash" id="trash" title="Remove" onclick="removeFromCart(${item.game_id})"></i>
                </div>
            </div>
            <div class="price-and-amount">
                <div class="price">
                    ${item.game_price} THB
                </div>
                <div class="amount">
                    <select name="" id="gameAmount" onchange="updateCart(${item.game_id}, this.value)">
                    ${Array.from({ length: maxAmount }, (_, i) => `
                        <option value="${i + 1}" ${i + 1 == item.quantity ? 'selected' : ''}>${i + 1}</option>
                    `).join('')}
                    </select>
                </div>
            </div>
            `;
            
            cartContainer.appendChild(gameElement);
        });

        // อัปเดตราคารวมใน Summary
        summaryPrice.textContent = `${subtotal.toFixed(2)} THB`;

    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

// โหลดตะกร้าทันทีเมื่อหน้าเว็บโหลด
document.addEventListener("DOMContentLoaded", loadCart);



async function removeFromCart(gameId) {
    try {
        await axios.post('/cart/removeCart', { game_id: gameId }, { withCredentials: true });
        loadCart(); // โหลดตะกร้าใหม่หลังลบ
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

async function updateCart(gameId, quantity) {
    try {
        await axios.post('/cart/updateCart', { game_id: gameId, quantity }, { withCredentials: true });
        loadCart(); // โหลดตะกร้าใหม่หลังอัปเดต
    } catch (error) {
        console.error("Error updating quantity:", error);
    }
}

async function pay() {
    try {
        const res = await axios.post('/cart/pay', {}, { withCredentials: true });

        if (res.data.success) {
            alert("Payment Successful!");
            loadCart(); // โหลดตะกร้าใหม่หลังชำระเงิน
            goIndex();
        }
    } catch (error) {
        console.error("Payment error:", error);
        alert(error.response?.data?.error || "Payment failed");
    }
}



