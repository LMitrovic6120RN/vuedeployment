const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {
    let currUser = getCurrUser();
    const list = document.getElementById('categoriesList');
    list.innerHTML += '<tr> <th> Category Type </th> <th> Games </th> </tr>';
    fetch('http://127.0.0.1:8090/admin/categories', {
        headers: {'Authorization': `Bearer ${token}`}
    }).then(res=>res.json()).then(ctgData => {
        ctgData.forEach(category => {
            list.innerHTML += `
            <tr>
            <td> ${category.type} </td>
            <td> <button id='cg_${category.id}' data-id='${category.id}' onclick='displayGames(this);'>View Games</button> </td> </tr>
            `;
        });
    }).catch(err=>alert(err));
    if (currUser.moderator === false){
        document.getElementById('moderatorDiv').innerHTML = '';
    } else {
        document.getElementById('insertCategory').addEventListener('click', e => {
            e.preventDefault();
            if (document.getElementById('type').value == ''){
                alert('You must insert a category type!');
                return;
            }
            const categoryData = {
                type: document.getElementById('type').value
            };
            fetch('http://127.0.0.1:8090/admin/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(categoryData)
            }).then(res=>res.json()).then(data=> {
                if (data.msg){
                    alert(data.msg);
                    return;
                }
                alert('New category added.');
               // window.location.reload(true);
            }).catch(err=>alert(err));
        });
    }
}

let displayGames = button => {
    let categoryID = parseInt(button.getAttribute('data-id'), 10);
    const gList = document.getElementById('gamesList');
    gList.innerHTML = '';
    gList.innerHTML+='<tr> <th> Game </th> <th> Price </th> </tr>';
    fetch('http://127.0.0.1:8090/admin/games/category/'+categoryID, {
        headers: {'Authorization': `Bearer ${token}`}
    }).then(res=>res.json()).then(gameData => {
        gameData.forEach(game => {
            gList.innerHTML += `
            <tr> <td> ${game.title} </td>
            <td> ${game.price} </td>
            `;
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