function init(){

    document.getElementById('registerBtn').addEventListener('click', e =>{
        e.preventDefault();

        const data = {
            username: document.getElementById('name').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            admin: document.getElementById('admin').checked,
            moderator: document.getElementById('moderator').checked
        };
        console.log(data);
        fetch('http://127.0.0.1:8080/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then((data) =>{
                if (data.msg){
                    alert(data.msg);
                    return;
                }
                console.log("Successfully registered");
                window.location.href = 'http://127.0.0.1:8000/login'
            })
            .catch((error) => {
                console.log("error: ", error);
            })
    
    });

}