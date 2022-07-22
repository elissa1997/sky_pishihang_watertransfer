import axios from 'axios';
// import { setDevSessionId } from "@/util/auth.js";

// 访问接口
export function instance_api(config) {
    const instance = axios.create({
        timeout: 8000,
        headers: { 'Content-Type':'application/json'}
    })


    instance.interceptors.request.use(config => {
        // setDevSessionId();
        return config
    },err => {
        console.log(err);
    })

    instance.interceptors.response.use(res => {
        return res.data
    },err => {
        console.log(err);
    })


    return instance(config)
}