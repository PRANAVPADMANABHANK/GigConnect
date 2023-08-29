import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

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
  const classes = useStyles();

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
              Available balance: $500
            </Typography>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Wallet;
