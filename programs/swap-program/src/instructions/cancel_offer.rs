use anchor_lang::prelude::*;
use anchor_spl::{ token_interface::{TokenAccount, TokenInterface, Mint}};
use crate::{instructions::transfer_tokns, state::Offer};


#[derive(Accounts)]
#[instruction(id:u64)]
pub struct CancelOffer<'info> {
    pub maker:Signer<'info>,
    #[account(
        mut,
        close = maker,
        seeds=[b"offer", maker.key().as_ref(), id.to_le_bytes().as_ref()],
        bump = offer.bump
    )]
    pub offer:Account<'info, Offer>,
     #[account(
        mut,
        associated_token::authority = offer,                      
        associated_token::mint=token_mint_a,
        associated_token::token_program=token_program
    )]
    pub maker_token_account_a:InterfaceAccount<'info,TokenAccount>,
       #[account(
        mut,
        associated_token::authority = offer,                         //basically makes the offer the owner of the vault.
        associated_token::mint=token_mint_a,
        associated_token::token_program=token_program
    )]
    pub vault:InterfaceAccount<'info,TokenAccount>,
    pub token_mint_a:InterfaceAccount<'info,Mint>,
    pub token_program:Interface<'info, TokenInterface>,

}

pub fn transfer_vault_back_to_maker(ctx:&Context<CancelOffer>)->Result<()>{
    // transfer the tokens from vault back to the maker
    transfer_tokns(
        &ctx.accounts.vault,
        &ctx.accounts.maker_token_account_a,
        &ctx.accounts.maker,
        ctx.accounts.vault.amount,
        &ctx.accounts.token_program,
        &ctx.accounts.token_mint_a
        )?;
    Ok(())
}

// close the account from chain
pub fn cancel_offer(ctx:Context<CancelOffer>)->Result<()>{
    Ok(())
}


