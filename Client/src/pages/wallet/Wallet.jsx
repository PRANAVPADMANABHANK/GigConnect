import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import newRequest from '../../utils/newRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  box: {
    padding: theme.spacing(2),
    backgroundColor: 'black',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing(2),
    width: 400,
    height: 300,
    animation: '$fadeIn 0.5s ease-in-out', // Apply the fade-in animation
    transition: 'transform 0.2s ease-in-out', // Add transition for the hover effect
    '&:hover': {
      transform: 'scale(1.05)', // Increase size on hover
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Adjust the shadow on hover
    },
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  icon: {
    fontSize: 48,
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  // Define the fadeIn animation
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
}));

const Wallet = () => {
  const [walletAmount, setWalletAmount] = useState(0);
  const classes = useStyles();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  console.log(currentUser.wallet, "currentUser")
  const walletId = currentUser.wallet


  useEffect(() => {
    console.log("Fetching wallet balance...");
    const fetchWalletBalance = async () => {
      try {
        const response = await newRequest.get(`/wallets/wallet/${walletId}`);
        console.log("Wallet balance response:", response.data.balance);
        setWalletAmount(response.data.balance); // Update the state with fetched value
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };
    fetchWalletBalance();
  }, [walletId]);
  

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Paper className={classes.paper} elevation={3}>
          <div>
            <AccountBalanceWalletIcon className={classes.icon} />
          </div>
          <div>
            <Typography variant="h5" component="h2">
              My Wallet
            </Typography>
            <Typography color="textSecondary">
              Available balance: ${walletAmount}
            </Typography>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Wallet;
