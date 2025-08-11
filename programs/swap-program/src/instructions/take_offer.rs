use anchor_lang::prelude::*;
use anchor_lang::prelude::{ Accounts, Signer, InterfaceAccount,Program, Account ,System, Context, Result ,Interface };
use crate::transfer_tokns;
use crate::{state::Offer};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        close_account, transfer_checked, CloseAccount, Mint, TokenAccount, TokenInterface,
        TransferChecked,
    },
};


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

pub fn send_wanted_tokens_to_taker(ctx:&Context<TakeOffer>)-> Result<()>{

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

pub fn withdraw_and_close_vault(ctx:Context<TakeOffer>)->Result<()> {
    let maker_key = ctx.accounts.maker.to_account_info().key();
    let seeds = &[b"offer" ,maker_key.as_ref()  , &ctx.accounts.offer.id.to_le_bytes(), &[ctx.accounts.offer.bump] ];
    let signer_seeds = &[&seeds[..]];
    let cpi_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(), TransferChecked {
        authority:ctx.accounts.offer.to_account_info(),
        from:ctx.accounts.vault.to_account_info(),
        to:ctx.accounts.taker_token_account_a.to_account_info(),
        mint:ctx.accounts.token_mint_a.to_account_info(),
    }, signer_seeds);
    transfer_checked(cpi_context, ctx.accounts.vault.amount, ctx.accounts.token_mint_a.decimals)?;

    // close the account
       let cpi_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(), CloseAccount {
        authority:ctx.accounts.offer.to_account_info(),
        account:ctx.accounts.vault.to_account_info(),
        destination:ctx.accounts.taker.to_account_info()
    }, signer_seeds);

    close_account(cpi_context)?;

    Ok(())
}
