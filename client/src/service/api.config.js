import axios from'axios'
class Api{
    constructor(){
        this.api = axios.create({
            baseURL :'http://localhost:3000/'
        })
        this.api.interceptors.request.use((config)=>{
            const token = localStorage.getItem('token')
            if(token){
                config.headers = {
                    Authorization: `Bearer ${token}`
                }
            }
            return config
        },(error)=>{
            console.log(error)
        })
        this.api.interceptors.response.use((response)=> response,
        (error)=>{
            if(error.response.status === 401){
                localStorage.removeItem('token')
                window.location = '/'
            }
            throw error
        }
        )
    }
    signup = async(signupInfo)=>{
      const data = await this.api.post('/signup',signupInfo)
      return data
    }
    login = async(loginInfo) => {
      try {
        const {data} = await this.api.post('/login', loginInfo)
        localStorage.setItem('token', data.token)
        return data
      } catch (error) {
        throw error.response.data.message
      }
    }
}
export default new Api()