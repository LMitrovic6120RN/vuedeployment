const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];
const gameTitle = {};
const username = {};

function init() {

    const list = document.getElementById('revList');
    list.innerHTML+= `<tr> <th> Text </th> <th> Rating </th> <th> Game </th> <th> User </th> <th> Moderator ONLY </th> </tr>`;
    
    fetch('http://127.0.0.1:8090/admin/reviews', {
        headers: {'Authorization': `Bearer ${token}`}
    }).then(res=>res.json()).then(revData=> {
        revData.forEach(review => {
            //let gameTitle;
            fetch('http://127.0.0.1:8090/admin/games/'+review.game_review, {
                headers: {'Authorization': `Bearer ${token}`}
            }).then(res=>res.json()).then(gameData=> {
                gameTitle.title = gameData.title;
                //console.log(gameTitle);
                fetch('http://127.0.0.1:8090/admin/users/'+review.user_review, {
                headers: {'Authorization': `Bearer ${token}`}
            }).then(res=>res.json()).then(userData => {
                username.name = userData.username;
                console.log(gameTitle.title);
                list.innerHTML += `
                <tr>
                <td> ${review.text} </td>
                <td> ${review.rating} </td>
                <td> ${gameTitle.title} </td> 
                <td> ${username.name} </td>
                <td> <button id='removeBtn_${review.id}' data-id='${review.id}' onclick='removeReview(this);'> Remove review </button> </td>
                </tr>
                `;
            });
            
            });
            //let username;
            
        });
    }).catch(err=>alert(err));
}   

let removeReview = button => {
    let currUser = getCurrUser();
    if (currUser.moderator === false){
        alert("You do not have moderator permissions!");
        return;
    }
    let rev = parseInt(button.getAttribute('data-id'), 10);
    fetch('http://127.0.0.1:8090/admin/reviews/'+rev, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json()).then(data=> {
        if (data.msg){
            alert(data.msg);
            return;
        }
        alert("Review successfully removed.");
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