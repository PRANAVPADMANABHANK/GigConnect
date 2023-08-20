import * as React from "react";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import Key from "@mui/icons-material/Key";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import newRequest from "../../utils/newRequest";
import { Alert } from "@mui/material";

export default function PasswordMeterInput() {
  const [value, setValue] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] =React.useState(false)
  const minLength = 12;

  const handleSendClick = async (e) => {
    e.preventDefault();
    console.log(value);
    try {
      const res = await newRequest.post("users/forgot-password", { value });
      console.log(res.data.message, "]]]]]]");
      if (res.data.message == "User found. Password recovery initiated.") {
        console.log("got");
        setShowAlert(true);
         // Hide the alert after 5 seconds
         setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }else{
        setShowErrorAlert(true)
        // Hide the alert after 5 seconds
        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      }
      //if the message is above then shows the notifier that the reset password link send successfully other wise shows try once again
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {showAlert && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Alert severity="success" style={{ width: 'fit-content', margin: '0 auto' }}>Reset Password Link Send Successfully !!</Alert>
        </div>
      )}
      {showErrorAlert && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Alert severity="error" style={{ width: 'fit-content', margin: '0 auto' }}>
            Error sending reset password link. Please try again.
          </Alert>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        <div style={{ maxWidth: "400px", width: "100%", marginBottom: "16px" }}>
          <Stack
            spacing={0.5}
            sx={{
              "--hue": Math.min(value.length * 10, 120),
            }}
          >
            <Input
              type="email"
              placeholder="Type your email…"
              startDecorator={<Key />}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              startDecorator={<MailIcon />}
              endDecorator={<Button onClick={handleSendClick}>Message</Button>}
              sx={{
                "--Input-radius": "8px",
                "--Input-gap": "8px",
              }}
            />
            <LinearProgress
              determinate
              size="sm"
              value={Math.min((value.length * 100) / minLength, 100)}
              sx={{
                bgcolor: "background.level3",
                color: "hsl(var(--hue) 80% 40%)",
              }}
            />
          </Stack>
        </div>
      </div>
    </>
  );
}
