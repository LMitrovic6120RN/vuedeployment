function init(){

    document.getElementById('loginBtn').addEventListener('click', e =>{
        e.preventDefault();

        const data = {
            username: document.getElementById('name').value,
            password: document.getElementById('password').value,
        };
        console.log(data);
        fetch('http://127.0.0.1:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then(el  =>{
                if (el.msg){
                    alert(el.msg);
                }
                else {
                    document.cookie = `token=${el.token};SameSite=Lax`;
                    let token = document.cookie.split(';')[0].split('=')[1];
                    let currUser = getCurrUser();
                    const cart = {
                        user_cart : currUser.usersId,
                        to_pay : 0.0
                    }
                    console.log(JSON.stringify(currUser));
                    fetch('http://127.0.0.1:8090/admin/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(cart)
                    })
                        .then(res => res.json())
                        .then( data => {
                            if (data.msg){
                                alert(data.msg);
                                return;
                            }
                            console.log("Created new cart for user with id: " +currUser.usersId);
                        })
                    
                    window.location.href = 'http://127.0.0.1:8000/admin';
                    //window.location.href = 'homepage.html';
                }
                //console.log("Successfully logged in");
               // window.location.href = 'http://localhost:8000/'
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