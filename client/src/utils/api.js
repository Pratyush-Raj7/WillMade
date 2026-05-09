import axios from 'axios'

const API = axios.create({
  baseURL: 'https://willmade.onrender.com/api',
  timeout: 60000,
})

export default API
