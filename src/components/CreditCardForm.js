import React, {useCallback, useEffect, useState} from "react";
import useForm from "../useForm";
import  { Container, Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreditCardForm.css";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import QRCode from "qrcode.react";
import {JSEncrypt} from "jsencrypt";

const makeid = (length) => {
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

const CreditCardForm = () => {
    const { handleChange, handleFocus, handleSubmit, values, errors } = useForm();
    const [ qrCodeValue, setQrCodeValue ] = useState('')
    const [pass, setPass] = useState('')
    const [timer, setTimer] = useState(undefined)
    const [genPass, setGenPass] = useState(makeid(6))

    const onHandleSubmit = useCallback(() => {

        let publicCheckKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBO71iVLEu7umehJ0HJ5501wW1rSKTL3hkng+WRJZCnQ/3ZWLJrdLdgRRkaQMpzdF+AmqvtioluXjZdyrhLpkRtcAkjgQbBnRnL5zirJydmYZJU8CRSjrrER439hHTD9Zml1y9Pa//NPcfnd9iw6kZSX5rArEzFiKp3hRZGgecYwIDAQAB"

        let privateCheckKey = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAME7vWJUsS7u6Z6EnQcnnnTXBbWtIpMveGSeD5ZElkKdD/dlYsmt0t2BFGRpAynN0X4Caq+2KiW5eNl3KuEumRG1wCSOBBsGdGcvnOKsnJ2ZhklTwJFKOusRHjf2EdMP1maXXL09r/809x+d32LDqRlJfmsCsTMWIqneFFkaB5xjAgMBAAECgYEAm4K/hI5SVkoyO7/QPDzXWoLd9ntTEw8mHhvSwYWLRCrw+ZJfsZ2x0VAboD+fKxqYGYhKYgUB4IBm0OUF3lnJF0CmzWYcPg7QpsNRU2iCp50c6EyGmNItpPQycnTx68xG1RTYE1EXfwAmHDeB9Bbsk87HHdJQqjANnUFeSDPq9/ECQQDelkKO7rZA/KNKmQJZIqGEGWvlMb+5SuHCiVRLT3vqKuaub0Fym1Ey6ngVYN5yZt2tnUV6brfwr+/y3TyQlq0pAkEA3j11Ju32DsAzC4dtmDM4vee8KY7OpnE2dkEGA9K6U8M/R3y3WQEtUC8kqf+m9EXOdiMlB72Ld0N0TojQ+R6iqwJAMcDShdJz6JjQAyeqb7Qe+EEabfOt0EQdrHc34VGV+CS4xXrW3UA8aS4hw12Qu2+k017ZHeHLucAJ2XZ8SDF16QJAE+woe2Proeji6o6qaXF2Dbgfaw5NQih1/GXZ1y/l2ipvmsX4Xbc4S67eN4seeVlkp7yAzk/Ul81pOL0VFrADXwJBAI/2Oq2AcSNOu6QY3JuzU4kN1mjKGDkBqmV3nHev9bp7NLyoasqzg8xo9lvuYjPpo47JXPgpH+CXXkLTTmqk/m8=";

        var CryptoJS = require("crypto-js");

        let operationType = getOperationType(getRandomInt(1,5))

        var messageForSignature = values.cardName.slice(0,values.cardName.indexOf(" "))+
            values.cardNumber.slice(0,4)+ values.cardNumber.slice(-4)+
            timeStamp+
            values.cardAmount+
            operationType;

        var message = values.cardName.slice(0,values.cardName.indexOf(" "))+
            " "+values.cardNumber.slice(0,4)+ values.cardNumber.slice(-4)+
            " "+timeStamp+
            " "+values.cardAmount+
            " "+operationType;

        console.log("message: " + message)

        var sign = new JSEncrypt();
        sign.setPrivateKey(privateCheckKey);
        var signature = sign.sign(messageForSignature + genPass, CryptoJS.SHA256, "sha256");

        console.log("signature: " + signature)

        console.log(signature.length)

        var encrypt = new JSEncrypt()
        encrypt.setPublicKey(publicCheckKey)

        var encryptedPass = encrypt.encrypt(genPass)

        console.log("encrypted password: " + encryptedPass)
        console.log(encryptedPass.length)

        const qrCodeMessage = message + " " + encryptedPass + " " + signature

        console.log("qrcode message: " + qrCodeMessage)
        console.log(qrCodeMessage.length)

        setQrCodeValue(qrCodeMessage)

        setShow(true)
    }, [values, genPass])

    const onConfirmPassword = useCallback(() => {
        console.log(genPass)
        console.log(pass)
        if(pass === genPass){
            setTimer(new Date())
            console.log("Success")
            alert("success")
        }
        else
            setTimer(undefined)
            console.log("Password is not correct")
            alert("error")
    }, [pass,genPass, qrCodeValue, setTimer])

    const [show, setShow] = useState(false);

    const currentDate = new Date();

    const date = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear();

    const time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

    const timeStamp = date + "(" + time + ")";

    // eslint-disable-next-line no-unused-vars
    function getOperationType(numb) {
        switch (numb) {
            case 1:
                return "bank_transfer"
            case 2:
                return "P2P_transfer"
            case 3:
                return "system_transfer"
            case 4:
                return "shop_purchase"
            default:
                return "bank_transfer"
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }

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
