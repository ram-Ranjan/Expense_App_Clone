function handle_signup(event){
    event.preventDefault()

    let user_details={
        username : event.target.username.value,
        email : event.target.email.value,
        password : event.target.password.value
    }
    fetch('http://localhost:3000/user/signup',{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(user_details)
    }).then(response=>{
        console.log(response)
        if(response.status == 403){
            let dynamic_div = document.getElementById('dynamic')
            dynamic_div.innerHTML = "Error: User Already Exists, Error Code: " + response.status
        }
    }).catch(err=>{
        console.log(err)
    })
}