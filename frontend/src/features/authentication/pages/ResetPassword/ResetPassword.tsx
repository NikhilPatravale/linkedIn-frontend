import { Fragment } from "react/jsx-runtime";
import Layout from "../../components/Layout/Layout";
import classes from "./ResetPassword.module.scss";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Box from "../../components/Box/Box";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";

function ResetPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const sendPasswordResetRequest = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const email = event.currentTarget.email.value;
        try {
            await fetch(import.meta.env.VITE_API_URL + `/api/v1/authentication/send-password-reset-token?email=${email}`, {
                method: "PUT"
            });
            setIsSubmitted(true);
            setEmail(email);
        } catch(err) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }

    }

    const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const code = event.currentTarget.verficationCode?.value;
        const newPassword = event.currentTarget.newPassword?.value;

        try {
            const resp = await fetch(import.meta.env.VITE_API_URL + "/api/v1/authentication/reset-password", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    token: code,
                    newPassword,
                }),
            })

            if (!resp.ok) {
                const { message } = await resp.json();
                setErrorMessage(message);
            } else {
                navigate("/login");
            }
        } catch(err) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }

    };

    const clearError = () => {
        if (errorMessage) setErrorMessage("");
        return;
    }

    return (
        <Layout className={classes.root}>
            <Box>
                <Fragment>
                    <h1>Reset Password</h1>
                    {isSubmitted
                        ?
                            <Fragment>
                                <p>Enter the verification code we sent to your email and your new password</p>
                                <form onSubmit={resetPassword}>
                                    <Input key="verficationCode" type="input" name="verficationCode" id="verificationCode" onFocus={clearError} label="Verification code" />
                                    <Input key="newPassword" type="password" name="newPassword" id="newPassword" onFocus={clearError} label="New Password" />
                                    {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
                                    <Button outline={false} type="submit">Reset Password</Button>
                                    <Button outline={true} onClick={() => {
                                        setIsSubmitted(false);
                                        clearError();
                                    }}>
                                        Back
                                    </Button>
                                </form>
                            </Fragment>
                        :
                            <Fragment>
                                <p>Enter your email and we'll send a verification code if it matches an existing LinkedIn account</p>
                                <form onSubmit={sendPasswordResetRequest}>
                                    <Input key="email" type="email" name="email" id="email" label="Email" />
                                    {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
                                    <Button outline={false} type="submit">Next</Button>
                                    <Button outline={true} type="button" onClick={() => navigate("/login")}>
                                        Back
                                    </Button>
                                </form>
                            </Fragment>
                        }
                </Fragment>
            </Box>
        </Layout>
    );
}

export default ResetPassword;