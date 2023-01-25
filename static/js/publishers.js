const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {
    let currUser = getCurrUser();
    const list = document.getElementById('publishersList');
    list.innerHTML += '<tr> <th> Publisher </th> <th> Games </th> </tr>';
    fetch('http://127.0.0.1:8090/admin/publishers', {
        headers: {'Authorization': `Bearer ${token}`}
    }).then(res=>res.json()).then(data => {
        data.forEach(pub => {
            list.innerHTML += `
            <tr>
            <td> ${pub.name} </td>
            <td> <button id='cg_${pub.id}' data-id='${pub.id}' onclick='displayGames(this);'>View Games</button> </td> </tr>
            `;
        });
    }).catch(err=>alert(err));

    if (currUser.moderator === false){
        document.getElementById('moderatorDiv').innerHTML = '';
    } else {
        document.getElementById('insertPublisher').addEventListener('click', e => {
            e.preventDefault();
            if (document.getElementById('name').value == ''){
                alert('You must insert a name for the publisher!');
                return;
            }
            const pubData = {
                name: document.getElementById('name').value
            };
            fetch('http://127.0.0.1:8090/admin/publishers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pubData)
            }).then(res=>res.json()).then(data=> {
                if (data.msg){
                    alert(data.msg);
                    return;
                }
                alert('New publisher added.');
               // window.location.reload(true);
            }).catch(err=>alert(err));
        });
    }
}

let displayGames = button => {
    let pubID = parseInt(button.getAttribute('data-id'), 10);
    const gList = document.getElementById('gamesList');
    gList.innerHTML = '';
    gList.innerHTML+='<tr> <th> Game </th> <th> Price </th> </tr>';
    fetch('http://127.0.0.1:8090/admin/games/publisher/'+pubID, {
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