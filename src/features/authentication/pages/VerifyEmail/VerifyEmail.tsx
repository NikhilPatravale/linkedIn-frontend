import { Fragment } from "react/jsx-runtime";
import classes from "./VerifyEmail.module.scss";
import Box from "../../components/Box/Box";
import Input from "../../components/Input/Input";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { useAuthentication } from "../../context/AuthenticationContextProvider";
import request from "../../../../utils/api";
import { PUT } from "../../constants/apiConstants";

function VerifyEmail() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useAuthentication() || {};
  const navigate = useNavigate();

  const sendVerificationToken = async () => {
    await request<String>({
      endPoint: "/api/v1/authentication/send-email-verification-token",
      httpMethod: PUT,
      onSuccess: () => setMessage("Verification token sent"),
      onFailure: (error) => setErrorMessage(error),
    });
  };

  const verifyEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const verificationCode = event.currentTarget.code.value;
    await request<String>({
      endPoint: `/api/v1/authentication/validate-email-verification-token?token=${verificationCode}`,
      httpMethod: PUT,
      onSuccess: () => {
        if(setUser) setUser(null);
        navigate("/");
      },
      onFailure: (error) => setErrorMessage(error),
    });
  };

  return (
    <div className={classes.root}>
      <Box>
        <Fragment>
          <h1>Verify your email</h1>
          <form onSubmit={verifyEmail}>
            <p>Onlye one step left to complete your registration. Verify your email address.</p>
            <Input
              type="text" 
              id="verification-code"
              label="Verification code"
              key="code"
              name="code" onFocus={() => {
                setMessage("");
                setErrorMessage("");
              }}
              floatingInput
            />
            {message ? <p className={classes.message}>{message}</p> : null}
            {errorMessage ? <p className={classes.errorMessage}>{errorMessage}</p> : null}
            <Button type="submit" outline={false} >Validate email</Button>
            <Button type="button" outline={true} onClick={() => {
              setErrorMessage("");
              sendVerificationToken();
            }}>Send again</Button>
          </form>
        </Fragment>
      </Box>
    </div>
  );
}

export default VerifyEmail;
