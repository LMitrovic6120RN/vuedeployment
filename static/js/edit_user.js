function init() {
    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];
    const usrId= window.location.href.split('/');
    const id = usrId[usrId.length - 1];
    let currUser = getCurrUser();
    if (currUser.admin === false){
        alert("You do not have permission do edit users!");
        window.location.href = '/admin/users';
        return;
    }
    console.log(token);
    console.log(id);
    fetch('http://127.0.0.1:8090/admin/users/'+id, {
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
            document.getElementById('userId').value = data.id;
            document.getElementById('name').value = data.username;
            document.getElementById('password').value = data.password;
            document.getElementById('email').value = data.email;
            document.getElementById('admin').checked = data.admin;
            document.getElementById('moderator').checked = data.moderator;
        });
    document.getElementById('editBtn').addEventListener('click', e=>{
        e.preventDefault();
        console.log("Dugme2");
        const userData = {
            id: document.getElementById('userId').value,
            username: document.getElementById('name').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            admin: document.getElementById('admin').checked,
            moderator: document.getElementById('moderator').checked
        }
        console.log(JSON.stringify(userData));

        fetch('http://127.0.0.1:8090/admin/users/'+id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        })
            .then(res => res.json())
            .then(data =>{
                if (data.msg){
                    alert(data.msg);
                    return;
                }
                console.log("Successfully updated info for user with id: "+ id);
                window.location.href = 'http://127.0.0.1:8000/admin/users';
            });
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