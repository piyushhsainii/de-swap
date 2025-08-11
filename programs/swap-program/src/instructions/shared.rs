
use anchor_lang::prelude::*;
use anchor_spl::{token_interface::{Mint, TokenAccount, TransferChecked, transfer_checked}, token_interface::TokenInterface};

pub fn transfer_tokns<'info> (
    from:&InterfaceAccount<'info,TokenAccount>,
    to: &InterfaceAccount<'info, TokenAccount>,
    authority:&Signer<'info>,
    amount:u64,
    token_program:&Interface<'info, TokenInterface>,
    mint:&InterfaceAccount<'info,Mint>
)-> Result<()>{

    let cpi_context = CpiContext::new(token_program.to_account_info(), TransferChecked {
        from:from.to_account_info(),
        to:to.to_account_info(),
        authority:authority.to_account_info(),
        mint:mint.to_account_info()
    });
    transfer_checked(cpi_context,amount,mint.decimals)?;
    Ok(())  
} 