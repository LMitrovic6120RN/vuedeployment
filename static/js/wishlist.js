const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init(){
    let currUser = getCurrUser();
    fetch('http://127.0.0.1:8090/admin/wishlist/user/'+currUser.usersId, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json())
        .then(wlData => {
            const list = document.getElementById('wlList');
            list.innerHTML += '<tr> <th> Game </th> <th> Price </th> <th> Remove </th> </tr>';
            wlData.forEach(wl => {
                fetch('http://127.0.0.1:8090/admin/games/'+wl.game_wishlist, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res=>res.json())
                    .then(gameData => {
                        list.innerHTML+= 
                                    `
                                    <tr>
                                    <td> ${gameData.title} </td>
                                    <td> ${gameData.price} </td>
                                    <td> <button id='remove_${gameData.id}' data-id='${gameData.id}' onclick='removeFromWl(this);'> Remove </button> </td>
                                    </tr>
                                    `;
                    }).catch(err=>alert(err));
            });
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

let removeFromWl = button => {
   // alert("remove");
    // /wishlist/game/:game/:user
    let currUser = getCurrUser();
    const forRemoval = parseInt(button.getAttribute('data-id'), 10);
    fetch('http://127.0.0.1:8090/admin/wishlist/game/'+forRemoval+'/'+currUser.usersId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json()).then(data=>{
        if (data.msg){
            alert(data.msg);
            return;
        }
        window.location.reload();
    }).catch(err=>alert(err));
}