use anchor_lang::prelude::*;
use anchor_spl::{associated_token::{self, AssociatedToken}, token::{self, spl_token, Mint, MintTo, Token, TokenAccount, Transfer}, token_interface::spl_token_metadata_interface::state::TokenMetadata};
// use mpl_token_metadata::instructions::{CreateMetadataAccountV3, CreateMasterEditionV3 , CreateMetadataAccountV3InstructionArgs};
use mpl_token_metadata::{ ID as TOKEN_METADATA_ID , instructions::{CreateMetadataAccountV3}};
use anchor_lang::system_program;
use std::collections::HashMap;

declare_id!("GTG7WyLrVDCYDj7XprvfZWDjFpDcjsJ7VAAssXkY2SqE");

#[program]
pub mod nft2 {
    use anchor_spl::associated_token::{self, AssociatedToken};
    use mpl_token_metadata::{instructions::{CreateMetadataAccountV3CpiBuilder, CreateMetadataAccountV3InstructionArgs}, types::{self, DataV2}};
    use solana_program::{program::invoke, system_instruction};

    use super::*;

    pub fn init_marketplace_accounts(_ctx: Context<InitMarketplaceAccounts>) -> Result<()> {
        Ok(())
    }
    
    pub fn mint_nft(_ctx: Context<NftMint> , _name: String , _symbol: String , _image_url: String) -> Result<()> {
        msg!("account = {} , balance = {}" , _ctx.accounts.authority.key() , _ctx.accounts.authority.lamports());
        let slot = Clock::get()?.slot;
        msg!("Current Slot: {}", slot); 

        system_program::create_account(
            CpiContext::new(
                _ctx.accounts.token_program.to_account_info(),
                system_program::CreateAccount {
                    from: _ctx.accounts.authority.to_account_info(),
                    to: _ctx.accounts.mint.to_account_info(),
                },
            ),
            10000000,
            82,
            &_ctx.accounts.token_program.key(),
        )?;

        msg!("account = {} , balance = {}" , _ctx.accounts.mint.key() , _ctx.accounts.mint.lamports());
        token::initialize_mint(
            CpiContext::new(
                _ctx.accounts.token_program.to_account_info(),
                token::InitializeMint {
                    mint: _ctx.accounts.mint.to_account_info(),
                    rent: _ctx.accounts.rent.to_account_info(),
                },
            ),
            0,
            &_ctx.accounts.authority.key(),
            Some(&_ctx.accounts.authority.key()),
        )?;

        associated_token::create(
            CpiContext::new(
                _ctx.accounts.associated_token_program.to_account_info(),
                associated_token::Create {
                    payer: _ctx.accounts.authority.to_account_info(),
                    associated_token: _ctx.accounts.token_account.to_account_info(),
                    authority: _ctx.accounts.authority.to_account_info(),
                    mint: _ctx.accounts.mint.to_account_info(),
                    system_program: _ctx.accounts.system_program.to_account_info(),
                    token_program: _ctx.accounts.token_program.to_account_info(),
                },
            ),
        )?;

        let cpi_accounts = MintTo {
            mint: _ctx.accounts.mint.to_account_info(),
            to: _ctx.accounts.token_account.to_account_info(),
            authority: _ctx.accounts.authority.to_account_info()
        };

        let cpi_program = _ctx.accounts.token_program.to_account_info();

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::mint_to(
            CpiContext::new(
                _ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: _ctx.accounts.mint.to_account_info(),
                    to: _ctx.accounts.token_account.to_account_info(),
                    authority: _ctx.accounts.authority.to_account_info(),
                },
            ),
            1,
        )?;

        
        msg!("Token Minted Successfully!");

        let data = DataV2 {
            name: _name.to_string(),
            symbol: _symbol.to_string(),
            uri: _image_url.to_string(),
            seller_fee_basis_points: 50,
            collection: None,
            creators: Some(vec![types::Creator {
                address: _ctx.accounts.authority.key(),
                verified: true,
                share: 100,
            }]),
            uses: None,
        };
        
        CreateMetadataAccountV3CpiBuilder::new(&_ctx.accounts.token_metadata_program.to_account_info())
            .metadata(&_ctx.accounts.metadata)
            .mint(&_ctx.accounts.mint.to_account_info())
            .mint_authority(&_ctx.accounts.authority.to_account_info())
            .payer(&_ctx.accounts.authority)
            .update_authority(&_ctx.accounts.authority, true)
            .system_program(&_ctx.accounts.system_program)
            .rent(None)
            .data(data)
            .is_mutable(true)
            .invoke()?;

            _ctx.accounts.nft_data.set_inner(AllNftData {
                nft_address: _ctx.accounts.mint.key(),
                owner: _ctx.accounts.authority.key(),
                name: _name,
                symbol: _symbol,
                image_url: _image_url,
                metadata: _ctx.accounts.metadata.key(),
                is_listed: false,
                price: 0,
            });

