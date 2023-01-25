const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];
function init() {
    const cartId= window.location.href.split('/');
    const id = cartId[cartId.length - 1];
    fetch('http://127.0.0.1:8090/admin/cart/'+id, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=> res.json())
        .then(cartData => {
            document.getElementById('price').value = (cartData.to_pay).toFixed(2);
            const list = document.getElementById('gamesList');
            list.innerHTML += '<tr> <th> Game </th> <th> Price </th> </tr>';
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
                                list.innerHTML+= 
                                    `
                                    <tr>
                                    <td> ${gameData.title} </td>
                                    <td> ${gameData.price} </td>
                                    </tr>
                                    `;
                                //games.add(gameData);
                            });
                    });
                })
                }).catch(err=>alert(err));
}

