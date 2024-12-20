import { Link, useNavigate } from "react-router-dom";
import Box from "../../components/Box/Box";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Layout from "../../components/Layout/Layout";
import Seperator from "../../components/Seperator/Seperator";
import classes from "./Signup.module.scss";

import { FormEvent, Fragment, useState } from 'react';
import { useAuthentication } from "../../context/AuthenticationContextProvider";

function Signup() {
    const [errorMessage, setErrorMessage] = useState("");
    const { signup } = useAuthentication();
    const navigate = useNavigate();

    const doSignup = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        try {
            await signup(email, password);
            navigate("/verify-email")
        } catch(err) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage("An unknown error occurred.")
            }
        }
    };

    return (
        <Layout className={classes.root}>
            <Box>
                <Fragment>
                    <h1>Sign up</h1>
                    <p>Make the most out of it</p>
                    <form onSubmit={doSignup}>
                        <Input key="email" type="email" id="email" name="email" label="Email" onFocus={() => setErrorMessage("")} />
                        <Input key="password" type="password" id="password" name="password" label="Password" />
                        {errorMessage ? <p className={classes.error}>{errorMessage}</p> : null}
                        <p className={classes.disclaimer}>
                            By clicking Agree & Join or Continue, you agree to LinkedIn's{" "}
                            <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and{" "}
                            <a href="">Cookie Policy</a>
                        </p>
                        <Button type="submit" outline={false}>Agree & Join</Button>
                    </form>
                    <Seperator>Or</Seperator>
                    <div className={classes.register}>
                        Already on LinkedIn? <Link to="/login">Sign in</Link>
                    </div>
                </Fragment>
            </Box>
        </Layout>
    );
}

export default Signup;