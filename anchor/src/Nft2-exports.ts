// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Nft2IDL from '../target/idl/Nft2.json'
import type { Nft2 } from '../target/types/Nft2'

// Re-export the generated IDL and type
export { Nft2, Nft2IDL }

// The programId is imported from the program IDL.
export const NFT2_PROGRAM_ID = new PublicKey(Nft2IDL.address)

// This is a helper function to get the Nft2 Anchor program.
export function getNft2Program(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...Nft2IDL, address: address ? address.toBase58() : Nft2IDL.address } as Nft2, provider)
}

// This is a helper function to get the program ID for the Nft2 program depending on the cluster.
export function getNft2ProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Nft2 program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return NFT2_PROGRAM_ID
  }
}
