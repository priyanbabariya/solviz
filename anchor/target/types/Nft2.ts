/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/nft2.json`.
 */
export type Nft2 = {
  "address": "GTG7WyLrVDCYDj7XprvfZWDjFpDcjsJ7VAAssXkY2SqE",
  "metadata": {
    "name": "nft2",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyNft",
      "discriminator": [
        96,
        0,
        28,
        190,
        49,
        107,
        83,
        222
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "seller",
          "writable": true
        },
        {
          "name": "sellerTokenAccount",
          "writable": true
        },
        {
          "name": "buyerTokenAccount",
          "writable": true
        },
        {
          "name": "nftMint",
          "writable": true
        },
        {
          "name": "nftData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  108,
                  95,
                  110,
                  102,
                  116,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initMarketplaceAccounts",
      "discriminator": [
        176,
        102,
        135,
        192,
        37,
        38,
        126,
        90
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "listnftdata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116,
                  112,
                  108,
                  97,
                  99,
                  101,
                  95,
                  102,
                  111,
                  114,
                  95,
                  110,
                  102,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "listForSale",
      "discriminator": [
        188,
        214,
        1,
        112,
        93,
        215,
        124,
        207
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "listedNftAddress",
          "writable": true
        },
        {
          "name": "nftData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  108,
                  95,
                  110,
                  102,
                  116,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "listedNftAddress"
              }
            ]
          }
        },
        {
          "name": "listnftdata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116,
                  112,
                  108,
                  97,
                  99,
                  101,
                  95,
                  102,
                  111,
                  114,
                  95,
                  110,
                  102,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintNft",
      "discriminator": [
        211,
        57,
        6,
        167,
        15,
        219,
        35,
        251
      ],
      "accounts": [
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "tokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "nftData",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  108,
                  95,
                  110,
                  102,
                  116,
                  95,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenMetadataProgram"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "imageUrl",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "allNftData",
      "discriminator": [
        91,
        203,
        233,
        176,
        179,
        184,
        180,
        201
      ]
    },
    {
      "name": "nftListedOnMarket",
      "discriminator": [
        190,
        211,
        162,
        57,
        135,
        35,
        223,
        236
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ownerDoesNotMatched",
      "msg": "Owner Does Not Matched"
    },
    {
      "code": 6001,
      "name": "notValidPrice",
      "msg": "Please enter valid price"
    },
    {
      "code": 6002,
      "name": "notListedNft",
      "msg": "nft is not listed"
    }
  ],
  "types": [
    {
      "name": "allNftData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftAddress",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "imageUrl",
            "type": "string"
          },
          {
            "name": "metadata",
            "type": "pubkey"
          },
          {
            "name": "isListed",
            "type": "bool"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "nftListedOnMarket",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftAddress",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "owner",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "name",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "symbol",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "imageUrl",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "price",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    }
  ]
};
