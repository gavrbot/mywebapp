import React, {useCallback, useState} from "react";
import useForm from "../useForm";
import  { Container, Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreditCardForm.css";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import QRCode from "qrcode.react";


const CreditCardForm = () => {
    const { handleChange, handleFocus, handleSubmit, values, errors } = useForm();
    const [ qrCodeValue, setQrCodeValue ] = useState('')
    const [pass, setPass] = useState('')
    const [timer, setTimer] = useState(undefined)

    const onHandleSubmit = useCallback(() => {
        setQrCodeValue(timeStamp+
            ' '+values.cardAmount+
            ' '+values.cardName.slice(0,values.cardName.indexOf(" "))+
            ' '+values.cardNumber.slice(0,4)+ values.cardNumber.slice(-4)+
            ' '+getOperationType(1)+
            //' '+makeid(6))
            ' '+genPassword)
        setShow(true)
    }, [values])

    const onConfirmPassword = useCallback(() => {
        console.log(genPassword)
        console.log(pass)
        if(pass === "12345"){
            setTimer(new Date())
            console.log("Success")
            alert("success")
        }
        else
            setTimer(undefined)
            console.log("False")
            alert("error")
    }, [pass, qrCodeValue, setTimer])

    const [show, setShow] = useState(false);

    const currentDate = new Date();

    const date = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

    const time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

    const timeStamp = date + "(" + time + ")";

    // eslint-disable-next-line no-unused-vars
    function getOperationType(numb) {
        if(numb === 1)
            return "bank_transfer"

    }

    function makeid(length) {
        var result = [];
        var characters = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() *
                charactersLength)));
        }
        return result.join('');
    }

    const genPassword = makeid(6)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <div className="container main-container">
                <div className="box justify-content-center align-items-center">
                    <div className="formDiv">
                        {!!timer && <div>
                            {timer}
                        </div>}
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
                                onClick={onHandleSubmit}
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
                            <Button variant="secondary" onClick={handleClose}>
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

export default CreditCardForm;
