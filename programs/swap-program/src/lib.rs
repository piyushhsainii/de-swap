pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;

declare_id!("3qoDL1UNEAoT4WGnmPqKMe6RdgCy4Xkon6ffatquqLiZ");

#[program]
pub mod swap_program {
    use super::*;

    pub fn make_offer(ctx: Context<MakeOffer>, id:u64, amt:u64, tokens_wanted_b:u64) -> Result<()> {

        instructions::send_offered_tokens_to_vault(&ctx, amt, id)?;
        instructions::save_offer(ctx, tokens_wanted_b, id)?;
        Ok(())
    }
 pub fn take_offer(ctx: Context<TakeOffer>) -> Result<()> {
    instructions::send_wanted_tokens_to_taker(&ctx)?;  // passed by ref — good
    instructions::send_tokens_to_maker(ctx)?;          // passed by value — moves ctx
    Ok(())
}

}
