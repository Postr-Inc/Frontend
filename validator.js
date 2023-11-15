import Pocketbase from 'pocketbase'
import express from 'express'
const app = express()
import cors from 'cors'
app.use(cors())
let pb =  new Pocketbase('https://bird-meet-rationally.ngrok-free.app/')
pb.autoCancellation(false)

let auth = pb.admins.authWithPassword('admin@postr.com', 'asapy67890')


app.get('/', (req, res)=>{
  res.send(`working`)
})

app.get('/validate/:username/:email', (req, r)=>{
  let email = req.params.email
  let username = req.params.username
  if(!email || !username){
    r.send({
      error: true,
      message: 'email and username are required'
    })
    return;
  }
  auth.then(async ()=>{
     let res = pb.collection('users').getList(1,1, {
      filter:`email="${email}" || username="${username}"`
     })
 
     res.then((data)=>{
      console.log(data)
      let message = {
        email: false,
        username: false
      }
      if(data.items.length > 0){
        data.items.forEach((d)=>{
           
        
          if(d.email === email){
            message.email = true
          }
          if(d.username.toLowerCase() === username.toString().toLowerCase()){
            message.username = true
          }
        })
      }

    
      r.json(message)
        
     })

  })

})
app.listen(4000, ()=>{
  console.log(`working`)
})
auth.then(()=>{
  console.log(`working`)
})

