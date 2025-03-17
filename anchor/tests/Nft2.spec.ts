import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Nft2 } from '../target/types/Nft2'

describe('Nft2', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Nft2 as Program<Nft2>

  const Nft2Keypair = Keypair.generate()

  it('Initialize Nft2', async () => {
    await program.methods
      .initialize()
      .accounts({
        Nft2: Nft2Keypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([Nft2Keypair])
      .rpc()

    const currentCount = await program.account.Nft2.fetch(Nft2Keypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Nft2', async () => {
    await program.methods.increment().accounts({ Nft2: Nft2Keypair.publicKey }).rpc()

    const currentCount = await program.account.Nft2.fetch(Nft2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Nft2 Again', async () => {
    await program.methods.increment().accounts({ Nft2: Nft2Keypair.publicKey }).rpc()

    const currentCount = await program.account.Nft2.fetch(Nft2Keypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Nft2', async () => {
    await program.methods.decrement().accounts({ Nft2: Nft2Keypair.publicKey }).rpc()

    const currentCount = await program.account.Nft2.fetch(Nft2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set Nft2 value', async () => {
    await program.methods.set(42).accounts({ Nft2: Nft2Keypair.publicKey }).rpc()

    const currentCount = await program.account.Nft2.fetch(Nft2Keypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the Nft2 account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        Nft2: Nft2Keypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.Nft2.fetchNullable(Nft2Keypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
