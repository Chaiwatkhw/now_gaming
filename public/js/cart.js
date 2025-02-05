function goIndex(){
    window.location.href = '/';
}

async function loadCart() {
    try {
        const res = await axios.post('/cart/getCart', {}, { withCredentials: true });
        const cartItems = res.data.cart;
        console.log(cartItems)
        const cartContainer = document.querySelector('.gameCart');
        cartContainer.innerHTML = ""; // เคลียร์ข้อมูลเก่าก่อน

        cartItems.forEach(item => {
            const gameElement = document.createElement('div');
            gameElement.classList.add('game-item');

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
                    ${item.game_price}
                </div>
                <div class="amount" onchange="updateCart(${item.game_id}, this.value)">
                    <select name="" id="gameAmount">
                    ${[1,2,3,4,5].map(num => `
                        <option value="${num}" ${num == item.quantity ? 'selected' : ''}>${num}</option>
                    `).join('')}
                    </select>
                </div>
            </div>
         
            `;
            
            cartContainer.appendChild(gameElement); 
        }); 
    } catch (error) {
        console.error("Error loading cart:", error);
    }
}

async function removeFromCart(gameId) {
    try {
        await axios.post('/removeCart', { game_id: gameId }, { withCredentials: true });
        loadCart(); // โหลดตะกร้าใหม่หลังลบ
    } catch (error) {
        console.error("Error removing item:", error);
    }
}

async function updateCart(gameId, quantity) {
    try {
        await axios.post('/updateCart', { game_id: gameId, quantity }, { withCredentials: true });
        loadCart(); // โหลดตะกร้าใหม่หลังอัปเดต
    } catch (error) {
        console.error("Error updating quantity:", error);
    }
}

// โหลดตะกร้าทันทีเมื่อหน้าเว็บโหลด
document.addEventListener("DOMContentLoaded", loadCart);
