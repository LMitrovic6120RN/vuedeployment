const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];
var totalToPay = 0.0;
var cart_receiptId = 0;
function init() {
    const games = [];
    let currUser = getCurrUser();
    fetch('http://127.0.0.1:8090/admin/cart/user/'+currUser.usersId, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json())
        .then(cartData => {
            cart_receiptId = cartData.id;
            document.getElementById('to_pay').value = (cartData.to_pay).toFixed(2);
            totalToPay = (cartData.to_pay).toFixed(2);
            if (cartData.to_pay === 0){
                alert("Your cart is empty");
                return;
            }
            const list = document.getElementById('cartList');
            list.innerHTML += '<tr> <th> Game </th> <th> Price </th> <th> Remove </th> </tr>';
            fetch('http://127.0.0.1:8090/admin/item/cart/'+cartData.id, {
                headers: {'Authorization': `Bearer ${token}`}
            }).then(res=>res.json())
                .then(itemData=> {
                    
                    itemData.forEach( item => {
                        console.log("Fetching for: "+item.game_item);
                        fetch('http://127.0.0.1:8090/admin/games/'+item.game_item, {
                            headers: {'Authorization': `Bearer ${token}`}
                        }).then(res=>res.json())
                            .then(gameData=>{
                                console.log("added to games: "+JSON.stringify(gameData));
                                var obj = {};
                                obj = gameData;
                                games.push(obj);
                                list.innerHTML+= 
                                    `
                                    <tr>
                                    <td> ${gameData.title} </td>
                                    <td> ${gameData.price} </td>
                                    <td> <button id='remove_${gameData.id}' data-id='${gameData.id}' onclick='removeFromCart(this);'> Remove </button> </td>
                                    </tr>
                                    `;
                                //games.add(gameData);
                            });
                    });
                }).catch(err=>alert(err));
        }).catch(err=>alert(err));

    
    document.getElementById('payBtn').addEventListener('click', e => {
        e.preventDefault();
        const receiptData = {
            total: parseInt(document.getElementById('to_pay').value, 10),
            user_receipt: currUser.usersId,
            cart_receipt: cart_receiptId
        };
        console.log(JSON.stringify(receiptData));
        fetch('http://127.0.0.1:8090/admin/receipts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(receiptData)
        }).then(res=>res.json()).then(data=> {
            if (data.msg){
                alert(data.msg);
                return;
            }
            window.location.href = 'http://127.0.0.1:8000/admin/receipt/'+data.cart_receipt;
        }).catch(err=>alert(err));
    });
}

let removeFromCart = button => {
    //smanjiti cenu za to_pay
    console.log("TOPAY U REMOVE FJI: "+totalToPay);
    let usr = getCurrUser();
    const forRemoval = parseInt(button.getAttribute('data-id'), 10);
    fetch('http://127.0.0.1:8090/admin/item/game/'+forRemoval, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json())
        .then(data => {
           // window.location.reload();
           totalToPay = totalToPay - (data.price).toFixed(2);
           const newDataForCart = {
            to_pay: totalToPay,
            user_cart: usr.usersId
           };
            fetch('http://127.0.0.1:8090/admin/cart/user/'+usr.usersId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newDataForCart)
            }).then(res=>res.json())
                .then(data => {
                    if (data.msg){
                        alert(data.msg);
                        return;
                    }
                    window.location.reload();
                })
        }).catch(err=>alert(err));
}

function getCurrUser(){
    let token = document.cookie.split(';')[0].split('=')[1];
    console.log(token);
    if(token === ''){
        console.log("uso");
        return 'no user';
    }
    let payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}