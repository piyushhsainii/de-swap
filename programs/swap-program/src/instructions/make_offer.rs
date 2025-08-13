use anchor_lang::prelude::*;
use anchor_lang::prelude::{  Signer, InterfaceAccount,Program, Account ,System, Context, Result ,Interface };
use anchor_spl::{token_interface::{TokenAccount,Mint,TokenInterface}, associated_token::AssociatedToken};
use crate::instructions::transfer_tokns;
use crate::ANCHOR_DISCRIMINATOR;
use crate::{state::Offer};

#[derive(Accounts)]
#[instruction(id:u64)]
pub struct MakeOffer<'info> {
    #[account(mut)]
    pub maker:Signer<'info>,
    #[account(
        mint::token_program=token_program
    )]
    pub token_a:InterfaceAccount<'info,Mint>,
   #[account(
        mint::token_program=token_program
    )]
    pub token_b:InterfaceAccount<'info,Mint>,
    #[account(
        mut,
        associated_token::mint=token_a,
        associated_token::authority = maker,
        associated_token::token_program=token_program
    )]
    pub maker_account_token_a:InterfaceAccount<'info, TokenAccount>,
    #[account(
        init,
        payer=maker,
        associated_token::authority = offer,                         //basically makes the offer the owner of the vault.
        associated_token::mint=token_a,
        associated_token::token_program=token_program
    )]
    pub vault:InterfaceAccount<'info,TokenAccount>,
        #[account(
        init,
        payer=maker,
        space=ANCHOR_DISCRIMINATOR + Offer::INIT_SPACE ,
        seeds=[b"offer", maker.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub offer:Account<'info,Offer>,
    pub system_program:Program<'info,System>,
    pub token_program:Interface<'info, TokenInterface>,
    pub associated_token_program:Program<'info, AssociatedToken>
}

pub fn send_offered_tokens_to_vault(ctx: &Context<MakeOffer>, amt:u64, id:u64) -> Result<()> {

    transfer_tokns(
        &ctx.accounts.maker_account_token_a,
            &ctx.accounts.vault,
            &ctx.accounts.maker,
            amt,
            &ctx.accounts.token_program,
            &ctx.accounts.token_a,
        )?;
    Ok(())
}

pub fn save_offer(ctx: Context<MakeOffer>, tokens_wanted_b: u64, id: u64) -> Result<()> {
    ctx.accounts.offer.set_inner(Offer {
        id,
        token_mint_a: ctx.accounts.token_a.key(),
        token_mint_b: ctx.accounts.token_b.key(),
        tokens_wanted_b,
        maker: ctx.accounts.maker.key(),
        bump: ctx.bumps.offer,
    });
    Ok(())
}

