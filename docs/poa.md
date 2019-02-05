## Verifying Blockheaders

Since all Proofs always include the Blockheader, it is crucial to verify the correctness of these data as well. But Verification depends on the Consensys of the underlying Blopckchain. (for Details See [Ethereum Verification and MerkleProof](./Ethereum-Verification-and-MerkleProof) )

```eval_rst
.. graphviz::

  digraph minimal_nonplanar_graphs {
    node [style=filled  fontname="Helvetica"]
  fontname="Helvetica"
  edge[ fontname="Helvetica"]

  subgraph cluster_pow {
    label="Proof or Work"  color=lightblue  style=filled
    node [color=white]

    c[label="Client"]

    A[label="Node A"]
    B[label="Node B"]
    C[label="Node C"]

    c -> B[label=""]
    B -> c[label=" response\n + proof  \n + signed\n    header"]
    B -> A[label=" sign"]
    B -> C

  
  }

  subgraph cluster_poa {
    label="Proof of Authority"  color=lightblue  style=filled
    node [color=white]

    _c[label="Client"]

    _B[label="Node"]

    _c -> _B[label=""]
    _B -> _c[label=" response\n + proof  \n + header"]
  }

  subgraph cluster_pos {
    label="Proof of Stake"  color=lightblue  style=filled
    node [color=white]
  rank=same x N V
      
    x[label="Client"]

    N[label="Node"]
    V[label="Node (Validator)"]

    x -> N[label=""]
    N -> x[label=" response\n + proof  \n + header"]

    x -> V[label=" header"]

  
  }

  }


```

### Proof of Work

Currently the public chain uses Proof of Work. This makes very hard to verify the header, since anybody could produce such a header. So the only way to verify thatn this is accepted block, we need to let registered nodes sign the blockhash. If they would be wrong, they lose their previously stored deposit. For client this means the the required security depends on the deposit stored by the nodes.
That's why a client may be configured to require multiple signatures and even a minimal deposit:

```js
client.sendRPC('eth_getBalance', [account, 'latest'], chain, {
  minDeposit: web3.utils.toWei(10,'ether'),
  signatureCount: 3
})
```

The `minDeposit` let the client preselect only nodes with at least that much deposit.
The `signatureCount` asks for multiple signature and so increases the security.

Since most client are small devices with limited bandwith, the client is not asking the signatures directly from the nodes, but chooses on node and let this node run a subrequest to the get the signatures. This means less requests for the clients, but this also means at least one node also checked the signatures and convicted the other if they lied.

### Proof of Authority

The good thing about Proof of Authority is that there is already a signature included in the blockheader. So if we know who is allowed to sign a block, we can do not need a additional blockhash signed. The only critical information we rely on is the list of validators.

Currently there are 2 Consensys algorithm:

#### Aura

Aura is used by parity only and there are 2 ways to configure such:

- **static list of nodes** (like the kovan-network) - In this case the validatorlist is included in the chain-spec and cannot change, which makes it very easy for a client to verify blockheaders.
- **validator contract** - a contract which offers a function `getValidators()`. Depending on the chain these contract may contains rules that define how validators may change. But this flexibility comes with a price. This makes it harder for a client to find a secure way to detect validator changes. That's why the proof for the such a contract depends on the rules layed out in the contract and will be chain-specific. 

#### Clique

Clique is Protocol developed by the geth-team and is now also supported by parity (see görli-testnet).
Instead of relying on a contract clique defines a protocol how validators nodes may change. All votes are done directly in the blockheader. This makes it easier to proof, since it does not rely on any contract. 

The incubed nodes will check all the blocks for votes and create a `validatorlist` which defines the validatorset for any given blocknumber. This also includes the proof in form of all blockheaders, that either voted the new node in or out. This way the client can ask for the list and automaticly update the internal liost after he verified each blockheader and vote. Even though malicus nodes cannot fake the signatures of a validator, that may skip votes in the validatorlist. That is why a validatorlist update should always be done by running multiple requests and merging them together.

