import React, {useCallback, useState} from "react";
import useForm from "../useForm";
import  { Container, Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreditCardForm.css";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import QRCode from "qrcode.react"


const CreditCardForm = () => {
    const { handleChange, handleFocus, handleSubmit, values, errors } = useForm();
    const [ qrCodeValue, setQrCodeValue ] = useState('')

    const onHandleSubmit = useCallback(() => {
        setQrCodeValue("I am Iron Man");
        setShow(true)
    }, [])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <div className="container">
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
                                    type="text"
                                    id="cardName"
                                    data-testid="cardName"
                                    name="cardName"
                                    placeholder="Cardholder Name"
                                    value={values.cardName}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    isValid={errors.cname}
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
                                    isValid={errors.cnumber}
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
                                    isValid={errors.cnumber}
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
                        keyboard={false}
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
                                    <Container>
                                        <Col xs={9} md={6}>
                                            <Form.Group>
                                                <QRCode value={qrCodeValue}/>
                                            </Form.Group>
                                        </Col>

                                        <Col xs={9} md={6}>
                                            <Form.Group>
                                                <Form.Label>Scan this QR code</Form.Label>
                                                <Form.Control type="password" placeholder="Password" />
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
                            <Button variant="primary">Confirm</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default CreditCardForm;
