import React, {useCallback, useEffect, useRef, useState} from "react";
import useForm from "../useForm";
import  { Container, Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreditCardForm.css";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import QRCode from "qrcode.react";
import axios from "axios";

const INITIAL_COUNT = 60

const STATUS = {
    STARTED: 'Started',
    STOPPED: 'Stopped',
}

const CreditCardForm = () => {
    const { handleChange, handleFocus, handleSubmit, values, errors } = useForm();
    const [ qrCodeValue, setQrCodeValue ] = useState('')
    const [pass, setPass] = useState('')
    const [genPass, setGenPass] = useState('')
    const [show, setShow] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_COUNT)
    const [status, setStatus] = useState(STATUS.STOPPED)

    const secondsToDisplay = secondsRemaining % 60
    const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60
    const minutesToDisplay = minutesRemaining % 60


    const onHandleSubmit = useCallback(async () => {
        setGenPass(createOneTimePassword(6))

        const qrCodeMessageFromServer = await getQRCodeMessageFromServer(values)

        console.log("qrCodeData: " + qrCodeMessageFromServer)

        setQrCodeValue(qrCodeMessageFromServer)

        setShow(true)
    }, [values, genPass])

    const onConfirmPassword = useCallback(async () => {

        const isPasswordCorrect = await comparePasswords(pass)
        if(isPasswordCorrect){
            console.log("Success")
            alert("success")
        }
        else
            console.log("Password is not correct")
        alert("error")
    }, [pass,genPass, qrCodeValue])

    const handleStart = () => {
        setStatus(STATUS.STARTED)
    }
    const handleReset = () => {
        setStatus(STATUS.STOPPED)
        setSecondsRemaining(INITIAL_COUNT)
    }

    const handleClose = () => {
        setShow(false);
    }

    useInterval(
        () => {
            if (secondsRemaining > 0) {
                setSecondsRemaining(secondsRemaining - 1)
            } else {
                onHandleSubmit()
                setSecondsRemaining(INITIAL_COUNT)
            }
        },
        status === STATUS.STARTED ? 1000 : null,
    )

    return (
        <div>
            <div className="container main-container">
                <div className="box justify-content-center align-items-center">
                    <div className="formDiv">
                        <div className="creditCard">
                            <Cards
                                cvc={values.cardSecurityCode}
                                expiry={values.cardExpiration}
                                focused={values.focus}
                                name={values.cardName}
                                number={values.cardNumber}
                            />
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Control
                                    className="input"
                                    type="text"
                                    id="cardName"
                                    data-testid="cardName"
                                    name="cardName"
                                    placeholder="Cardholder Name"
                                    value={values.cardName}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    className="input"
                                    type="number"
                                    id="cardNumber"
                                    data-testid="cardNumber"
                                    name="cardNumber"
                                    placeholder="Card Number"
                                    value={values.cardNumber}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    className="input"
                                    type="number"
                                    id="cardAmount"
                                    name="cardAmount"
                                    placeholder="Amount"
                                    value={values.cardAmount}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                />
                            </Form.Group>
                            <Button
                                size={"block"}
                                data-testid="validateButton"
                                id="validateButton"
                                type="submit"
                                onClick={() => { onHandleSubmit(); handleStart()}}
                            >
                                Validate
                            </Button>
                        </Form>
                    </div>
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header>
                            <Modal.Title> Confirm your transaction</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Form>
                                <Form.Row>
                                    <Container className="modal-container">
                                        <Col>
                                            <Form.Group className="QR-from-group">
                                                <QRCode value={qrCodeValue}/>
                                            </Form.Group>
                                        </Col>

                                        <Col>
                                            <Form.Group>
                                                <div>
                                                    {twoDigits(minutesToDisplay)}:{twoDigits(secondsToDisplay)}
                                                </div>
                                                <Form.Label>Scan this QR code with your phone and
                                                enter generated password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Password"
                                                    value={pass}
                                                    onChange={event => setPass(event.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Container>
                                </Form.Row>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => { handleClose(); handleReset()}}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={onConfirmPassword}>
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

const createOneTimePassword = () => {
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

const twoDigits = (num) => String(num).padStart(2, '0')

async function getQRCodeMessageFromServer(values) {
    let cardNumber = values.cardNumber.slice(0,4)+ values.cardNumber.slice(-4)

    const options = {
        method: 'POST',
        url: 'http://localhost:8000/getQRCodeData',
        data: {
            amount: values.cardAmount,
            cardNumber: cardNumber
        }
    }

    try {
        const {data} = await axios.request(options)
        return data.qrCodeData
    } catch (e) {
    }
}

async function comparePasswords(pass) {
    const options = {
        method: 'POST',
        url: 'http://localhost:8000/checkPass',
        data: {
            pass: pass
        }
    }

    try {
        const {data} = await axios.request(options)
        return data.result
    } catch (e) {
    }
}

function useInterval(callback, delay) {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

export default CreditCardForm;
