#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod Nft2 {
    use super::*;

  pub fn close(_ctx: Context<CloseNft2>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.Nft2.count = ctx.accounts.Nft2.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.Nft2.count = ctx.accounts.Nft2.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeNft2>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.Nft2.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeNft2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Nft2::INIT_SPACE,
  payer = payer
  )]
  pub Nft2: Account<'info, Nft2>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseNft2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub Nft2: Account<'info, Nft2>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub Nft2: Account<'info, Nft2>,
}

#[account]
#[derive(InitSpace)]
pub struct Nft2 {
  count: u8,
}
