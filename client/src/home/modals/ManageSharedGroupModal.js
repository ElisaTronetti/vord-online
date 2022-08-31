import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useContext } from 'react'
import { Modal, Container, Col, Row } from 'react-bootstrap'
import { DefaultButton } from '../../commonComponents/buttons/Buttons'
import { createErrorToast } from '../../commonComponents/toast/Toast'
import { getSharedGroup, manageSharedGroup } from '../requests/sharingRequests'
import { SocketContext } from '../../util/socketContext'

import ManageSharedGroupUserData from './utils/ManageSharedGroupUserData'
import ManageSharedGroupOwner from './utils/ManageSharedGroupOwner'
import ManageSharedGroupNonOwner from './utils/ManageSharedGroupNonOwner'

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
            getSharedGroup(props.document[0].id, user.id, user.token, setSharedGroupData)
        }
    }, [props.document, user.id, user.token])

    const resetInputFields = () => {
        setInputFields(newUsersInitialState)
        setSharedGroupData(oldSharedGroupInitialState)
    }

    const dispatch = useDispatch()
    const socket = useContext(SocketContext)

    function modifySharedGroup() {
        const areNewUsersEmpty = inputFields.length > 0 && Object.values(inputFields).every(x => (x.email === '' || x.role === ''))
        const areOldRolesEmpty = Object.values(sharedGroupData.sharedGroup).every(x => x.role === '')
        if (!areNewUsersEmpty && !areOldRolesEmpty) {
            let alreadyPresentSharedGroup = sharedGroupData.user.concat(sharedGroupData.sharedGroup)
            manageSharedGroup(user, alreadyPresentSharedGroup, inputFields, props.document[0], props, resetInputFields, dispatch, socket)
        } else {
            createErrorToast('Insert all the required data')
        }
    }

    function updateData(inputFields, sharedGroupData) {
        setInputFields(inputFields)
        setSharedGroupData(sharedGroupData)
    }

    return (
        <Modal
            show={props.show}
            onHide={() => { props.onHide(); resetInputFields() }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Manage shared group:</Modal.Title>
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
                            {
                                sharedGroupData.user.length > 0 && sharedGroupData.user[0].role !== 3 && (
                                    <ManageSharedGroupNonOwner sharedGroup={sharedGroupData.sharedGroup}></ManageSharedGroupNonOwner>
                                )
                            }
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <DefaultButton onClick={modifySharedGroup} text={"Modify"}/>
            </Modal.Footer>
        </Modal>
    )
}