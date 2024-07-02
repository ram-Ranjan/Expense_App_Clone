function signup(req,res){
    console.log(req.body)
    res.status(201).send(JSON.stringify({message:"SignUp successfull"}))
}

module.exports={signup}