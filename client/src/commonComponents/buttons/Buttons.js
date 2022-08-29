import Button from 'react-bootstrap/Button'

import './Button.css'

export function DefaultButton(props) {
    return (
        <Button className="default-button" onClick={props.onClick}>{props.text}</Button>
    )
}

export function CancelButton(props) {
    return (
        <Button variant="default me-1" onClick={props.onClick}>{props.text}</Button>
    )
}

export function DeleteButton(props) {
    return (
        <Button variant="danger me-1" className="btn btn-danger" onClick={props.onClick}>{props.text}</Button>
    )
}

export function AddButton(props) {
    return (
        <Button className="btn btn-success" onClick={props.onClick}>{props.text}</Button>
    )
}