        Ok(())
    }
    
    pub fn list_for_sale(_ctx: Context<ListForSale>, price: u64) -> Result<()>{ 
        msg!("signer = {}" , _ctx.accounts.signer.key());
        msg!("owner = {:?}" , _ctx.accounts.nft_data.owner);
        require!(_ctx.accounts.signer.key() == _ctx.accounts.nft_data.owner.key() , CustomError::OwnerDoesNotMatched);
        require!(price > 0 , CustomError::NotValidPrice);

        _ctx.accounts.nft_data.is_listed = true;
        _ctx.accounts.nft_data.price = price;

        _ctx.accounts.listnftdata.nft_address.push(_ctx.accounts.listed_nft_address.key());
        _ctx.accounts.listnftdata.owner.push(_ctx.accounts.nft_data.owner.key());
        _ctx.accounts.listnftdata.name.push(_ctx.accounts.nft_data.name.to_string());
        _ctx.accounts.listnftdata.symbol.push(_ctx.accounts.nft_data.symbol.to_string());
        _ctx.accounts.listnftdata.image_url.push(_ctx.accounts.nft_data.image_url.to_string());
        _ctx.accounts.listnftdata.price.push(price);
        Ok(())
    }


    pub fn buy_nft(_ctx: Context<BuyNFT>) -> Result<()> {

        require!(_ctx.accounts.nft_data.is_listed , CustomError::NotListedNft);

        let ix = system_instruction::transfer(
            &_ctx.accounts.buyer.key(),
            &_ctx.accounts.seller.key(),
            _ctx.accounts.nft_data.price
        );

        invoke(
            &ix,
            &[
                _ctx.accounts.buyer.to_account_info(),
                _ctx.accounts.seller.to_account_info(),
                _ctx.accounts.system_program.to_account_info(),
            ]
        )?;

        associated_token::create(
            CpiContext::new(
                _ctx.accounts.associated_token_program.to_account_info(),
                associated_token::Create {
                    payer: _ctx.accounts.buyer.to_account_info(),
                    associated_token: _ctx.accounts.buyer_token_account.to_account_info(),
                    authority: _ctx.accounts.buyer.to_account_info(),
                    mint: _ctx.accounts.nft_mint.to_account_info(),
                    system_program: _ctx.accounts.system_program.to_account_info(),
                    token_program: _ctx.accounts.token_program.to_account_info(),
                },
            ),
        )?;

        // msg!("nft listation state {} " , _ctx.accounts.nft_listing.is_listed);

        let transfer_instruction = Transfer {
            from: _ctx.accounts.seller_token_account.to_account_info(),
            to: _ctx.accounts.buyer_token_account.to_account_info(),
            authority: _ctx.accounts.seller.to_account_info(),
        };

        token::transfer(
            CpiContext::new(_ctx.accounts.token_program.to_account_info(), transfer_instruction),
            1,
        )?;

        msg!("NFT Transferred to Buyer!");
        Ok(())
    }
}


#[account]
#[derive(InitSpace)]
pub struct AllNftData {
    pub nft_address: Pubkey,
    pub owner: Pubkey,
    #[max_len(32)]
    pub name: String,
    #[max_len(32)]
    pub symbol: String,
    #[max_len(500)]
    pub image_url: String,
    pub metadata: Pubkey,
    pub is_listed: bool,
    pub price: u64,
}

#[account]
#[derive(InitSpace)]
pub struct NftListedOnMarket {
    #[max_len(10)]
    pub nft_address: Vec<Pubkey>,
    #[max_len(10)]
    pub owner: Vec<Pubkey>,
    #[max_len(10 , 32)]
    pub name: Vec<String>,
    #[max_len(10 , 32)]
    pub symbol: Vec<String>,
    #[max_len(10 , 280)]
    pub image_url: Vec<String>,
    #[max_len(10)]
    pub price: Vec<u64>,
}

#[derive(Accounts)]
pub struct InitMarketplaceAccounts<'info> { 
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer, 
        space = 8 + NftListedOnMarket::INIT_SPACE,
        seeds = [b"marketplace_for_nft".as_ref()],
        bump
    )]
    pub listnftdata: Account<'info , NftListedOnMarket>,
    pub system_program: Program<'info, System>, 

}

#[derive(Accounts)]
pub struct NftMint<'info> { 
  #[account(mut , signer)]
  pub mint: Signer<'info>,
  #[account(mut , signer)]
  pub authority: Signer<'info>,
  /// CHECK: check for safety in future 
  #[account(mut)]
  pub metadata: AccountInfo<'info>,
  /// CHECK: check for safety in future 
  #[account(mut)]
  pub token_account: AccountInfo<'info>,
  pub token_program: Program<'info , Token>,
  pub system_program: Program<'info, System>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  #[account(
    init,
    payer = authority,
    space = 8 + AllNftData::INIT_SPACE,
    seeds = [b"all_nft_data".as_ref() , mint.key().as_ref()],
    bump
  )]
  pub nft_data: Account<'info , AllNftData>,
 /// CHECK: Metaplex will check this
  pub token_metadata_program: UncheckedAccount<'info>,
  pub rent: Sysvar<'info, Rent>
}

#[derive(Accounts)]
pub struct BuyNFT<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account 
    #[account(mut)]
    pub seller: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account 
    #[account(mut)]
    pub seller_token_account: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account 
    #[account(mut)]
    pub buyer_token_account: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account 
    #[account(mut)]
    pub nft_mint: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [b"all_nft_data".as_ref() , nft_mint.key().as_ref()],
        bump
    )]
    pub nft_data: Account<'info , AllNftData>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ListForSale<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account 
    #[account(mut)]
    pub listed_nft_address: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [b"all_nft_data".as_ref() , listed_nft_address.key().as_ref()],
        bump
    )]
    pub nft_data: Account<'info , AllNftData>,
    #[account(
        mut,
        seeds = [b"marketplace_for_nft".as_ref()],
        bump
    )]
    pub listnftdata: Account<'info , NftListedOnMarket>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum  CustomError {
    #[msg("Owner Does Not Matched")]
    OwnerDoesNotMatched,
    #[msg("Please enter valid price")]
    NotValidPrice ,
    #[msg("nft is not listed")]
    NotListedNft
}

// GNokYGPZhaZeCdCUNvkRAtFeGrKXZfJQQwG6Fjzk6aNX

// https://miro.medium.com/v2/resize:fit:4800/format:webp/1*oM1GuZ0oC3_9v1GfKC2Egg.jpeg