const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];
function init(){
    let currUser = getCurrUser();
    if (currUser === null){
        alert("Morate se ulogovati na /login.");
        window.location.href = 'http://127.0.0.1:8000/login';
        return;
    }
    console.log(JSON.stringify(currUser));
    console.log("Izvlacenje id-a: "+currUser.usersId);
    document.getElementById('welcome').innerHTML += `<b> ${currUser.username} </b>`;
    /*if (currUser == 'no user'){
        window.location.href = 'http://127.0.0.1:8000/login';
        return;
    }*/
    
   /* if (currUser.admin == false){
        document.getElementById('usersBtn').style.background = "rgba(255,0,0,0.8)";
        document.getElementById('usersBtn').disabled = true;
        console.log("Disabled users button. Not admin.");
        document.getElementById('reviewsBtn').style.background = "rgba(255,0,0,0.8)";
        document.getElementById('reviewsBtn').disabled = true;
        console.log("Disabled reviews button. Not admin.");
    } */

    document.getElementById('usersBtn').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = "http://127.0.0.1:8000/admin/users";
    });
    document.getElementById('reviewsBtn').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = "http://127.0.0.1:8000/admin/reviews"
    });
    document.getElementById('gamesBtn').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = "http://127.0.0.1:8000/admin/games";
    });
    document.getElementById('cartBtn').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = "http://127.0.0.1:8000/admin/cart";
    });
    document.getElementById('wishlistBtn').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = "http://127.0.0.1:8000/admin/wishlist";
    });
    document.getElementById('categoriesBtn').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = "http://127.0.0.1:8000/admin/categories";
    });
    document.getElementById('publishersBtn').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = "http://127.0.0.1:8000/admin/publishers";
    });
    document.getElementById('logoutBtn').addEventListener('click', e => {
        e.preventDefault();
        console.log("User logged out.");
        let currCartId = 0;
        let foundCart = false;
        fetch('http://127.0.0.1:8090/admin/cart', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                data.forEach( el => {
                    console.log("Trenutni id korisnika: "+currUser.usersId);
                    console.log("Postoji korpa za: "+el.user_cart);
                    if (el.user_cart == currUser.usersId){
                        currCartId = el.id;
                        foundCart = true;
                        console.log("Naso korpu za brisanje.");
                        deleteUsersCart(el.id);
                    }
                })
            })
            document.cookie='token=;SameSite=Lax;'
        window.location.href = '/login';
    });
}

function getCurrUser(){
    let token = document.cookie.split(';')[0].split('=')[1];
    console.log(token);
    if(token === ''){
        console.log("uso");
        return null;
    }
    let payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}

function deleteUsersCart(cartID){
    fetch('http://127.0.0.1:8090/admin/cart/'+cartID, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json());
}