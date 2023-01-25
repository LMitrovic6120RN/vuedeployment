const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];
const newPublisher = {};
const newCategory = {};
function init() {
    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
    console.log(token);
    fetch('http://127.0.0.1:8090/admin/games', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.msg){
                alert(data.msg);
                return;
            }
            const list = document.getElementById('gamesList');
            list.innerHTML += '<tr> <th> GamesID </th> <th> Title </th> <th> Year </th> <th> Price </th> <th> Details </th> <th> Add to wishlist </th> <th> Add to cart </th> <th> Review </th> <th> Moderator ONLY </th> </tr>';
            data.forEach( el => {
                list.innerHTML += 
                `<tr> <td> ${el.id} </td>
                 <td> ${el.title} </td>
                 <td> ${el.year} </td>
                 <td> ${el.price} </td> 
                 <td> <a href='/admin/games/${el.id}'>Details</a> </td>
                 <td> <button id='wishlistBtn_${el.id}' class='wishlistBtns' data-id='${el.id}' onclick='addToWL(this);'> Add to wishlist </button> </td>
                 <td> <button id='cartBtn_${el.id}' data-id='${el.id}' onclick='addToCart(this);'> Add to cart </button> </td>
                 <td> <button id='reviewBtn_${el.id}' data-id='${el.id}' onclick='reviewGame(this);'> Leave a review </button> </td>
                 <td> <button id='removeBtn_${el.id}' data-id='${el.id}' onclick='removeGame(this);'> Remove game </button> </td>
                 </tr>`
            });
            console.log("Added games to list");
        });
        let currUser = getCurrUser();
        if (currUser.moderator === false){
            document.getElementById('moderatorDiv').innerHTML = '';
        } else {
            document.getElementById('insertGame').addEventListener('click', e => {
                e.preventDefault();
                if (document.getElementById('publisher').value == ''){
                    alert("Game publisher not provided!");
                    return;
                } else if (document.getElementById('category').value == ''){
                    alert("Game category not provided!");
                    return;
                }
                let publisherName = document.getElementById('publisher').value;
                fetch('http://127.0.0.1:8090/admin/publishers/find/'+publisherName, {
                    headers: {'Authorization': `Bearer ${token}`}
                }).then(res=>res.json()).then(pubData => {
                    newPublisher.id = pubData.id;
                    let categoryType = document.getElementById('category').value;
                    fetch('http://127.0.0.1:8090/admin/categories/find/'+categoryType, {
                        headers: {'Authorization': `Bearer ${token}`}
                    }).then(res=>res.json()).then(ctgData => {
                        newCategory.id = ctgData.id;

                        const gameData = {
                            title: document.getElementById('title').value,
                            year: parseInt(document.getElementById('year').value),
                            price: parseFloat(document.getElementById('price').value),
                            info: document.getElementById('info').value,
                            publisher_game: newPublisher.id,
                            category_game: newCategory.id
                        }
                        console.log(JSON.stringify(gameData));
                        fetch('http://127.0.0.1:8090/admin/games', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(gameData)
                        }).then(res=>res.json()).then(createdData => {
                            if (createdData.msg){
                                alert(createdData.msg);
                                return;
                            }
                            alert("Successfully added a new game.");
                            window.location.reload();
                            return;
                        }).catch(err=> alert("Could not add game! "+ err));
                    }).catch(err=>alert("Could not find category! "+ err));
                }).catch(err=>alert("Could not find publisher! " + err));
            });
        }
}

let addToWL = button => {
    let currUser = getCurrUser();
    const wlData = {
        user_wishlist: currUser.usersId,
        game_wishlist: parseInt(button.getAttribute('data-id'), 10)
    };
    console.log("wlData: "+ JSON.stringify(wlData));
    fetch('http://127.0.0.1:8090/admin/wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(wlData)
    }).then(res=>res.json())
        .then(data => {
            if (data.msg){
                alert(data.msg);
                return;
            }
            alert("Added to your wishlist!");
        }).catch(err => res.json(err));
}

let addToCart = button => {
    //alert("Radi dugme");
    let currUser = getCurrUser();
    let game = parseInt(button.getAttribute('data-id'), 10);
    console.log("Pritisnut addtocart, :"+parseInt(currUser.usersId, 10));
    getCart(parseInt(currUser.usersId, 10), game);
}

function getCart(user, game){
    fetch('http://127.0.0.1:8090/admin/cart/user/'+user, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json())
        .then( data => {
            //alert("Pronadjen cart za user-a, id cart-a: "+data.id+ " gameId: "+game);
            createItem(user, game, data.id);
        }).catch(err=>alert(err));
}

function createItem(user, game, cart){
    var gamePrice = 0.0;
    fetch('http://127.0.0.1:8090/admin/games/'+game, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
        .then(data => {
            gamePrice = data.price;
            console.log("GamePrice setovan na: "+gamePrice);
            const itemData = {
                price: data.price,
                cart_item: cart,
                game_item: game
            };
            fetch('http://127.0.0.1:8090/admin/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(itemData)
            }).then(res => res.json())
                .then(data => {
                    //alert("Kreiran item");
                    fetch('http://127.0.0.1:8090/admin/cart/'+cart, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(res=>res.json())
                        .then(data=> {
                            const cartData = {
                                user_cart: user,
                                to_pay: data.to_pay+itemData.price
                            }
                            fetch('http://127.0.0.1:8090/admin/cart/'+cart, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(cartData)
                            }).then(res=>res.json())
                                .then(data=>{
                                    alert("Added to cart");
                                    return;
                                }).catch(err=>alert(err));
                        }).catch(err=>alert(err));
                }).catch(err => alert(err));
        }).catch(err=>alert(err));
    //nakon izvlacenja cene iz game-a!
    /*
    const itemData = {
        price: gamePrice,
        cart_item: cart,
        game_item: game
    };
    fetch('http://127.0.0.1:8090/admin/item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(itemData)
    }).then(res => res.json())
        .then(data => {
            alert("Kreiran item");
        }).catch(err => alert(err));
        */
}

let reviewGame = button => {
    let currUser = getCurrUser();
    let game = parseInt(button.getAttribute('data-id'), 10);
    window.location.href = 'http://127.0.0.1:8000/admin/reviews/'+game;
}

let removeGame = button => {
    let currUser = getCurrUser();
    if (currUser.moderator === false){
        alert("You do not have moderator permissions!");
        return;
    }
    let game = parseInt(button.getAttribute('data-id'), 10);
    fetch('http://127.0.0.1:8090/admin/games/'+game, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json()).then(data=> {
        if (data.msg){
            alert(data.msg);
            return;
        }
        alert("Game successfully removed.");
        window.location.reload();
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