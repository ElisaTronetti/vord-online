import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import { useDispatch, useSelector } from 'react-redux'

import { increment, setValue } from '../redux/counter/actions'

export default function Login() {
    const [reroute, setReroute] = useState(false)

    const dispatch = useDispatch() //for the actions use for redux
    let counterValue = useSelector(state => state.counter.value)

    if (reroute) {
        return <Link to={'/home'}><Navigate to={'/home'}/></Link>
    } else {
        return (
            <div>
                <p onClick={() => dispatch(increment())}>{counterValue}</p>
                <Button onClick={() => dispatch(setValue(42))}>Set 42</Button>
                <Button variant='danger' onClick={() => setReroute(true)}>login</Button>
            </div>
        )
    } 
}
