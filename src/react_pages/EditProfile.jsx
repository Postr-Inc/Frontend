import { api } from ".";

export default function EditProfile(){
     let [user, setUser] = useState(api.authStore.model)
     let [avatar, setAvatar] = useState(null)

     return <div className="p-5 flex flex-col gap-5">
       
    </div>
}
