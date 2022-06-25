import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default function Login() {
    const [reroute, setReroute] = useState(false)
    if (reroute) {
        return <Link to={'/home'}><Navigate to={'/home'}/></Link>
    } else {
        return (
            <Button variant='danger' onClick={() => setReroute(true)}>login</Button>
        )
    } 
}
