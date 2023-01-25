const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];
function init() { 
    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
    console.log(token);
    const usr = {
        email: null,
        password: null
    };
    const loggedInUser = getCurrUser();
    fetch('http://127.0.0.1:8090/admin/users', {
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
            //inputChange();
            const list = document.getElementById('usrLst');
            list.innerHTML += '<tr><th> UserID </th> <th> Username </th> <th> Email </th> <th> IsAdmin </th> <th> IsModerator </th> <th> Edit </th> </tr>';
            data.forEach( el => {
                list.innerHTML += 
                `<tr> <td> ${el.id}</a> </td> 
                <td> ${el.username} </td> 
                <td> Email is hidden. </td> 
                <td> ${el.admin} </td> 
                <td> ${el.moderator} </td>
                <td> <a href="/admin/users/${el.id}"> Edit user </a> </td>
                </tr>
                `;
            });
        });   

        let currUser = getCurrUser();
        

        document.getElementById('usrId').addEventListener('change', e =>{
            document.getElementById('deleteUser').addEventListener('click', e => {
                e.preventDefault();
                let forDelete = document.getElementById('usrId').value;
                fetch('http://127.0.0.1:8090/admin/users/'+forDelete, {
                    method: 'DELETE',
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
                    console.log("Successfully deleted a user.");
                    window.location.reload();
                })
            });
        });
        document.getElementById('createUser').addEventListener('click', e => {
            e.preventDefault();
            let isAdmin = false;
            let isMod = false;
            if (document.getElementById('newAdmin').checked){
                isAdmin = true;
            }
            if (document.getElementById('newModerator').checked){
                isMod = true;
            }
            const newUser = {
                username: document.getElementById('newName').value,
                password: document.getElementById('newPassword').value,
                email: document.getElementById('newEmail').value,
                admin: isAdmin,
                moderator: isMod
            }
            fetch('http://127.0.0.1:8090/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newUser)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.msg){
                        alert(data.msg);
                        return;
                    }
                    console.log("Successfully added a new user.");
                  //  window.location.reload();
                });
        });

        if (currUser.admin === false){
            document.getElementById('adminRemove').innerHTML = '';
            document.getElementById('adminCreate').innerHTML = '';
        }
        
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
