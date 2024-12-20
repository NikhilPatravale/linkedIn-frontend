import { Fragment } from "react/jsx-runtime";
import Layout from "../../components/Layout/Layout";
import classes from "./VerifyEmail.module.scss";
import Box from "../../components/Box/Box";
import Input from "../../components/Input/Input";
import { FormEvent, useState } from "react";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const sendVerificationToken = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/send-email-verification-token", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            })
    
            if (resp.ok) {
                setMessage("Verification token sent");
            } else {
                setErrorMessage("Some error occurred while sending verificaiton code");
            }
        } catch(error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Something went wrong");
            }
        }
    };

    const verifyEmail = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const verificationCode = event.currentTarget.code.value;
        
        try {
            const resp = await fetch(import.meta.env.VITE_API_URL + `/api/v1/authentication/validate-email-verification-token?token=${verificationCode}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (resp.ok) {
                navigate("/");
            } else {
                const message = await resp.json();
                setErrorMessage(message);
            }
        } catch(error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Something went wrong");
            }
        }
    };

    return (
        <Layout className={classes.root}>
            <Box>
                <Fragment>
                    <h1>Verify your email</h1>
                    <form onSubmit={verifyEmail}>
                        <p>Onlye one step left to complete your registration. Verify your email address.</p>
                        <Input type="text" label="Verification code" key="code" name="code" onFocus={() => {
                            setMessage("");
                            setErrorMessage("");
                        }} />
                        {message ? <p className={classes.message}>{message}</p> : null}
                        {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
                        <Button type="submit" outline={false} >Validate email</Button>
                        <Button type="button" outline={true} onClick={sendVerificationToken}>Send again</Button>
                    </form>
                </Fragment>
            </Box>
        </Layout>
    );
}

export default VerifyEmail;
