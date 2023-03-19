import {useState, useEffect} from 'react'

function useOriginGateway () {

    // returns the gateway an app was served from.

    const [gateway, setGateway] = useState("")

    useEffect(()=>{
       const urlFrags = window.location.host.split('.')
       const hostFrags = [urlFrags[-1], urlFrags[-2]] 
        setGateway(hostFrags.join('.'))
    },[window.location])

    return gateway
}

export default useOriginGateway