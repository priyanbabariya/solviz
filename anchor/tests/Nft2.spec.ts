import * as anchor from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Nft2 } from "../target/types/Nft2";
import {
  amountToUiAmount,
  createInitializeInterestBearingMintInstruction,
  createInitializeMintInstruction,
  getAccount,
  getInterestBearingMintConfigState,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
const IDL = require("../target/idl/nft2.json");

jest.setTimeout(20000);

describe("Nft2", () => {
  let NFT_PROGRAM: any;
  let NFT_CONTERCT_ADDRESS: any;
  let provider: any;
  let connection: any;
  beforeAll(async () => {
    try {
      NFT_CONTERCT_ADDRESS = new PublicKey(
        "F766wEjQfR9sv3SbdzUzX5hqsLNMqhVqLLuwZovcdfpT"
      );

      connection = new anchor.web3.Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const keypair = Keypair.fromSecretKey(
        new Uint8Array([
          50, 161, 120, 214, 3, 125, 254, 154, 105, 116, 60, 204, 57, 174, 25,
          224, 151, 229, 153, 231, 186, 4, 56, 152, 149, 116, 163, 194, 144,
          168, 94, 169, 222, 188, 113, 169, 36, 241, 148, 23, 183, 27, 154, 24,
          72, 251, 104, 157, 69, 234, 65, 245, 144, 126, 134, 58, 74, 219, 2,
          45, 109, 113, 93, 254,
        ])
      );

      const wallet = new anchor.Wallet(keypair);
      provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "confirmed",
      });

      anchor.setProvider(provider);

      NFT_PROGRAM = new anchor.Program<Nft2>(IDL, provider);
    } catch (error) {
      console.log(error, "error");
    }
  });

  it("should init pool", async () => {
    const owner = anchor.web3.Keypair.fromSecretKey(
      new Uint8Array([
        50, 161, 120, 214, 3, 125, 254, 154, 105, 116, 60, 204, 57, 174, 25,
        224, 151, 229, 153, 231, 186, 4, 56, 152, 149, 116, 163, 194, 144, 168,
        94, 169, 222, 188, 113, 169, 36, 241, 148, 23, 183, 27, 154, 24, 72,
        251, 104, 157, 69, 234, 65, 245, 144, 126, 134, 58, 74, 219, 2, 45, 109,
        113, 93, 254,
      ])
    );

    const amoeny = new PublicKey("oVWCNXRnneep5HJFKH7qexxTzHocoEn9vEZdDgPGqwR");
    const userTokenAccountAddress = new PublicKey(
      "BLniwmRtPHRd6gBHLHM7sR4Bj6YvSs6uRMdEjPCU7t8"
    );

    const poolPda = await PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), amoeny.toBuffer()],
      NFT_CONTERCT_ADDRESS
    );

    console.log(owner.publicKey);

    const seller = anchor.web3.Keypair.generate();

    const pool_vault = new PublicKey(
      "2y9aCayiYuNoxY9jcYGxh6QH1P5zDbNKt9G3bQXVBfQh"
    );

    const amoneyy = anchor.web3.Keypair.generate();
    // const amoneyyAccount = await anchor.utils.token.associatedAddress({
    //   mint: amoneyy.publicKey,
    //   owner: owner.publicKey,
    //   tokenProgram:
    // });

    const amoneyyAccount = await getAssociatedTokenAddress(
      amoneyy.publicKey,
      owner.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    console.log(amoneyy.publicKey);
    console.log(amoneyyAccount);

    try {
      const tx = await NFT_PROGRAM.methods
        .initialize()
        .accounts({
          authority: owner.publicKey,
          pool: poolPda,
          poolVault: pool_vault,
          amoney: amoeny,
          amoneyy: amoneyy.publicKey,
        })
        .signers([owner])
        .transaction();

      const txSig = await provider.sendAndConfirm(tx, [owner]);

      console.log("pool initted secuessfully");
    } catch (err) {
      console.log("Error from init pool  ", err);
    }

    const tokenProgram2 = new PublicKey("TokenzQd8NzCuKQfcofK7S3rLvcjx9cZcYqjUTnwoq33")

    try {
      const tx = await NFT_PROGRAM.methods
        .stake()
        .accounts({
          user: owner.publicKey,
          amoney: amoeny,
          // pool: poolPda,
          amoneyy: amoneyy.publicKey,
          amoneyyAccount,
          userToken: userTokenAccountAddress,
          poolVault: pool_vault,
          tokenProgram: tokenProgram2
        })
        .signers([owner, amoneyy])
        .transaction();

      const txSig = await provider.sendAndConfirm(tx, [owner, amoneyy]);

      console.log("staking token secuessfull");
    } catch (err) {
      console.log("Error from staking token ", err);
    }

    // const mintAccount = await getMint(
    //   connection,
    //   amoneyy.publicKey,
    //   undefined,
    //   TOKEN_2022_PROGRAM_ID
    // );

    // console.log(mintAccount)
    // const config = getInterestBearingMintConfigState(mintAccount);

    // const rawAmount = BigInt(100_000_000_000_000_000);
    // console.log(config)
    // const uiAmount = config.amountToUiAmount(rawAmount, mintAccount.decimals);


    await setTimeout(async () => {

        const tokenInfo = await getAccount(
        connection,
        amoneyyAccount,
        undefined,
        TOKEN_2022_PROGRAM_ID
      );
       // console.log(tokenInfo)
      const uiAmount = await amountToUiAmount(
        connection,
        owner,
        amoneyy.publicKey,
        tokenInfo.amount,
        TOKEN_2022_PROGRAM_ID
      );

      console.log("UI Amount is:", uiAmount);

    }, 5000);
  });
});
