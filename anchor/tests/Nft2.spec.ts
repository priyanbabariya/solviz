import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction} from '@solana/web3.js';
import {Nft2} from '../target/types/Nft2';
import { BankrunProvider, startAnchor } from 'anchor-bankrun';
import { createAssociatedTokenAccountInstruction, createMint , getAccount, getAssociatedTokenAddressSync, getMint } from "@solana/spl-token";
import { buffer } from 'stream/consumers';
const IDL = require("../target/idl/nft2.json");
const borsh = require("borsh");

jest.setTimeout(20000);

describe('Nft2', () => {
  let NFT_PROGRAM: any;
  let NFT_CONTERCT_ADDRESS: any;
  let provider: any;
  let connection: any;
  beforeAll(async () => {
    try {

      NFT_CONTERCT_ADDRESS = new PublicKey("GTG7WyLrVDCYDj7XprvfZWDjFpDcjsJ7VAAssXkY2SqE");

      connection = new anchor.web3.Connection("https://api.devnet.solana.com", "confirmed");
      const keypair = Keypair.fromSecretKey(new Uint8Array([
        50, 161, 120, 214, 3, 125, 254, 154, 105, 116, 60, 204, 57, 174, 25, 224,
        151, 229, 153, 231, 186, 4, 56, 152, 149, 116, 163, 194, 144, 168, 94, 169,
        222, 188, 113, 169, 36, 241, 148, 23, 183, 27, 154, 24, 72, 251, 104, 157,
        69, 234, 65, 245, 144, 126, 134, 58, 74, 219, 2, 45, 109, 113, 93, 254
      ]));

        const wallet = new anchor.Wallet(keypair);
        provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" });

        anchor.setProvider(provider);

        NFT_PROGRAM = new anchor.Program<Nft2>(IDL , provider);
    } catch (error) { 
      console.log(error , "error");
    }
  })

  it("should mint nft" , async () => {

    const owner = anchor.web3.Keypair.fromSecretKey(new Uint8Array([
      50, 161, 120, 214, 3, 125, 254, 154, 105, 116, 60, 204, 57, 174, 25, 224,
      151, 229, 153, 231, 186, 4, 56, 152, 149, 116, 163, 194, 144, 168, 94, 169,
      222, 188, 113, 169, 36, 241, 148, 23, 183, 27, 154, 24, 72, 251, 104, 157,
      69, 234, 65, 245, 144, 126, 134, 58, 74, 219, 2, 45, 109, 113, 93, 254
    ]));

    try {
      // const tx = await NFT_PROGRAM.methods.initMarketplaceAccounts()
      // .accounts(
      //   {
      //     signer: owner.publicKey
      //   }
      // )
      // .signers([owner])
      // .transaction();

      // const txSig = await provider.sendAndConfirm(tx , [owner]);
      
      console.log("accounts Has been inited secuflly");
    } catch (err) {
      console.log(err , "err from start account");
    }

    const metadataProgram = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    const mint = anchor.web3.Keypair.generate();

    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mint.publicKey,
      owner: owner.publicKey
    }); 

    const metadataPda = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        metadataProgram.toBuffer(),
        mint.publicKey.toBuffer()
      ],
      metadataProgram
    )[0];


  try {
      const tx = await NFT_PROGRAM.methods.mintNft("Hello_Nft" , "Hello" , "https://www.mansory.com/sites/default/files/styles/1920x800_fullwidth_car_slider/public/2024-04/mansory_rr_spectre_10.jpg?itok=8YEraM4r")
      .accounts({
        mint: mint.publicKey,
        authority: owner.publicKey,
        metadata: metadataPda,
        tokenAccount: tokenAddress,
        tokenMetadataProgram: metadataProgram
        }
      )
      .signers([mint , owner])
      .transaction();

      const txSig = await provider.sendAndConfirm(tx, [mint, owner]);
      console.log("nft minted scuessfully on address " , mint.publicKey.toBase58());
    } catch (error) {
      console.log(error , "error");
    }

    try {
      const [getNftDataAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from("all_nft_data") , mint.publicKey.toBuffer()],
        NFT_CONTERCT_ADDRESS
      );

      const getNftData = await NFT_PROGRAM.account.allNftData.fetch(getNftDataAddress);

      console.log(getNftData , "nft_data");
    } catch (err) {
      console.log(err , "err from get nft data");
    }
    
  try {
      const tx = await NFT_PROGRAM.methods
      .listForSale(new anchor.BN(100))
      .accounts({
        signer: owner.publicKey,
        listedNftAddress: mint.publicKey,
      })
      .signers([owner])
      .transaction();

    const txsig = await provider.sendAndConfirm(tx , [owner]);

    console.log("nft listed scuessfully");
  } catch (err) {
    console.log(err , "error from list nft");
  }

  const [marketplaceDataAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from("marketplace_for_nft")],
    NFT_CONTERCT_ADDRESS
  )

  console.log(marketplaceDataAddress);
  
  try {
    const data = await NFT_PROGRAM.account.nftListedOnMarket.fetch(marketplaceDataAddress);
    console.log(data);
  } catch (err) {
    console.log(err , "fetch nft");
  }

  
  const buyer = await anchor.web3.Keypair.fromSecretKey(new Uint8Array([147,135,139,6,101,224,23,100,112,207,72,83,51,140,191,237,190,72,145,102,157,190,27,173,70,171,48,165,27,86,172,148,1,26,194,118,47,42,47,254,0,67,226,201,191,240,65,49,76,68,104,252,244,143,64,107,231,255,24,27,250,230,149,164]));

  const buyer_token_account_address = await anchor.utils.token.associatedAddress({
    mint: mint.publicKey,
    owner: buyer.publicKey
  })


  try {
      const tx = await NFT_PROGRAM.methods.buyNft().accounts({
        buyer: buyer.publicKey,
        seller: owner.publicKey,
        sellerTokenAccount: tokenAddress,
        buyerTokenAccount: buyer_token_account_address,
        nftMint: mint.publicKey, 
      })
      .signers([buyer , owner])
      .transaction();

      const txsig = await provider.sendAndConfirm(tx , [buyer , owner]);

      console.log(mint.publicKey.toBase58() , "Transerfered scuessfully to " , buyer.publicKey.toBase58());
    } catch (error) {
      console.log(error , "error");
    }

  })
})
