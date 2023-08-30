import createError from "../../utils/createError.js"
import userModel from "../../core/entities/user.model.js"
import Wallet from "../../core/entities/wallet.model.js"


export const getWalletAmount = async (req, res, next) => {
    const walletId = req.params.id;
  
    try {
      // Find the wallet document by ID
      const wallet = await Wallet.findById(walletId);
  
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
  
      const balance = wallet.balance;
  
      return res.status(200).json({ balance });
    } catch (error) {
      next(createError(error));
    }
  };