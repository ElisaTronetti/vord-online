import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { createErrorToast } from '../../commonComponents/Toast'
import { getSharedGroup, manageSharedGroup } from '../requests/sharingRequests'
import ManageSharedGroupUserData from './utils/ManageSharedGroupUserData'
import ManageSharedGroupOwner from './utils/ManageSharedGroupOwner'
import { isPlainObject } from 'jquery'

export default function ManageSharedGroupModal(props) {
    const newUsersInitialState = []
    const oldSharedGroupInitialState = {
        user: [],
        sharedGroup: []
    }
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token),
        email: useSelector(state => state.userData.email)
    }

    const [inputFields, setInputFields] = useState(newUsersInitialState)
    const [sharedGroupData, setSharedGroupData] = useState(oldSharedGroupInitialState)

    useEffect(() => {
        if (props.document !== undefined) {
            getSharedGroup(props.document[0].id, user.id, setSharedGroupData)
        }
    }, [props.document, user.id])

    const resetInputFields = () => {
        setInputFields(newUsersInitialState)
        setSharedGroupData(oldSharedGroupInitialState)
    }

    const dispatch = useDispatch()

    function modifySharedGroup() {
        console.log(inputFields)
        console.log(sharedGroupData)
        const areNewUsersEmpty = inputFields.length > 0 && Object.values(inputFields).every(x => (x.email === '' || x.role === ''))
        const areOldRolesEmpty = Object.values(sharedGroupData.sharedGroup).every(x => x.role === '')
        if (!areNewUsersEmpty && !areOldRolesEmpty) {
            let fullShareGroup = sharedGroupData.user.concat(sharedGroupData.sharedGroup).concat(inputFields)
            manageSharedGroup(user, fullShareGroup, props.document[0], props, resetInputFields, dispatch)
        } else {
            createErrorToast('Insert all the required data')
        }
    }

    function updateData(inputFields, sharedGroupData){
        setInputFields(inputFields)
        setSharedGroupData(sharedGroupData)
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Handle shared group:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col className='sm-8'>
                            {
                                sharedGroupData.user.length > 0 && (
                                    <ManageSharedGroupUserData user={sharedGroupData.user}></ManageSharedGroupUserData>
                                )
                            }
                            {
                                sharedGroupData.user.length > 0 && sharedGroupData.user[0].role === 3 && (
                                    <ManageSharedGroupOwner inputFields={inputFields} sharedGroupData={sharedGroupData} updateData={updateData}></ManageSharedGroupOwner>
                                )
                            }

                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={modifySharedGroup}>Modify</Button>
            </Modal.Footer>
        </Modal>
    )
}