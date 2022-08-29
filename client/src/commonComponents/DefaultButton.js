import Button from 'react-bootstrap/Button'

import './Button.css'

export default function DefaultButton(props) {
    return (
        <Button className="default-button" onClick={props.onClick}>{props.text}</Button>
    )
}