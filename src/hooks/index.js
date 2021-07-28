import {useState, useEffect, useRef, useCallback} from 'react'
import {Api} from '../api'

export function useInterval(cb, ms){
    const intervalRef = useRef();

    useEffect(function(){
        cb()
        
        if (ms) {
            clearInterval(intervalRef.current)
            intervalRef.current = setInterval(cb, ms)
        }

        return function(){
            clearInterval(intervalRef.current)
        }
    }, [cb, ms])
}

export function useCommentFeed(ms){
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const initiallyLoading = useRef(true);

    const getComments = useCallback(async() => {
        setLoading(true)
        
        try {
            const response = await Api.get('http://localhost:3001/getComments')
            setData(response.sort((a, b) => new Date(b.created) - new Date(a.created)));
        } catch (error) {
            console.log(error)
        }

        initiallyLoading.current = false;
        setLoading(false)
    }, [])

    useInterval(getComments, ms)

    return {
        data, 
        loading,
        initiallyLoading: initiallyLoading.current,
        refetch: getComments
    }
}