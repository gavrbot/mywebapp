import React, {useCallback, useEffect, useState} from "react";
import useForm from "../useForm";
import  { Container, Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreditCardForm.css";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import QRCode from "qrcode.react";
import rsa from 'js-crypto-rsa';
import {UInt32, UTF32Char} from "utf32char";


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
    const [secretRSAKey, setSecretRSAKey] = useState()
    const [publicRSAKey, setPublicRSAKey] = useState()

    const onHandleSubmit = useCallback(() => {

        rsa.generateKey(2048).then( (key) => {
            const publicKey = key.publicKey
            publicKey.n = "m6aT_g3ZQMPOpXGMmBmZzXWQ938-gY9clNDmD6bOagXNNrItX6gzlFfnn_Au1J64sYGe3RB-CcfyWw1kKLLEkqIaeKMZAoL7Nffm_GGwFJzncMwuMSi8ZVuD1-Fgb2FDAIEGKgssbf2XUo-L25ytJiPYo0qBFoUPEYpHKnP4Ws7NN-Qswl1Vz3zoXWw6RYu7L6UyJA_eF95ERtDXkPqRCYjNUYVbfoAJrLK_iYjFX1cJ1zQwBotjum-Wt_lgvHkRfwX75_4_cTJcdsSsdmuG4roTQqrTWpfwhd1pNgsTNPShAHKlccXoS_M6l-f2dXd5ca7dE7Hv5quj62QCLbelsQ"
            const privateKey = key.privateKey;
            privateKey.d = "AXFm3yCeR79RnNjEGaoRzAhqjlZz-gBf3KWmKVSbM4yIDtQhjgqM1DA1hKTEhS_EzlmNfwwhm4l_blYR4Lg5ttfp4NtZk3cyGK5rc56OK43-cvZV8hpmXBLXf5Op6CAphHnXQHbowavaV2P6seSRFYE3ySWzWaNkvxJJiaNuyLFdigmKi4MBproGFJnPM_GDTa8_O-ydARHREggwOgbeU0TDIB8wU4QYS7CANyvMnCHQdLwuv7NNEJ_DYTKzfPdkrKI4JkGKdEGDhRqiZQkD0f0W0tuKlKJiauPTvP_Y_WDg2-L-iZe2ckX5EqZeIFJ3JPK7x2zOfICrU1EXxZwkQQ"
            privateKey.dp = "BEZowA-AwrJ6pOz0dxZzcMJcEtdUkoeMAAfOHuQOaKWR5I2MYByk6EKg2C1goCqTE8QpmGpe5xrzf26e20mhrCvTmiTbx-LDas1ZGtJwawUZR-ZxC1G50S5aK0Jj5obFwguE0lYp3anRGfnMGUbIvzZZMeaJ3wseIFxO_VGD_xs"
            privateKey.dq = "V0m4_V_EL5srghqw1zDJeYSgdpOgdWEGHtJxsb5uvQlIYXPzJ6pBKjRH9RUGGPrOpNE9yLUgewp0KEzhvv-pdyW4CYtT5z0AwPb6ueaKPx3QKDztoovUmX14mW9QcTCmbt9cySDlExZmnCNiKF2W-a4JZJixUcmWMQlMJZOZdHs"
            privateKey.n = "m6aT_g3ZQMPOpXGMmBmZzXWQ938-gY9clNDmD6bOagXNNrItX6gzlFfnn_Au1J64sYGe3RB-CcfyWw1kKLLEkqIaeKMZAoL7Nffm_GGwFJzncMwuMSi8ZVuD1-Fgb2FDAIEGKgssbf2XUo-L25ytJiPYo0qBFoUPEYpHKnP4Ws7NN-Qswl1Vz3zoXWw6RYu7L6UyJA_eF95ERtDXkPqRCYjNUYVbfoAJrLK_iYjFX1cJ1zQwBotjum-Wt_lgvHkRfwX75_4_cTJcdsSsdmuG4roTQqrTWpfwhd1pNgsTNPShAHKlccXoS_M6l-f2dXd5ca7dE7Hv5quj62QCLbelsQ"
            privateKey.p = "08Vf34qC2C95NYWXIacXpcpeRe54t3XxmWhTVupi0iLvMHXT0Pu_KL0Rw6vKHmsNatuxKfuccJaozksiO04qiCB2zZXymVtj9InA87ilJN1r-Pr1T61m7H1DEbd39CIcaLyi5hF0QoChub1zVw1bIzxB1oodVMAtkKDdraq6RE8"
            privateKey.q = "vCinuSRLvjc-_E4helFCv-ofxW4Ah9BWW0Nbkk1raYwzQG0Ht9VvMWFDalSVJ-Tq2omXa6Bj1OEmZOZcXmtcmp9A0jJzBmYJQxCX-b769BGtJTwlAshX87Cy-JTAJ1k1hfjw48xI4qJffWb9f0Cv4BzbUYRStRwZHUXWv47S9f8"
            privateKey.qi = "WnjrWwn-8JpXMQrBYrYdgTayup_Ir-J693-rDIqxchkW03VwLEEYxtY1Nh0R_gZTuC2aZ6nb8e8Q5vjcjDNSxMh-IXjBjTMYIJOGJg-2TolPl0TMQU2o0AvfL7fLX5l2RfbhjIJqiFBMwJ8QUuFCTKFbCoWFXE9W30Su2h0snr0"
            console.log(genPass)
            console.log(publicKey)
            console.log(privateKey)
            const bytePass = new TextEncoder().encode(genPass)


            rsa.encrypt(
                bytePass,
                publicKey,
            ).then( (encrypted) => {

                console.log(encrypted)
                console.log(encrypted.length)

               const str_enc = String.fromCharCode(...encrypted)

                setQrCodeValue(str_enc)

                // setQrCodeValue(str_enc+
                //     ' '+timeStamp+
                //     ' '+values.cardAmount+
                //     ' '+values.cardName.slice(0,values.cardName.indexOf(" "))+
                //     ' '+values.cardNumber.slice(0,4)+ values.cardNumber.slice(-4)+
                //     ' '+getOperationType(1))
                //     //' '+genPass)

                console.log(str_enc)
                console.log(str_enc.length)

                var bytes = new Uint8Array(256);
                for(var i = 0; i < str_enc.length; i++) {
                    var char = str_enc.charCodeAt(i);
                    bytes[i] = (char & 0xFF);
                }

                console.log(bytes)


                return rsa.decrypt(
                    encrypted,
                    privateKey,
                );
            }).then( (decrypted) => {
                console.log(decrypted)
                console.log(new TextDecoder().decode(decrypted))
            });
        })


        //setQrCodeValue(qrData)
        setShow(true)
        //setGenPass(makeid(6))
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
        if(numb === 1)
            return "bank_transfer"

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
