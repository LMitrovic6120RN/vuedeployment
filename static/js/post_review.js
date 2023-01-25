const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init(){
    let currUser = getCurrUser();
    const gameId= window.location.href.split('/');
    const id = gameId[gameId.length - 1];

    fetch('http://127.0.0.1:8090/admin/games/'+id, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json()).then(data=> {
        document.getElementById('gameTitle').value = data.title;
    }).catch(err=>alert(err));

    document.getElementById('postBtn').addEventListener('click', e => {
        e.preventDefault();
        const reviewData = {
            text: document.getElementById('text').value,
            rating: parseInt(document.getElementById('rating').value, 10),
            user_review: parseInt(currUser.usersId, 10),
            game_review: parseInt(id, 10)
        };
        fetch('http://127.0.0.1:8090/admin/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
        }).then(res=>res.json()).then(data=>{
            if (data.msg){
                alert(data.msg);
                return;
            }
            alert("Successfully added a review!");
            window.location.href = 'http://127.0.0.1:8000/admin/games';
        })
    });
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