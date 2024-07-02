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
    }).catch(err=>{
        console.log(err)
    })
}