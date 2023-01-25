const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {
    const gameId= window.location.href.split('/');
    const id = gameId[gameId.length - 1];

    fetch('http://127.0.0.1:8090/admin/games/'+id, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(res=>res.json()).then(gameData=>{
        document.getElementById('title').value = gameData.title;
        document.getElementById('price').value = gameData.price;
        document.getElementById('info').value = gameData.info;
        //fetch za publisher-a
        fetch('http://127.0.0.1:8090/admin/publishers/'+gameData.publisher_game, {
            headers: {'Authorization': `Bearer ${token}`}
        }).then(res=>res.json()).then(pubData=>{
            document.getElementById('publisher').value = pubData.name;
        }).catch(err=>alert(err));
        //fetch za category
        fetch('http://127.0.0.1:8090/admin/categories/'+gameData.category_game, {
            headers: {'Authorization': `Bearer ${token}`}
        }).then(res=>res.json()).then(ctgData=> {
            document.getElementById('category').value = ctgData.type;
        }).catch(err=>alert(err));
        //fetch za reviews
        const list = document.getElementById('revList');
        list.innerHTML += `<tr> <th> Text </th> <th> Rating </th> <th> UserID </th>`;
        fetch('http://127.0.0.1:8090/admin/reviews/game/'+id, {
            headers: {'Authorization': `Bearer ${token}`}
        }).then(res=>res.json()).then(revData => {
            if (revData.msg){
                alert(revData.msg);
                return;
            }
            let avg = 0;
            let numOfRevs = 0;
            revData.forEach(review => {
                avg += review.rating;
                numOfRevs +=1;
                list.innerHTML += `
                <tr> <td> ${review.text} </td>
                <td> ${review.rating} </td> 
                <td> ${review.user_review} </td> </tr>
                `;
            });
            document.getElementById('average').value = (avg/numOfRevs).toFixed(2);
        }).catch(err=>alert(err));
    }).catch(err=>alert(err));
}