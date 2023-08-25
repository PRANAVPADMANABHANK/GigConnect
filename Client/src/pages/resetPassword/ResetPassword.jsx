import * as React from "react";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import Key from "@mui/icons-material/Key";
import Button from "@mui/material/Button"; // Import the Button component from MUI
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Alert } from "@mui/material";

export default function PasswordMeterInput() {
  const [value, setValue] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);
  const minLength = 12;
  const { id, token } = useParams();
  const navigate = useNavigate();

  console.log(id, "id");
  console.log(token, "token");

  const handleSendClick = async (e) => {
    e.preventDefault();
    console.log(value);
    try {
      const res = await newRequest.post(`users/reset-password/${id}/${token}`, {
        value,
      });
      console.log(res.data, "]]]]]]]]]");

      // Give a notifier that password reset was successful
      if (res.data === "Password reset successful") {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false); // Hide the alert after a delay
          navigate("/login");
        }, 5000);
      } else {
        setShowErrorAlert(true);
        setTimeout(() => {
          setShowErrorAlert(false); // Hide the error alert after a delay
        }, 5000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {showAlert && (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Alert
            severity="success"
            style={{ width: "fit-content", margin: "0 auto" }}
          >
            Reset Password Link Send Successfully !!
          </Alert>
        </div>
      )}
      {showErrorAlert && (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Alert
            severity="error"
            style={{ width: "fit-content", margin: "0 auto" }}
          >
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
          height: "0vh",
        }}
      ></div>
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
          Reset Password
        </Typography>
        <div style={{ maxWidth: "400px", width: "100%", marginBottom: "16px" }}>
          <Stack
            spacing={0.5}
            sx={{
              "--hue": Math.min(value.length * 10, 120),
            }}
          >
            <Input
              type="password"
              placeholder="Enter new password…"
              startDecorator={<Key />}
              value={value}
              onChange={(event) => setValue(event.target.value)}
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
            <Typography
              level="body-xs"
              sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
            >
              {value.length < 3 && "Very weak"}
              {value.length >= 3 && value.length < 6 && "Weak"}
              {value.length >= 6 && value.length < 10 && "Strong"}
              {value.length >= 10 && "Very strong"}
            </Typography>
          </Stack>
        </div>
        <Button variant="contained" color="primary" onClick={handleSendClick}>
          Send
        </Button>
      </div>
    </>
  );
}
