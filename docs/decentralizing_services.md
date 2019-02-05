# Decentralizing central services

*Important: This concept is still in early development and discussion and not implemented yet, but planned in future milestones.*

Many DAPPs still need some offchain-services, like search-services running on a server, which of course can be seen as single point of failure. In order to dectralize these even dapp-specific services they must fullfill these criteria:

1. **stateless** - since requests may be send to different servers they cannot hold a users state, which would only be available on one node.
2. **deterministic** - all servers need to produce the exact same result

If these requirements are met, the service can be registered defining the server behavior in a docker image.

```eval_rst
.. graphviz::

    digraph minimal_nonplanar_graphs {
    graph [ rankdir = "LR" ]
    fontname="Helvetica"

    subgraph all {
        label="Registry"

        subgraph cluster_client_registry {
            label="ServiceRegistry"  color=lightblue  style=filled
            node [ fontsize = "12", style="",  shape = "record" color=black fontname="Helvetica" ]

            M[label="<f0>Matrix|matrix/matrix:latest|wasm"]
            S[label="<f0>Search|slockit/search:latest|wasm"]
            W[label="<f0>Whisper|whisper:latest|wasm"]
        }


        subgraph cluster_registry {
            label="ServerRegistry"  color=lightblue  style=filled
            node [ fontsize = "12", shape = "record",  color=black style="" fontname="Helvetica" ]

            sa[label="<f0>Server A|<offer>offer|<rewards>rewards|<f2>http://rpc.s1.."]
            sb[label="<f0>Server B|<offer>offer|<rewards>rewards|<f2>http://rpc.s2.."]
            sc[label="<f0>Server C|<offer>offer|<rewards>rewards|<f2>http://rpc.s3.."]

            sa:offer -> M:f0 [color=darkgreen]
            sa:offer -> S:f0 [color=darkgreen]
            sb:offer -> W:f0 [color=darkgreen]
            sc:offer -> W:f0 [color=darkgreen]

            M:f0  -> sa:rewards [color=orange]
            M:f0  -> sb:rewards [color=orange]
            W:f0  -> sc:rewards [color=orange]


        }


        subgraph cluster_cloud {
            label="cloud"  color=lightblue  style=filled
            node [ fontsize = "12",  color=white style=filled  fontname="Helvetica" ]

            A[label="Server A"]
            A -> {       
                AM[label="Matrix", shape=record]
                AS[label="Search", shape=record]
            }

            B[label="Server B"]
            {B C} -> {       
                BW[label="Whisper", shape=record]
            }
            C[label="Server C"]
    
        }
    }}

```

## Incentivication

Each Server can define

- a list of services as offer
- a list of services to reward

The main idea is simply:

> **if you run my service I will run yours**

Each Server can specifiy which services we would like to see used. If another server offers them, he will also run at least as many rewareded services of the other node.

## Verification

Each Service specify a Verifier, which is a wasm-module (specified through a ipfs-hash). This wasm offers 2 function:

```js
function minRequests():number

function verify(request:RPCRequest[], responses:RPCResponse[])
```

A minimal version could simply asure running at least 2 requests and comparing them. In case they differ they can 

- check with the "home"-server
- convict nodes

### convicting

As a generic service convicting on chain can not be done, but each server is able to verify the result and if false downgrade the score.
