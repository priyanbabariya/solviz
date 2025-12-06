use anchor_lang::prelude::*;
use anchor_spl::token_2022::{self, InitializeMint2, Token2022};
use anchor_spl::{
    associated_token::{self, AssociatedToken},
    token::{Burn, Mint, MintTo, Token, TokenAccount, Transfer},
};


declare_id!("Aq9FnBRSmUfQB37RC1tssKYLdB4QDt7sZaMLNgaCmwna");

#[program]
pub mod nft2 {
    use anchor_lang::system_program;
    use anchor_spl::{
        token,
        token_2022::{
            spl_token_2022::{extension::ExtensionType, pod::PodMint},
            MintTo, TransferChecked,
        },
        token_interface::{interest_bearing_mint_initialize, InterestBearingMintInitialize},
    };

    use super::*;

    const DEFAULT_COOLDOWN: u64 = 7 * 24 * 60 * 60;

    pub fn initialize(ctx: Context<InitializePool>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = *ctx.accounts.authority.key;
        pool.amoney = *ctx.accounts.amoney.to_account_info().key;
        pool.aMONYy_mint = *ctx.accounts.amoneyy.to_account_info().key;
        pool.vault = *ctx.accounts.pool_vault.to_account_info().key;
        pool.cooldown = DEFAULT_COOLDOWN;

        // associated_token::create(CpiContext::new(
        //     ctx.accounts.assosiated_tokrn_program.to_account_info(),
        //     associated_token::Create {
        //         payer: ctx.accounts.authority.to_account_info(),
        //         associated_token: ctx.accounts.pool_vault.to_account_info(),
        //         authority: ctx.accounts.authority.to_account_info(),
        //         mint: ctx.accounts.amoney.to_account_info(),
        //         system_program: ctx.accounts.system_program.to_account_info(),
        //         token_program: ctx.accounts.token_program.to_account_info(),
        //     },
        // ))?;

        Ok(())
    }

    pub fn stake(_ctx: Context<Stake>) -> Result<()> {

        msg!("Token program id = {} " , _ctx.accounts.token_program.key());
        // token_2022::transfer_checked (
        //     CpiContext::new_with_signer(
        //        _ctx.accounts.token_program.to_account_info(),
        //       TransferChecked {
        //         from: _ctx.accounts.user_token.to_account_info(),
        //         to: _ctx.accounts.pool_vault.to_account_info(),
        //         authority: _ctx.accounts.user.to_account_info(),
        //         mint: _ctx.accounts.amoney.to_account_info(),
        //       },
        //       &[]
        //     ),
        //     100000000000,
        //     0
        // )?;

        let mint_size = ExtensionType::try_calculate_account_len::<PodMint>(&[
            ExtensionType::InterestBearingConfig,
        ])?;

        system_program::create_account(
            CpiContext::new(
                _ctx.accounts.system_program.to_account_info(),
                system_program::CreateAccount {
                    from: _ctx.accounts.user.to_account_info(),
                    to: _ctx.accounts.amoneyy.to_account_info(),
                },
            ),
            10000000,
            82,
            &_ctx.accounts.token_program.key(),
        )?;

        // interest_bearing_mint_initialize(
        //     CpiContext::new(
        //         _ctx.accounts.token_program.to_account_info(),
        //         InterestBearingMintInitialize {
        //             token_program_id: _ctx.accounts.token_program.to_account_info(),
        //             mint: _ctx.accounts.amoneyy.to_account_info(),
        //         },
        //     ),
        //     Some(_ctx.accounts.user.key()),
        //     15,
        // )?;

        token_2022::initialize_mint2(
            CpiContext::new(
                _ctx.accounts.token_program.to_account_info(),
                InitializeMint2 {
                    mint: _ctx.accounts.amoneyy.to_account_info(),
                },
            ),
            0,
            &_ctx.accounts.user.key(),
            Some(&_ctx.accounts.user.key()),
        )?;

        associated_token::create(CpiContext::new(
            _ctx.accounts.associated_token_program.to_account_info(),
            associated_token::Create {
                payer: _ctx.accounts.user.to_account_info(),
                associated_token: _ctx.accounts.amoneyy_account.to_account_info(),
                authority: _ctx.accounts.user.to_account_info(),
                mint: _ctx.accounts.amoneyy.to_account_info(),
                system_program: _ctx.accounts.system_program.to_account_info(),
                token_program: _ctx.accounts.token_program.to_account_info(),
            },
        ))?;

        token_2022::mint_to(
            CpiContext::new(
                _ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: _ctx.accounts.amoneyy.to_account_info(),
                    to: _ctx.accounts.amoneyy_account.to_account_info(),
                    authority: _ctx.accounts.user.to_account_info(),
                },
            ),
            100000000000000000,
        )?;

        Ok(())
    }

    // pub fn withdraw(_ctx: Context<Withdraw>) -> Result<()> {
    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(init_if_needed , payer = authority, seeds = [b"pool", amoney.key().as_ref()] , space = 8 + Pool::INIT_SPACE , bump)]
    pub pool: Account<'info, Pool>,
    /// CHECK: check for safety in future
    #[account(mut)]
    pub pool_vault: AccountInfo<'info>,
    /// CHECK: check for safety in future
    #[account(mut)]
    pub amoney: AccountInfo<'info>,
    /// CHECK: check for safety in future
    #[account(mut)]
    pub amoneyy: AccountInfo<'info>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub assosiated_tokrn_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub amoneyy: Signer<'info>,
    // #[account(mut, seeds = [b"pool", pool.amoney.as_ref()], bump)]
    // pub pool: Account<'info, Pool>,
    /// CHECK: check for safety in future
    #[account(mut)]
    pub amoney: AccountInfo<'info>,
    /// CHECK: check for safety in future
    #[account(mut)]
    pub user_token: AccountInfo<'info>,
    /// CHECK: check for safety in future
    #[account(mut)]
    pub pool_vault: AccountInfo<'info>,
    /// CHECK: check for safety in future
    #[account(mut)]
    pub amoneyy_account: AccountInfo<'info>,
    /// CHECK: check for safety in future
    pub token_program: AccountInfo<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// #[derive(Accounts)]
// pub struct  Unstake<'info> {
// #[account(mut)]
// }

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub authority: Pubkey,
    pub amoney: Pubkey,
    pub aMONYy_mint: Pubkey,
    pub vault: Pubkey,
    pub cooldown: u64,
}


// first try store impal in a var and after that call function and if that does't works then make it impal