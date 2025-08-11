use anchor_lang::prelude::*;
use anchor_lang::prelude::{ Accounts, Signer, InterfaceAccount,Program, Account ,System, Context, Result ,Interface };
use anchor_spl::token::{close_account, transfer_checked, CloseAccount, TransferChecked};
use anchor_spl::{token_interface::{TokenAccount,Mint,TokenInterface}, associated_token::AssociatedToken};
use crate::transfer_tokns;
use crate::{state::Offer, ANCHOR_DISCRIMINATOR};

#[derive(Accounts)]
#[instruction(maker:Pubkey,id:u64)]
pub struct TakeOffer<'info> {
    #[account(mut)]
    pub taker:Signer<'info>,
    #[account(mut)]
    pub maker:SystemAccount<'info>,
    pub token_mint_a:InterfaceAccount<'info, Mint>,
    pub token_mint_b:InterfaceAccount<'info, Mint>,
    #[account(
        init_if_needed,                                                          // if needed constraint because the taker might not have any token a while receiving it
        payer=taker,
        associated_token::authority = taker,
        associated_token::mint = token_mint_a,
        associated_token::token_program = token_program
    )]
    pub taker_token_account_a:InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = token_mint_b,
        associated_token::authority = taker,
    )]
    pub taker_token_account_b:InterfaceAccount<'info,TokenAccount>,
    #[account(
        init_if_needed,
        payer=maker,
        associated_token::mint = token_mint_b,
        associated_token::authority = maker,
        associated_token::token_program = token_program
    )]
    pub maker_token_account_b:InterfaceAccount<'info,TokenAccount>,
    #[account(
        mut,
        close = maker,
        has_one=maker,
        has_one = token_mint_a,
        has_one = token_mint_b,
        seeds = [b"offer", maker.key().as_ref(), id.to_le_bytes().as_ref()],
        bump = offer.bump

    )]
    pub offer: Account<'info,Offer>,
    #[account(
        mut,
        associated_token::mint = token_mint_a,
        associated_token::authority = offer,
        associated_token::token_program = token_program
    )]
    pub vault:InterfaceAccount<'info,TokenAccount>,
    pub system_program:Program<'info,System>,
    pub token_program:Interface<'info, TokenInterface>,
    pub associated_token_program:Program<'info, AssociatedToken>


} 

pub fn send_wanted_tokens_to_taker(ctx:Context<TakeOffer>)-> Result<()>{

transfer_tokns(
    &ctx.accounts.vault, 
    &ctx.accounts.taker_token_account_a, 
    &ctx.accounts.taker, 
    ctx.accounts.vault.amount,
       &ctx.accounts.token_program, 
     &ctx.accounts.token_mint_a)?;

Ok(())
}
pub fn send_tokens_to_maker(ctx:Context<TakeOffer>)-> Result<()>{
    
    transfer_tokns(
        &ctx.accounts.taker_token_account_b, 
        &ctx.accounts.maker_token_account_b, 
        &ctx.accounts.taker,
         ctx.accounts.offer.tokens_wanted_b,
          &ctx.accounts.token_program,
           &ctx.accounts.token_mint_b)?;
    Ok(())
}

pub fn withdraw_and_close_vault(ctx:Context<TakeOffer>, id:u64)->Result<()> {
    
    let seeds = &[b"offer" + ctx.accounts.maker.key().as_ref() + id.to_le_bytes() ];
    let signer_seeds = &[seeds[..]];
    let cpi_context = CpiContext::new_with_signer(ctx.accounts.token_program, TransferChecked {
        authority:ctx.accounts.offer,
        from:ctx.accounts.vault,
        to:ctx.accounts.taker_token_account_a,
        mint:ctx.accounts.token_mint_a,
    }, signer_seeds);
    transfer_checked(cpi_context, ctx.accounts.vault.amount, ctx.accounts.token_mint_a.decimals)?;

    // close the account
    let accounts = CloseAccount {
        account:ctx.accounts.vault,
        authority:ctx.accounts.offer,
        destination:ctx.accounts.maker
    };
    close_account(accounts);
    Ok(())
}
