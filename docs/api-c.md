# API Reference C


## Overview

The C Implementation of the incubed client is prepared and optimized to run on small embedded devices. Because each device is different, we prepare different modules which should be combined. This allowes us to only generate the code needed and so reduce the requirements for flash and memory.

This is why the incubed is combind of different modules. While the core-module is always required additional functions will be prepared by differen modules:

### Verifier

Incubed is a minimal verifaction client, which means, each response needs to be verifable. Depending on the expected requests and responses you need to carefully choose which verifier you may need to register. For ethereum we have developed 3 Modules:

- [nano](#module-eth-nano) : a Minimal module only able to verify transaction receipts ( `eth_getTransactionReceipt`)
- [basic](#module-eth-basic) : module able to verify almost all other standard rpc-function. (except `eth_call`)
- [full](#module-eth-full) : module able to verify standard rpc-function. It also implements a full EVM in order to handle `eth_call`

Depending on the module you need to register the verifier before using it. This is done by calling the `in3_register...` function like [in3_register_eth_full()](#in3-register-eth-full).

### Transport

In order to verify responses, you need to able to send requests. The way to handle them depend heavily on your hardware capabilities. For example, if your device only supports bluetooth, you may use this connection to deliver the request to a device with a existing internet connection and get the response in the same way, but if your device is able to use a direct internet connection, you may use a curl-library to execxute them. That's why the core client only defines a function pointer [in3_transport_send](#in3-transport-send) which must handle the requests.

At the moment we offer these modules, other implementation by supported inside different hardware-modules.

- [curl](#module-transport-curl) : module with a dependency to curl which executes these requests with curl, also supporting HTTPS. This modules is supposed to run an standard os with curl installed.

### API

While incubed operates on JSON-RPC-Level, as a developer you might want to use a better structed API preparing these requests for you. These APIs are optional but make life easier:

- [**eth**](#module-eth-api) : This module offers all standard RPC-Functions as descriped in the [Ethereum JSON-RPC Specification](https://github.com/ethereum/wiki/wiki/JSON-RPC). In addition it allows you to sign and encode/decode calls and transactions.
- [**usn**](#module-usn-api) : This module offers basic USN-function like renting or event-handling and message-verifaction.




## Module core 


main incubed module defining the interfaces for transport, verifier and storage.

This module does not have any dependencies and cannot be used without additional modules providing verification and transport.

### cache.h

handles caching and storage. 

storing nodelists and other caches with the storage handler as specified in the client. If no storage handler is specified nothing will be cached. 

Location: src/core/client/cache.h

#### in3_cache_init

```c
in3_ret_t in3_cache_init(in3_t *c);
```

inits the client. 

This is done by checking the cache and updating the local storage. This function should be called after creating a new incubed instance.

example 

```c
// register verifiers
in3_register_eth_full();

// create new client
in3_t* client = in3_new();

// configure storage...
in3_storage_handler_t storage_handler;
storage_handler.get_item = storage_get_item;
storage_handler.set_item = storage_set_item;

// configure transport
client->transport    = send_curl;

// configure storage
client->cacheStorage = &storage_handler;

// init cache
in3_cache_init(client);

// ready to use ...
```
arguments:
```eval_rst
=================== ======= ==================
`in3_t * <#in3-t>`_  **c**  the incubed client
=================== ======= ==================
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_cache_update_nodelist

```c
in3_ret_t in3_cache_update_nodelist(in3_t *c, in3_chain_t *chain);
```

reads the nodelist from cache. 

This function is usually called internally to fill the weights and nodelist from the the cache. If you call `in3_cache_init` there is no need to call this explicitly. 

arguments:
```eval_rst
=============================== =========== ==================
`in3_t * <#in3-t>`_              **c**      the incubed client
`in3_chain_t * <#in3-chain-t>`_  **chain**  chain to configure
=============================== =========== ==================
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_cache_store_nodelist

```c
in3_ret_t in3_cache_store_nodelist(in3_ctx_t *ctx, in3_chain_t *chain);
```

stores the nodelist to thes cache. 

It will automaticly called if the nodelist has changed and read from the nodes or the wirght of a node changed. 

arguments:
```eval_rst
=============================== =========== ===========================
`in3_ctx_t * <#in3-ctx-t>`_      **ctx**    the current incubed context
`in3_chain_t * <#in3-chain-t>`_  **chain**  the chain upating to cache
=============================== =========== ===========================
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


### client.h

incubed main client file. 

This includes the definition of the client and used enum values. 

Location: src/core/client/client.h

#### IN3_SIGN_ERR_REJECTED

return value used by the signer if the the signature-request was rejected. 

```c
#define IN3_SIGN_ERR_REJECTED -1
```


#### IN3_SIGN_ERR_ACCOUNT_NOT_FOUND

return value used by the signer if the requested account was not found. 

```c
#define IN3_SIGN_ERR_ACCOUNT_NOT_FOUND -2
```


#### IN3_SIGN_ERR_INVALID_MESSAGE

return value used by the signer if the message was invalid. 

```c
#define IN3_SIGN_ERR_INVALID_MESSAGE -3
```


#### IN3_SIGN_ERR_GENERAL_ERROR

return value used by the signer for unspecified errors. 

```c
#define IN3_SIGN_ERR_GENERAL_ERROR -4
```


#### IN3_DEBUG

flag used in the EVM (or the `evm_flags`) to turn on debug output. 

```c
#define IN3_DEBUG 65536
```


#### in3_chain_type_t

the type of the chain. 

for incubed a chain can be any distributed network or database with incubed support. Depending on this chain-type the previously registered verifyer will be choosen and used. 

The enum type contains the following values:

```eval_rst
===================== = =================
 **CHAIN_ETH**        0 Ethereum chain.
 **CHAIN_SUBSTRATE**  1 substrate chain
 **CHAIN_IPFS**       2 ipfs verifiaction
 **CHAIN_BTC**        3 Bitcoin chain.
 **CHAIN_IOTA**       4 IOTA chain.
 **CHAIN_GENERIC**    5 other chains
===================== = =================
```

#### in3_proof_t

the type of proof. 

Depending on the proof-type different levels of proof will be requested from the node. 

The enum type contains the following values:

```eval_rst
==================== = ==================================================
 **PROOF_NONE**      0 No Verification.
 **PROOF_STANDARD**  1 Standard Verification of the important properties.
 **PROOF_FULL**      2 All field will be validated including uncles.
==================== = ==================================================
```

#### in3_verification_t

verification as delivered by the server. 

This will be part of the in3-request and will be generated based on the prooftype. 

The enum type contains the following values:

```eval_rst
======================================= = ===============================
 **VERIFICATION_NEVER**                 0 No Verifacation.
 **VERIFICATION_PROOF**                 1 Includes the proof of the data.
 **VERIFICATION_PROOF_WITH_SIGNATURE**  2 Proof + Signatures.
======================================= = ===============================
```

#### d_signature_type_t

type of the requested signature 

The enum type contains the following values:

```eval_rst
================== = ======================
 **SIGN_EC_RAW**   0 sign the data directly
 **SIGN_EC_HASH**  1 hash and sign the data
================== = ======================
```

#### in3_filter_type_t

The enum type contains the following values:

```eval_rst
==================== = ============================
 **FILTER_EVENT**    0 Event filter.
 **FILTER_BLOCK**    1 Block filter.
 **FILTER_PENDING**  2 Pending filter (Unsupported)
==================== = ============================
```

#### in3_request_config_t

the configuration as part of each incubed request. 

This will be generated for each request based on the client-configuration. the verifier may access this during verification in order to check against the request. 


The stuct contains following fields:

```eval_rst
=========================================== ========================= ====================================================================
``uint64_t``                                 **chainId**              the chain to be used. 
                                                                      
                                                                      this is holding the integer-value of the hexstring.
``uint8_t``                                  **includeCode**          if true the code needed will always be devlivered.
``uint8_t``                                  **useFullProof**         this flaqg is set, if the proof is set to "PROOF_FULL"
``uint8_t``                                  **useBinary**            this flaqg is set, the client should use binary-format
`bytes_t * <#bytes-t>`_                      **verifiedHashes**       a list of blockhashes already verified. 
                                                                      
                                                                      The Server will not send any proof for them again .
``uint16_t``                                 **verifiedHashesCount**  number of verified blockhashes
``uint16_t``                                 **latestBlock**          the last blocknumber the nodelistz changed
``uint16_t``                                 **finality**             number of signatures( in percent) needed in order to reach finality.
`in3_verification_t <#in3-verification-t>`_  **verification**         Verification-type.
`bytes_t * <#bytes-t>`_                      **clientSignature**      the signature of the client with the client key
`bytes_t * <#bytes-t>`_                      **signatures**           the addresses of servers requested to sign the blockhash
``uint8_t``                                  **signaturesCount**      number or addresses
=========================================== ========================= ====================================================================
```

#### in3_node_t

incubed node-configuration. 

These information are read from the Registry contract and stored in this struct representing a server or node. 


The stuct contains following fields:

```eval_rst
======================= ============== ================================================================================================
``uint32_t``             **index**     index within the nodelist, also used in the contract as key
`bytes_t * <#bytes-t>`_  **address**   address of the server
``uint64_t``             **deposit**   the deposit stored in the registry contract, which this would lose if it sends a wrong blockhash
``uint32_t``             **capacity**  the maximal capacity able to handle
``uint64_t``             **props**     a bit set used to identify the cabalilities of the server.
``char *``               **url**       the url of the node
======================= ============== ================================================================================================
```

#### in3_node_weight_t

Weight or reputation of a node. 

Based on the past performance of the node a weight is calulcated given faster nodes a heigher weight and chance when selecting the next node from the nodelist. These weights will also be stored in the cache (if available) 


The stuct contains following fields:

```eval_rst
============ ========================= ========================================
``float``     **weight**               current weight
``uint32_t``  **response_count**       counter for responses
``uint32_t``  **total_response_time**  total of all response times
``uint64_t``  **blacklistedUntil**     if >0 this node is blacklisted until k. 
                                       
                                       k is a unix timestamp
============ ========================= ========================================
```

#### in3_chain_t

Chain definition inside incubed. 

for incubed a chain can be any distributed network or database with incubed support. 


The stuct contains following fields:

```eval_rst
=========================================== ==================== =================================================================================================================
``uint64_t``                                 **chainId**         chainId, which could be a free or based on the public ethereum networkId
`in3_chain_type_t <#in3-chain-type-t>`_      **type**            chaintype
``uint64_t``                                 **lastBlock**       last blocknumber the nodeList was updated, which is used to detect changed in the nodelist
``bool``                                     **needsUpdate**     if true the nodelist should be updated and will trigger a `in3_nodeList`-request before the next request is send.
``int``                                      **nodeListLength**  number of nodes in the nodeList
`in3_node_t * <#in3-node-t>`_                **nodeList**        array of nodes
`in3_node_weight_t * <#in3-node-weight-t>`_  **weights**         stats and weights recorded for each node
`bytes_t ** <#bytes-t>`_                     **initAddresses**   array of addresses of nodes that should always part of the nodeList
`bytes_t * <#bytes-t>`_                      **contract**        the address of the registry contract
`json_ctx_t * <#json-ctx-t>`_                **spec**            optional chain specification, defining the transaitions and forks
=========================================== ==================== =================================================================================================================
```

#### in3_storage_get_item

storage handler function for reading from cache. 


```c
typedef bytes_t*(* in3_storage_get_item) (void *cptr, char *key)
```

returns: [`bytes_t *(*`](#bytes-t) : the found result. if the key is found this function should return the values as bytes otherwise `NULL`. 




#### in3_storage_set_item

storage handler function for writing to the cache. 


```c
typedef void(* in3_storage_set_item) (void *cptr, char *key, bytes_t *value)
```


#### in3_storage_handler_t

storage handler to handle cache. 


The stuct contains following fields:

```eval_rst
=============================================== ============== ============================================================
`in3_storage_get_item <#in3-storage-get-item>`_  **get_item**  function pointer returning a stored value for the given key.
`in3_storage_set_item <#in3-storage-set-item>`_  **set_item**  function pointer setting a stored value for the given key.
``void *``                                       **cptr**      custom pointer which will will be passed to functions
=============================================== ============== ============================================================
```

#### in3_sign

signing function. 

signs the given data and write the signature to dst. the return value must be the number of bytes written to dst. In case of an error a negativ value must be returned. It should be one of the IN3_SIGN_ERR... values. 


```c
typedef in3_ret_t(* in3_sign) (void *wallet, d_signature_type_t type, bytes_t message, bytes_t account, uint8_t *dst)
```

returns: [`in3_ret_t(*`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_signer_t


The stuct contains following fields:

```eval_rst
======================= ============ 
`in3_sign <#in3-sign>`_  **sign**    
``void *``               **wallet**  
======================= ============ 
```

#### in3_response_t

response-object. 

if the error has a length>0 the response will be rejected 


The stuct contains following fields:

```eval_rst
=============== ============ ==================================
`sb_t <#sb-t>`_  **error**   a stringbuilder to add any errors!
`sb_t <#sb-t>`_  **result**  a stringbuilder to add the result
=============== ============ ==================================
```

#### in3_transport_send

the transport function to be implemented by the transport provider. 


```c
typedef in3_ret_t(* in3_transport_send) (char **urls, int urls_len, char *payload, in3_response_t *results)
```

returns: [`in3_ret_t(*`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_filter_t


The stuct contains following fields:

```eval_rst
========================================= ================ ==========================================================
`in3_filter_type_t <#in3-filter-type-t>`_  **type**        filter type: (event, block or pending)
``char *``                                 **options**     associated filter options
``uint64_t``                               **last_block**  block no. 
                                                           
                                                           when filter was created OR eth_getFilterChanges was called
``void(*``                                 **release**     method to release owned resources
========================================= ================ ==========================================================
```

#### in3_filter_handler_t


The stuct contains following fields:

```eval_rst
================================== =========== ================
`in3_filter_t ** <#in3-filter-t>`_  **array**  
``size_t``                          **count**  array of filters
================================== =========== ================
```

#### in3_t

Incubed Configuration. 

This struct holds the configuration and also point to internal resources such as filters or chain configs. 


The stuct contains following fields:

```eval_rst
=================================================== ======================== =======================================================================================
``uint32_t``                                         **cacheTimeout**        number of seconds requests can be cached.
``uint16_t``                                         **nodeLimit**           the limit of nodes to store in the client.
`bytes_t * <#bytes-t>`_                              **key**                 the client key to sign requests
``uint32_t``                                         **maxCodeCache**        number of max bytes used to cache the code in memory
``uint32_t``                                         **maxBlockCache**       number of number of blocks cached in memory
`in3_proof_t <#in3-proof-t>`_                        **proof**               the type of proof used
``uint8_t``                                          **requestCount**        the number of request send when getting a first answer
``uint8_t``                                          **signatureCount**      the number of signatures used to proof the blockhash.
``uint64_t``                                         **minDeposit**          min stake of the server. 
                                                                             
                                                                             Only nodes owning at least this amount will be chosen.
``uint16_t``                                         **replaceLatestBlock**  if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
``uint16_t``                                         **finality**            the number of signatures in percent required for the request
``uint16_t``                                         **max_attempts**        the max number of attempts before giving up
``uint32_t``                                         **timeout**             specifies the number of milliseconds before the request times out. 
                                                                             
                                                                             increasing may be helpful if the device uses a slow connection.
``uint64_t``                                         **chainId**             servers to filter for the given chain. 
                                                                             
                                                                             The chain-id based on EIP-155.
``uint8_t``                                          **autoUpdateList**      if true the nodelist will be automaticly updated if the lastBlock is newer
`in3_storage_handler_t * <#in3-storage-handler-t>`_  **cacheStorage**        a cache handler offering 2 functions ( setItem(string,string), getItem(string) )
`in3_signer_t * <#in3-signer-t>`_                    **signer**              signer-struct managing a wallet
`in3_transport_send <#in3-transport-send>`_          **transport**           the transporthandler sending requests
``uint8_t``                                          **includeCode**         includes the code when sending eth_call-requests
``uint8_t``                                          **use_binary**          if true the client will use binary format
``uint8_t``                                          **use_http**            if true the client will try to use http instead of https
`in3_chain_t * <#in3-chain-t>`_                      **chains**              chain spec and nodeList definitions
``uint16_t``                                         **chainsCount**         number of configured chains
``uint32_t``                                         **evm_flags**           flags for the evm (EIPs)
`in3_filter_handler_t * <#in3-filter-handler-t>`_    **filters**             filter handler
=================================================== ======================== =======================================================================================
```

#### in3_new

```c
in3_t* in3_new();
```

creates a new Incubes configuration and returns the pointer. 

you need to free this instance with `in3_free` after use!

Before using the client you still need to set the tramsport and optional the storage handlers:

- example of initialization: 

```c
// register verifiers
in3_register_eth_full();

// create new client
in3_t* client = in3_new();

// configure storage...
in3_storage_handler_t storage_handler;
storage_handler.get_item = storage_get_item;
storage_handler.set_item = storage_set_item;

// configure transport
client->transport    = send_curl;

// configure storage
client->cacheStorage = &storage_handler;

// init cache
in3_cache_init(client);

// ready to use ...
```

```eval_rst
  
  
```
returns: [`in3_t *`](#in3-t) : the incubed instance. 




#### in3_client_rpc

```c
in3_ret_t in3_client_rpc(in3_t *c, char *method, char *params, char **result, char **error);
```

sends a request and stores the result in the provided buffer 

arguments:
```eval_rst
=================== ============ ======================================================================================================================================================
`in3_t * <#in3-t>`_  **c**       the pointer to the incubed client config.
``char *``           **method**  the name of the rpc-funcgtion to call.
``char *``           **params**  docs for input parameter v.
``char **``          **result**  pointer to string which will be set if the request was successfull. This will hold the result as json-rpc-string. (make sure you free this after use!)
``char **``          **error**   pointer to a string containg the error-message. (make sure you free it after use!)
=================== ============ ======================================================================================================================================================
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_free

```c
void in3_free(in3_t *a);
```

frees the references of the client 

arguments:
```eval_rst
=================== ======= =================================================
`in3_t * <#in3-t>`_  **a**  the pointer to the incubed client config to free.
=================== ======= =================================================
```

### context.h

Request Context. 

This is used for each request holding request and response-pointers. 

Location: src/core/client/context.h

#### node_weight_t

the weight of a ceertain node as linked list 


The stuct contains following fields:

```eval_rst
=========================================== ============ ===========================================================
`in3_node_t * <#in3-node-t>`_                **node**    the node definition including the url
`in3_node_weight_t * <#in3-node-weight-t>`_  **weight**  the current weight and blacklisting-stats
``float``                                    **s**       The starting value.
``float``                                    **w**       weight value
`weightstruct , * <#weight>`_                **next**    next in the linkedlistt or NULL if this is the last element
=========================================== ============ ===========================================================
```

#### new_ctx

```c
in3_ctx_t* new_ctx(in3_t *client, char *req_data);
```

creates a new context. 

the request data will be parsed and represented in the context. 

arguments:
```eval_rst
=================== ============== 
`in3_t * <#in3-t>`_  **client**    
``char *``           **req_data**  
=================== ============== 
```
returns: [`in3_ctx_t *`](#in3-ctx-t)


#### ctx_parse_response

```c
in3_ret_t ctx_parse_response(in3_ctx_t *ctx, char *response_data, int len);
```

arguments:
```eval_rst
=========================== =================== 
`in3_ctx_t * <#in3-ctx-t>`_  **ctx**            
``char *``                   **response_data**  
``int``                      **len**            
=========================== =================== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### free_ctx

```c
void free_ctx(in3_ctx_t *ctx);
```

arguments:
```eval_rst
=========================== ========= 
`in3_ctx_t * <#in3-ctx-t>`_  **ctx**  
=========================== ========= 
```

#### ctx_create_payload

```c
in3_ret_t ctx_create_payload(in3_ctx_t *c, sb_t *sb);
```

arguments:
```eval_rst
=========================== ======== 
`in3_ctx_t * <#in3-ctx-t>`_  **c**   
`sb_t * <#sb-t>`_            **sb**  
=========================== ======== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### ctx_set_error

```c
in3_ret_t ctx_set_error(in3_ctx_t *c, char *msg, in3_ret_t errnumber);
```

arguments:
```eval_rst
=========================== =============== 
`in3_ctx_t * <#in3-ctx-t>`_  **c**          
``char *``                   **msg**        
`in3_ret_t <#in3-ret-t>`_    **errnumber**  
=========================== =============== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### ctx_get_error

```c
in3_ret_t ctx_get_error(in3_ctx_t *ctx, int id);
```

arguments:
```eval_rst
=========================== ========= 
`in3_ctx_t * <#in3-ctx-t>`_  **ctx**  
``int``                      **id**   
=========================== ========= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_client_rpc_ctx

```c
in3_ctx_t* in3_client_rpc_ctx(in3_t *c, char *method, char *params);
```

sends a request and returns a context used to access the result or errors. 

This context *MUST* be freed with free_ctx(ctx) after usage to release the resources. 

arguments:
```eval_rst
=================== ============ 
`in3_t * <#in3-t>`_  **c**       
``char *``           **method**  
``char *``           **params**  
=================== ============ 
```
returns: [`in3_ctx_t *`](#in3-ctx-t)


#### free_ctx_nodes

```c
void free_ctx_nodes(node_weight_t *c);
```

arguments:
```eval_rst
=================================== ======= 
`node_weight_t * <#node-weight-t>`_  **c**  
=================================== ======= 
```

#### ctx_nodes_len

```c
int ctx_nodes_len(node_weight_t *root);
```

arguments:
```eval_rst
=================================== ========== 
`node_weight_t * <#node-weight-t>`_  **root**  
=================================== ========== 
```
returns: `int`


### nodelist.h

handles nodelists. 

Location: src/core/client/nodelist.h

#### in3_nodelist_clear

```c
void in3_nodelist_clear(in3_chain_t *chain);
```

removes all nodes and their weights from the nodelist 

arguments:
```eval_rst
=============================== =========== 
`in3_chain_t * <#in3-chain-t>`_  **chain**  
=============================== =========== 
```

#### in3_node_list_get

```c
in3_ret_t in3_node_list_get(in3_ctx_t *ctx, uint64_t chain_id, bool update, in3_node_t **nodeList, int *nodeListLength, in3_node_weight_t **weights);
```

check if the nodelist is up to date. 

if not it will fetch a new version first (if the needs_update-flag is set). 

arguments:
```eval_rst
============================================ ==================== 
`in3_ctx_t * <#in3-ctx-t>`_                   **ctx**             
``uint64_t``                                  **chain_id**        
``bool``                                      **update**          
`in3_node_t ** <#in3-node-t>`_                **nodeList**        
``int *``                                     **nodeListLength**  
`in3_node_weight_t ** <#in3-node-weight-t>`_  **weights**         
============================================ ==================== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_node_list_fill_weight

```c
node_weight_t* in3_node_list_fill_weight(in3_t *c, in3_node_t *all_nodes, in3_node_weight_t *weights, int len, _time_t now, float *total_weight, int *total_found);
```

filters and fills the weights on a returned linked list. 

arguments:
```eval_rst
=========================================== ================== 
`in3_t * <#in3-t>`_                          **c**             
`in3_node_t * <#in3-node-t>`_                **all_nodes**     
`in3_node_weight_t * <#in3-node-weight-t>`_  **weights**       
``int``                                      **len**           
``_time_t``                                  **now**           
``float *``                                  **total_weight**  
``int *``                                    **total_found**   
=========================================== ================== 
```
returns: [`node_weight_t *`](#node-weight-t)


#### in3_node_list_pick_nodes

```c
in3_ret_t in3_node_list_pick_nodes(in3_ctx_t *ctx, node_weight_t **nodes);
```

picks (based on the config) a random number of nodes and returns them as weightslist. 

arguments:
```eval_rst
==================================== =========== 
`in3_ctx_t * <#in3-ctx-t>`_           **ctx**    
`node_weight_t ** <#node-weight-t>`_  **nodes**  
==================================== =========== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


### send.h

handles caching and storage. 

handles the request. 

Location: src/core/client/send.h

#### in3_send_ctx

```c
in3_ret_t in3_send_ctx(in3_ctx_t *ctx);
```

executes a request context by picking nodes and sending it. 

arguments:
```eval_rst
=========================== ========= 
`in3_ctx_t * <#in3-ctx-t>`_  **ctx**  
=========================== ========= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


### verifier.h

Verification Context. 

This context is passed to the verifier. 

Location: src/core/client/verifier.h

#### in3_verify

function to verify the result. 


```c
typedef in3_ret_t(* in3_verify) (in3_vctx_t *c)
```

returns: [`in3_ret_t(*`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_pre_handle


```c
typedef in3_ret_t(* in3_pre_handle) (in3_ctx_t *ctx, in3_response_t **response)
```

returns: [`in3_ret_t(*`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_verifier_t


The stuct contains following fields:

```eval_rst
======================================= ================ 
`in3_verify <#in3-verify>`_              **verify**      
``in3_pre_handle``                       **pre_handle**  
`in3_chain_type_t <#in3-chain-type-t>`_  **type**        
`verifierstruct , * <#verifier>`_        **next**        
======================================= ================ 
```

#### in3_get_verifier

```c
in3_verifier_t* in3_get_verifier(in3_chain_type_t type);
```

returns the verifier for the given chainType 

arguments:
```eval_rst
======================================= ========== 
`in3_chain_type_t <#in3-chain-type-t>`_  **type**  
======================================= ========== 
```
returns: [`in3_verifier_t *`](#in3-verifier-t)


#### in3_register_verifier

```c
void in3_register_verifier(in3_verifier_t *verifier);
```

arguments:
```eval_rst
===================================== ============== 
`in3_verifier_t * <#in3-verifier-t>`_  **verifier**  
===================================== ============== 
```

#### vc_err

```c
in3_ret_t vc_err(in3_vctx_t *vc, char *msg);
```

arguments:
```eval_rst
============================= ========= 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**   
``char *``                     **msg**  
============================= ========= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


### bytes.h

util helper on byte arrays. 

Location: src/core/util/bytes.h

#### address_t

pointer to a 20byte address 


```c
typedef uint8_t address_t[20]
```

#### bytes32_t

pointer to a 32byte word 


```c
typedef uint8_t bytes32_t[32]
```

#### wlen_t

number of bytes within a word (min 1byte but usually a uint) 


```c
typedef uint_fast8_t wlen_t
```

#### bytes_t

a byte array 


The stuct contains following fields:

```eval_rst
============= ========== =================================
``uint32_t``   **len**   the length of the array ion bytes
``uint8_t *``  **data**  the byte-data
============= ========== =================================
```

#### b_new

```c
bytes_t* b_new(char *data, int len);
```

allocates a new byte array with 0 filled 

arguments:
```eval_rst
========== ========== 
``char *``  **data**  
``int``     **len**   
========== ========== 
```
returns: [`bytes_t *`](#bytes-t)


#### b_print

```c
void b_print(bytes_t *a);
```

prints a the bytes as hex to stdout 

arguments:
```eval_rst
======================= ======= 
`bytes_t * <#bytes-t>`_  **a**  
======================= ======= 
```

#### ba_print

```c
void ba_print(uint8_t *a, size_t l);
```

prints a the bytes as hex to stdout 

arguments:
```eval_rst
============= ======= 
``uint8_t *``  **a**  
``size_t``     **l**  
============= ======= 
```

#### b_cmp

```c
int b_cmp(bytes_t *a, bytes_t *b);
```

compares 2 byte arrays and returns 1 for equal and 0 for not equal 

arguments:
```eval_rst
======================= ======= 
`bytes_t * <#bytes-t>`_  **a**  
`bytes_t * <#bytes-t>`_  **b**  
======================= ======= 
```
returns: `int`


#### bytes_cmp

```c
int bytes_cmp(bytes_t a, bytes_t b);
```

compares 2 byte arrays and returns 1 for equal and 0 for not equal 

arguments:
```eval_rst
===================== ======= 
`bytes_t <#bytes-t>`_  **a**  
`bytes_t <#bytes-t>`_  **b**  
===================== ======= 
```
returns: `int`


#### b_free

```c
void b_free(bytes_t *a);
```

frees the data 

arguments:
```eval_rst
======================= ======= 
`bytes_t * <#bytes-t>`_  **a**  
======================= ======= 
```

#### b_dup

```c
bytes_t* b_dup(bytes_t *a);
```

clones a byte array 

arguments:
```eval_rst
======================= ======= 
`bytes_t * <#bytes-t>`_  **a**  
======================= ======= 
```
returns: [`bytes_t *`](#bytes-t)


#### b_read_byte

```c
uint8_t b_read_byte(bytes_t *b, size_t *pos);
```

reads a byte on the current position and updates the pos afterwards. 

arguments:
```eval_rst
======================= ========= 
`bytes_t * <#bytes-t>`_  **b**    
``size_t *``             **pos**  
======================= ========= 
```
returns: `uint8_t`


#### b_read_short

```c
uint16_t b_read_short(bytes_t *b, size_t *pos);
```

reads a short on the current position and updates the pos afterwards. 

arguments:
```eval_rst
======================= ========= 
`bytes_t * <#bytes-t>`_  **b**    
``size_t *``             **pos**  
======================= ========= 
```
returns: `uint16_t`


#### b_read_int

```c
uint32_t b_read_int(bytes_t *b, size_t *pos);
```

reads a integer on the current position and updates the pos afterwards. 

arguments:
```eval_rst
======================= ========= 
`bytes_t * <#bytes-t>`_  **b**    
``size_t *``             **pos**  
======================= ========= 
```
returns: `uint32_t`


#### b_read_int_be

```c
uint32_t b_read_int_be(bytes_t *b, size_t *pos, size_t len);
```

reads a unsigned integer as bigendian on the current position and updates the pos afterwards. 

arguments:
```eval_rst
======================= ========= 
`bytes_t * <#bytes-t>`_  **b**    
``size_t *``             **pos**  
``size_t``               **len**  
======================= ========= 
```
returns: `uint32_t`


#### b_read_long

```c
uint64_t b_read_long(bytes_t *b, size_t *pos);
```

reads a long on the current position and updates the pos afterwards. 

arguments:
```eval_rst
======================= ========= 
`bytes_t * <#bytes-t>`_  **b**    
``size_t *``             **pos**  
======================= ========= 
```
returns: `uint64_t`


#### b_new_chars

```c
char* b_new_chars(bytes_t *b, size_t *pos);
```

creates a new string (needs to be freed) on the current position and updates the pos afterwards. 

arguments:
```eval_rst
======================= ========= 
`bytes_t * <#bytes-t>`_  **b**    
``size_t *``             **pos**  
======================= ========= 
```
returns: `char *`


#### b_new_dyn_bytes

```c
bytes_t* b_new_dyn_bytes(bytes_t *b, size_t *pos);
```

reads bytesn (which have the length stored as prefix) on the current position and updates the pos afterwards. 

arguments:
```eval_rst
======================= ========= 
`bytes_t * <#bytes-t>`_  **b**    
``size_t *``             **pos**  
======================= ========= 
```
returns: [`bytes_t *`](#bytes-t)


#### b_new_fixed_bytes

```c
bytes_t* b_new_fixed_bytes(bytes_t *b, size_t *pos, int len);
```

reads bytes with a fixed length on the current position and updates the pos afterwards. 

arguments:
```eval_rst
======================= ========= 
`bytes_t * <#bytes-t>`_  **b**    
``size_t *``             **pos**  
``int``                  **len**  
======================= ========= 
```
returns: [`bytes_t *`](#bytes-t)


#### bb_new

```c
bytes_builder_t* bb_new();
```

```eval_rst
  
  
```
returns: [`bytes_builder_t *`](#bytes-builder-t)


#### bb_free

```c
void bb_free(bytes_builder_t *bb);
```

frees a bytebuilder and its content. 

arguments:
```eval_rst
======================================= ======== 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**  
======================================= ======== 
```

#### bb_check_size

```c
int bb_check_size(bytes_builder_t *bb, size_t len);
```

internal helper to increase the buffer if needed 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
``size_t``                               **len**  
======================================= ========= 
```
returns: `int`


#### bb_write_chars

```c
void bb_write_chars(bytes_builder_t *bb, char *c, int len);
```

writes a string to the builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
``char *``                               **c**    
``int``                                  **len**  
======================================= ========= 
```

#### bb_write_dyn_bytes

```c
void bb_write_dyn_bytes(bytes_builder_t *bb, bytes_t *src);
```

writes bytes to the builder with a prefixed length. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
`bytes_t * <#bytes-t>`_                  **src**  
======================================= ========= 
```

#### bb_write_fixed_bytes

```c
void bb_write_fixed_bytes(bytes_builder_t *bb, bytes_t *src);
```

writes fixed bytes to the builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
`bytes_t * <#bytes-t>`_                  **src**  
======================================= ========= 
```

#### bb_write_int

```c
void bb_write_int(bytes_builder_t *bb, uint32_t val);
```

writes a ineteger to the builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
``uint32_t``                             **val**  
======================================= ========= 
```

#### bb_write_long

```c
void bb_write_long(bytes_builder_t *bb, uint64_t val);
```

writes s long to the builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
``uint64_t``                             **val**  
======================================= ========= 
```

#### bb_write_long_be

```c
void bb_write_long_be(bytes_builder_t *bb, uint64_t val, int len);
```

writes any integer value with the given length of bytes 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
``uint64_t``                             **val**  
``int``                                  **len**  
======================================= ========= 
```

#### bb_write_byte

```c
void bb_write_byte(bytes_builder_t *bb, uint8_t val);
```

writes a single byte to the builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
``uint8_t``                              **val**  
======================================= ========= 
```

#### bb_write_short

```c
void bb_write_short(bytes_builder_t *bb, uint16_t val);
```

writes a short to the builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
``uint16_t``                             **val**  
======================================= ========= 
```

#### bb_write_raw_bytes

```c
void bb_write_raw_bytes(bytes_builder_t *bb, void *ptr, size_t len);
```

writes the bytes to the builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
``void *``                               **ptr**  
``size_t``                               **len**  
======================================= ========= 
```

#### bb_clear

```c
void bb_clear(bytes_builder_t *bb);
```

resets the content of the builder. 

arguments:
```eval_rst
======================================= ======== 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**  
======================================= ======== 
```

#### bb_replace

```c
void bb_replace(bytes_builder_t *bb, int offset, int delete_len, uint8_t *data, int data_len);
```

replaces or deletes a part of the content. 

arguments:
```eval_rst
======================================= ================ 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**          
``int``                                  **offset**      
``int``                                  **delete_len**  
``uint8_t *``                            **data**        
``int``                                  **data_len**    
======================================= ================ 
```

#### bb_move_to_bytes

```c
bytes_t* bb_move_to_bytes(bytes_builder_t *bb);
```

frees the builder and moves the content in a newly created bytes struct (which needs to be freed later). 

arguments:
```eval_rst
======================================= ======== 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**  
======================================= ======== 
```
returns: [`bytes_t *`](#bytes-t)


#### bb_push

```c
void bb_push(bytes_builder_t *bb, uint8_t *data, uint8_t len);
```

arguments:
```eval_rst
======================================= ========== 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**    
``uint8_t *``                            **data**  
``uint8_t``                              **len**   
======================================= ========== 
```

#### bytes

```c
static bytes_t bytes(uint8_t *a, uint32_t len);
```

arguments:
```eval_rst
============= ========= 
``uint8_t *``  **a**    
``uint32_t``   **len**  
============= ========= 
```
returns: [`bytes_t`](#bytes-t)


#### cloned_bytes

```c
bytes_t cloned_bytes(bytes_t data);
```

arguments:
```eval_rst
===================== ========== 
`bytes_t <#bytes-t>`_  **data**  
===================== ========== 
```
returns: [`bytes_t`](#bytes-t)


#### b_optimize_len

```c
static void b_optimize_len(bytes_t *b);
```

arguments:
```eval_rst
======================= ======= 
`bytes_t * <#bytes-t>`_  **b**  
======================= ======= 
```

### data.h

json-parser. 

The parser can read from :

- json
- bin

When reading from json all '0x'... values will be stored as bytes_t. If the value is lower than 0xFFFFFFF, it is converted as integer. 

Location: src/core/util/data.h

#### DATA_DEPTH_MAX

```c
#define DATA_DEPTH_MAX 11
```


#### d_type_t

type of a token. 

The enum type contains the following values:

```eval_rst
=============== = =====================================================
 **T_BYTES**    0 content is stored as data ptr.
 **T_STRING**   1 content is stored a c-str
 **T_ARRAY**    2 the node is an array with the length stored in length
 **T_OBJECT**   3 the node is an object with properties
 **T_BOOLEAN**  4 boolean with the value stored in len
 **T_INTEGER**  5 a integer with the value stored
 **T_NULL**     6 a NULL-value
=============== = =====================================================
```

#### d_key_t


```c
typedef uint16_t d_key_t
```

#### d_token_t

a token holding any kind of value. 

use d_type, d_len or the cast-function to get the value. 


The stuct contains following fields:

```eval_rst
============= ========== =====================================================================
``uint32_t``   **len**   the length of the content (or number of properties) depending + type.
``uint8_t *``  **data**  the byte or string-data
``d_key_t``    **key**   the key of the property.
============= ========== =====================================================================
```

#### str_range_t

internal type used to represent the a range within a string. 


The stuct contains following fields:

```eval_rst
========== ========== ==================================
``char *``  **data**  pointer to the start of the string
``size_t``  **len**   len of the characters
========== ========== ==================================
```

#### json_ctx_t

parser for json or binary-data. 

it needs to freed after usage. 


The stuct contains following fields:

```eval_rst
=========================== =============== ============================================================
`d_token_t * <#d-token-t>`_  **result**     the list of all tokens. 
                                            
                                            the first token is the main-token as returned by the parser.
``size_t``                   **allocated**  
``size_t``                   **len**        amount of tokens allocated result
``size_t``                   **depth**      number of tokens in result
``char *``                   **c**          max depth of tokens in result
=========================== =============== ============================================================
```

#### d_iterator_t

iterator over elements of a array opf object. 

usage: 

```c
for (d_iterator_t iter = d_iter( parent ); iter.left ; d_iter_next(&iter)) {
  uint32_t val = d_int(iter.token);
}
```

The stuct contains following fields:

```eval_rst
=========================== =========== =====================
``int``                      **left**   number of result left
`d_token_t * <#d-token-t>`_  **token**  current token
=========================== =========== =====================
```

#### d_to_bytes

```c
bytes_t d_to_bytes(d_token_t *item);
```

returns the byte-representation of token. 

In case of a number it is returned as bigendian. booleans as 0x01 or 0x00 and NULL as 0x. Objects or arrays will return 0x. 

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
=========================== ========== 
```
returns: [`bytes_t`](#bytes-t)


#### d_bytes_to

```c
int d_bytes_to(d_token_t *item, uint8_t *dst, const int max);
```

writes the byte-representation to the dst. 

details see d_to_bytes. 

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
``uint8_t *``                **dst**   
``const int``                **max**   
=========================== ========== 
```
returns: `int`


#### d_bytes

```c
bytes_t* d_bytes(const d_token_t *item);
```

returns the value as bytes (Carefully, make sure that the token is a bytes-type!) 

arguments:
```eval_rst
================================== ========== 
`d_token_tconst , * <#d-token-t>`_  **item**  
================================== ========== 
```
returns: [`bytes_t *`](#bytes-t)


#### d_bytesl

```c
bytes_t* d_bytesl(d_token_t *item, size_t l);
```

returns the value as bytes with length l (may reallocates) 

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
``size_t``                   **l**     
=========================== ========== 
```
returns: [`bytes_t *`](#bytes-t)


#### d_string

```c
char* d_string(const d_token_t *item);
```

converts the value as string. 

Make sure the type is string! 

arguments:
```eval_rst
================================== ========== 
`d_token_tconst , * <#d-token-t>`_  **item**  
================================== ========== 
```
returns: `char *`


#### d_int

```c
uint32_t d_int(const d_token_t *item);
```

returns the value as integer. 

only if type is integer 

arguments:
```eval_rst
================================== ========== 
`d_token_tconst , * <#d-token-t>`_  **item**  
================================== ========== 
```
returns: `uint32_t`


#### d_intd

```c
uint32_t d_intd(const d_token_t *item, const uint32_t def_val);
```

returns the value as integer or if NULL the default. 

only if type is integer 

arguments:
```eval_rst
================================== ============= 
`d_token_tconst , * <#d-token-t>`_  **item**     
``const uint32_t``                  **def_val**  
================================== ============= 
```
returns: `uint32_t`


#### d_long

```c
uint64_t d_long(const d_token_t *item);
```

returns the value as long. 

only if type is integer or bytes, but short enough 

arguments:
```eval_rst
================================== ========== 
`d_token_tconst , * <#d-token-t>`_  **item**  
================================== ========== 
```
returns: `uint64_t`


#### d_longd

```c
uint64_t d_longd(const d_token_t *item, const uint64_t def_val);
```

returns the value as long or if NULL the default. 

only if type is integer or bytes, but short enough 

arguments:
```eval_rst
================================== ============= 
`d_token_tconst , * <#d-token-t>`_  **item**     
``const uint64_t``                  **def_val**  
================================== ============= 
```
returns: `uint64_t`


#### d_create_bytes_vec

```c
bytes_t** d_create_bytes_vec(const d_token_t *arr);
```

arguments:
```eval_rst
================================== ========= 
`d_token_tconst , * <#d-token-t>`_  **arr**  
================================== ========= 
```
returns: [`bytes_t **`](#bytes-t)


#### d_type

```c
static d_type_t d_type(const d_token_t *item);
```

creates a array of bytes from JOSN-array 

type of the token 

arguments:
```eval_rst
================================== ========== 
`d_token_tconst , * <#d-token-t>`_  **item**  
================================== ========== 
```
returns: [`d_type_t`](#d-type-t)


#### d_len

```c
static int d_len(const d_token_t *item);
```

number of elements in the token (only for object or array, other will return 0) 

arguments:
```eval_rst
================================== ========== 
`d_token_tconst , * <#d-token-t>`_  **item**  
================================== ========== 
```
returns: `int`


#### d_eq

```c
bool d_eq(const d_token_t *a, const d_token_t *b);
```

compares 2 token and if the value is equal 

arguments:
```eval_rst
================================== ======= 
`d_token_tconst , * <#d-token-t>`_  **a**  
`d_token_tconst , * <#d-token-t>`_  **b**  
================================== ======= 
```
returns: `bool`


#### keyn

```c
d_key_t keyn(const char *c, const int len);
```

generates the keyhash for the given stringrange as defined by len 

arguments:
```eval_rst
================ ========= 
``const char *``  **c**    
``const int``     **len**  
================ ========= 
```
returns: `d_key_t`


#### d_get

```c
d_token_t* d_get(d_token_t *item, const uint16_t key);
```

returns the token with the given propertyname (only if item is a object) 

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
``const uint16_t``           **key**   
=========================== ========== 
```
returns: [`d_token_t *`](#d-token-t)


#### d_get_or

```c
d_token_t* d_get_or(d_token_t *item, const uint16_t key1, const uint16_t key2);
```

returns the token with the given propertyname or if not found, tries the other. 

(only if item is a object) 

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
``const uint16_t``           **key1**  
``const uint16_t``           **key2**  
=========================== ========== 
```
returns: [`d_token_t *`](#d-token-t)


#### d_get_at

```c
d_token_t* d_get_at(d_token_t *item, const uint32_t index);
```

returns the token of an array with the given index 

arguments:
```eval_rst
=========================== =========== 
`d_token_t * <#d-token-t>`_  **item**   
``const uint32_t``           **index**  
=========================== =========== 
```
returns: [`d_token_t *`](#d-token-t)


#### d_next

```c
d_token_t* d_next(d_token_t *item);
```

returns the next sibling of an array or object 

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
=========================== ========== 
```
returns: [`d_token_t *`](#d-token-t)


#### d_serialize_binary

```c
void d_serialize_binary(bytes_builder_t *bb, d_token_t *t);
```

write the token as binary data into the builder 

arguments:
```eval_rst
======================================= ======== 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**  
`d_token_t * <#d-token-t>`_              **t**   
======================================= ======== 
```

#### parse_binary

```c
json_ctx_t* parse_binary(bytes_t *data);
```

parses the data and returns the context with the token, which needs to be freed after usage! 

arguments:
```eval_rst
======================= ========== 
`bytes_t * <#bytes-t>`_  **data**  
======================= ========== 
```
returns: [`json_ctx_t *`](#json-ctx-t)


#### parse_binary_str

```c
json_ctx_t* parse_binary_str(char *data, int len);
```

parses the data and returns the context with the token, which needs to be freed after usage! 

arguments:
```eval_rst
========== ========== 
``char *``  **data**  
``int``     **len**   
========== ========== 
```
returns: [`json_ctx_t *`](#json-ctx-t)


#### parse_json

```c
json_ctx_t* parse_json(char *js);
```

parses json-data, which needs to be freed after usage! 

arguments:
```eval_rst
========== ======== 
``char *``  **js**  
========== ======== 
```
returns: [`json_ctx_t *`](#json-ctx-t)


#### free_json

```c
void free_json(json_ctx_t *parser_ctx);
```

frees the parse-context after usage 

arguments:
```eval_rst
============================= ================ 
`json_ctx_t * <#json-ctx-t>`_  **parser_ctx**  
============================= ================ 
```

#### d_to_json

```c
str_range_t d_to_json(d_token_t *item);
```

returns the string for a object or array. 

This only works for json as string. For binary it will not work! 

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
=========================== ========== 
```
returns: [`str_range_t`](#str-range-t)


#### d_create_json

```c
char* d_create_json(d_token_t *item);
```

creates a json-string. 

It does not work for objects if the parsed data were binary! 

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
=========================== ========== 
```
returns: `char *`


#### json_create

```c
json_ctx_t* json_create();
```

```eval_rst
  
  
```
returns: [`json_ctx_t *`](#json-ctx-t)


#### json_create_null

```c
d_token_t* json_create_null(json_ctx_t *jp);
```

arguments:
```eval_rst
============================= ======== 
`json_ctx_t * <#json-ctx-t>`_  **jp**  
============================= ======== 
```
returns: [`d_token_t *`](#d-token-t)


#### json_create_bool

```c
d_token_t* json_create_bool(json_ctx_t *jp, bool value);
```

arguments:
```eval_rst
============================= =========== 
`json_ctx_t * <#json-ctx-t>`_  **jp**     
``bool``                       **value**  
============================= =========== 
```
returns: [`d_token_t *`](#d-token-t)


#### json_create_int

```c
d_token_t* json_create_int(json_ctx_t *jp, uint64_t value);
```

arguments:
```eval_rst
============================= =========== 
`json_ctx_t * <#json-ctx-t>`_  **jp**     
``uint64_t``                   **value**  
============================= =========== 
```
returns: [`d_token_t *`](#d-token-t)


#### json_create_string

```c
d_token_t* json_create_string(json_ctx_t *jp, char *value);
```

arguments:
```eval_rst
============================= =========== 
`json_ctx_t * <#json-ctx-t>`_  **jp**     
``char *``                     **value**  
============================= =========== 
```
returns: [`d_token_t *`](#d-token-t)


#### json_create_bytes

```c
d_token_t* json_create_bytes(json_ctx_t *jp, bytes_t value);
```

arguments:
```eval_rst
============================= =========== 
`json_ctx_t * <#json-ctx-t>`_  **jp**     
`bytes_t <#bytes-t>`_          **value**  
============================= =========== 
```
returns: [`d_token_t *`](#d-token-t)


#### json_create_object

```c
d_token_t* json_create_object(json_ctx_t *jp);
```

arguments:
```eval_rst
============================= ======== 
`json_ctx_t * <#json-ctx-t>`_  **jp**  
============================= ======== 
```
returns: [`d_token_t *`](#d-token-t)


#### json_create_array

```c
d_token_t* json_create_array(json_ctx_t *jp);
```

arguments:
```eval_rst
============================= ======== 
`json_ctx_t * <#json-ctx-t>`_  **jp**  
============================= ======== 
```
returns: [`d_token_t *`](#d-token-t)


#### json_object_add_prop

```c
d_token_t* json_object_add_prop(d_token_t *object, d_key_t key, d_token_t *value);
```

arguments:
```eval_rst
=========================== ============ 
`d_token_t * <#d-token-t>`_  **object**  
``d_key_t``                  **key**     
`d_token_t * <#d-token-t>`_  **value**   
=========================== ============ 
```
returns: [`d_token_t *`](#d-token-t)


#### json_array_add_value

```c
d_token_t* json_array_add_value(d_token_t *object, d_token_t *value);
```

arguments:
```eval_rst
=========================== ============ 
`d_token_t * <#d-token-t>`_  **object**  
`d_token_t * <#d-token-t>`_  **value**   
=========================== ============ 
```
returns: [`d_token_t *`](#d-token-t)


#### json_get_int_value

```c
int json_get_int_value(char *js, char *prop);
```

parses the json and return the value as int. 

arguments:
```eval_rst
========== ========== 
``char *``  **js**    
``char *``  **prop**  
========== ========== 
```
returns: `int`


#### json_get_str_value

```c
void json_get_str_value(char *js, char *prop, char *dst);
```

parses the json and return the value as string. 

arguments:
```eval_rst
========== ========== 
``char *``  **js**    
``char *``  **prop**  
``char *``  **dst**   
========== ========== 
```

#### json_get_json_value

```c
char* json_get_json_value(char *js, char *prop);
```

parses the json and return the value as json-string. 

arguments:
```eval_rst
========== ========== 
``char *``  **js**    
``char *``  **prop**  
========== ========== 
```
returns: `char *`


#### d_get_keystr

```c
char* d_get_keystr(d_key_t k);
```

returns the string for a key. 

This only works track_keynames was activated before! 

arguments:
```eval_rst
=========== ======= 
``d_key_t``  **k**  
=========== ======= 
```
returns: `char *`


#### d_track_keynames

```c
void d_track_keynames(uint8_t v);
```

activates the keyname-cache, which stores the string for the keys when parsing. 

arguments:
```eval_rst
=========== ======= 
``uint8_t``  **v**  
=========== ======= 
```

#### d_clear_keynames

```c
void d_clear_keynames();
```

delete the cached keynames 

```eval_rst
  
  
```

#### key

```c
static d_key_t key(const char *c);
```

arguments:
```eval_rst
================ ======= 
``const char *``  **c**  
================ ======= 
```
returns: `d_key_t`


#### d_get_stringk

```c
static char* d_get_stringk(d_token_t *r, d_key_t k);
```

reads token of a property as string. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``d_key_t``                  **k**  
=========================== ======= 
```
returns: `char *`


#### d_get_string

```c
static char* d_get_string(d_token_t *r, char *k);
```

reads token of a property as string. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``char *``                   **k**  
=========================== ======= 
```
returns: `char *`


#### d_get_string_at

```c
static char* d_get_string_at(d_token_t *r, uint32_t pos);
```

reads string at given pos of an array. 

arguments:
```eval_rst
=========================== ========= 
`d_token_t * <#d-token-t>`_  **r**    
``uint32_t``                 **pos**  
=========================== ========= 
```
returns: `char *`


#### d_get_intk

```c
static uint32_t d_get_intk(d_token_t *r, d_key_t k);
```

reads token of a property as int. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``d_key_t``                  **k**  
=========================== ======= 
```
returns: `uint32_t`


#### d_get_intkd

```c
static uint32_t d_get_intkd(d_token_t *r, d_key_t k, uint32_t d);
```

reads token of a property as int. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``d_key_t``                  **k**  
``uint32_t``                 **d**  
=========================== ======= 
```
returns: `uint32_t`


#### d_get_int

```c
static uint32_t d_get_int(d_token_t *r, char *k);
```

reads token of a property as int. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``char *``                   **k**  
=========================== ======= 
```
returns: `uint32_t`


#### d_get_int_at

```c
static uint32_t d_get_int_at(d_token_t *r, uint32_t pos);
```

reads a int at given pos of an array. 

arguments:
```eval_rst
=========================== ========= 
`d_token_t * <#d-token-t>`_  **r**    
``uint32_t``                 **pos**  
=========================== ========= 
```
returns: `uint32_t`


#### d_get_longk

```c
static uint64_t d_get_longk(d_token_t *r, d_key_t k);
```

reads token of a property as long. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``d_key_t``                  **k**  
=========================== ======= 
```
returns: `uint64_t`


#### d_get_longkd

```c
static uint64_t d_get_longkd(d_token_t *r, d_key_t k, uint64_t d);
```

reads token of a property as long. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``d_key_t``                  **k**  
``uint64_t``                 **d**  
=========================== ======= 
```
returns: `uint64_t`


#### d_get_long

```c
static uint64_t d_get_long(d_token_t *r, char *k);
```

reads token of a property as long. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``char *``                   **k**  
=========================== ======= 
```
returns: `uint64_t`


#### d_get_long_at

```c
static uint64_t d_get_long_at(d_token_t *r, uint32_t pos);
```

reads long at given pos of an array. 

arguments:
```eval_rst
=========================== ========= 
`d_token_t * <#d-token-t>`_  **r**    
``uint32_t``                 **pos**  
=========================== ========= 
```
returns: `uint64_t`


#### d_get_bytesk

```c
static bytes_t* d_get_bytesk(d_token_t *r, d_key_t k);
```

reads token of a property as bytes. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``d_key_t``                  **k**  
=========================== ======= 
```
returns: [`bytes_t *`](#bytes-t)


#### d_get_bytes

```c
static bytes_t* d_get_bytes(d_token_t *r, char *k);
```

reads token of a property as bytes. 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **r**  
``char *``                   **k**  
=========================== ======= 
```
returns: [`bytes_t *`](#bytes-t)


#### d_get_bytes_at

```c
static bytes_t* d_get_bytes_at(d_token_t *r, uint32_t pos);
```

reads bytes at given pos of an array. 

arguments:
```eval_rst
=========================== ========= 
`d_token_t * <#d-token-t>`_  **r**    
``uint32_t``                 **pos**  
=========================== ========= 
```
returns: [`bytes_t *`](#bytes-t)


#### d_is_binary_ctx

```c
static bool d_is_binary_ctx(json_ctx_t *ctx);
```

check if the parser context was created from binary data. 

arguments:
```eval_rst
============================= ========= 
`json_ctx_t * <#json-ctx-t>`_  **ctx**  
============================= ========= 
```
returns: `bool`


#### d_get_byteskl

```c
bytes_t* d_get_byteskl(d_token_t *r, d_key_t k, uint32_t minl);
```

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **r**     
``d_key_t``                  **k**     
``uint32_t``                 **minl**  
=========================== ========== 
```
returns: [`bytes_t *`](#bytes-t)


#### d_getl

```c
d_token_t* d_getl(d_token_t *item, uint16_t k, uint32_t minl);
```

arguments:
```eval_rst
=========================== ========== 
`d_token_t * <#d-token-t>`_  **item**  
``uint16_t``                 **k**     
``uint32_t``                 **minl**  
=========================== ========== 
```
returns: [`d_token_t *`](#d-token-t)


#### d_iter

```c
static d_iterator_t d_iter(d_token_t *parent);
```

creates a iterator for a object or array 

arguments:
```eval_rst
=========================== ============ 
`d_token_t * <#d-token-t>`_  **parent**  
=========================== ============ 
```
returns: [`d_iterator_t`](#d-iterator-t)


#### d_iter_next

```c
static bool d_iter_next(d_iterator_t *const iter);
```

fetched the next token an returns a boolean indicating whther there is a next or not. 

arguments:
```eval_rst
====================================== ========== 
`d_iterator_t *const <#d-iterator-t>`_  **iter**  
====================================== ========== 
```
returns: `bool`


### debug.h

logs debug data only if the DEBUG-flag is set. 

Location: src/core/util/debug.h

#### dbg_log (msg,...)


#### dbg_log_raw (msg,...)


### error.h

defines the return-values of a function call. 

Location: src/core/util/error.h

#### in3_ret_t

ERROR types used as return values. 

All values (except IN3_OK) indicate an error. 

The enum type contains the following values:

```eval_rst
================== === ============================================================
 **IN3_OK**        0   Success.
 **IN3_EUNKNOWN**  -1  Unknown error - usually accompanied with specific error msg.
 **IN3_ENOMEM**    -2  No memory.
 **IN3_ENOTSUP**   -3  Not supported.
 **IN3_EINVAL**    -4  Invalid value.
 **IN3_EFIND**     -5  Not found.
 **IN3_ECONFIG**   -6  Invalid config.
 **IN3_ELIMIT**    -7  Limit reached.
 **IN3_EVERS**     -8  Version mismatch.
 **IN3_EINVALDT**  -9  Data invalid, eg. 
                       
                       invalid/incomplete JSON
 **IN3_EPASS**     -10 Wrong password.
 **IN3_ERPC**      -11 RPC error (i.e. 
                       
                       in3_ctx_t::error set)
 **IN3_ERPCNRES**  -12 RPC no response.
 **IN3_EUSNURL**   -13 USN URL parse error.
 **IN3_ETRANS**    -14 Transport error.
================== === ============================================================
```

### scache.h

util helper on byte arrays. 

Location: src/core/util/scache.h

#### cache_entry_t


The stuct contains following fields:

```eval_rst
======================================= =============== 
`bytes_t <#bytes-t>`_                    **key**        
`bytes_t <#bytes-t>`_                    **value**      
``uint8_t``                              **must_free**  
``uint8_t``                              **buffer**     
`cache_entrystruct , * <#cache-entry>`_  **next**       
======================================= =============== 
```

#### in3_cache_get_entry

```c
bytes_t* in3_cache_get_entry(cache_entry_t *cache, bytes_t *key);
```

arguments:
```eval_rst
=================================== =========== 
`cache_entry_t * <#cache-entry-t>`_  **cache**  
`bytes_t * <#bytes-t>`_              **key**    
=================================== =========== 
```
returns: [`bytes_t *`](#bytes-t)


#### in3_cache_add_entry

```c
cache_entry_t* in3_cache_add_entry(cache_entry_t *cache, bytes_t key, bytes_t value);
```

arguments:
```eval_rst
=================================== =========== 
`cache_entry_t * <#cache-entry-t>`_  **cache**  
`bytes_t <#bytes-t>`_                **key**    
`bytes_t <#bytes-t>`_                **value**  
=================================== =========== 
```
returns: [`cache_entry_t *`](#cache-entry-t)


#### in3_cache_free

```c
void in3_cache_free(cache_entry_t *cache);
```

arguments:
```eval_rst
=================================== =========== 
`cache_entry_t * <#cache-entry-t>`_  **cache**  
=================================== =========== 
```

### stringbuilder.h

simple string buffer used to dynamicly add content. 

Location: src/core/util/stringbuilder.h

#### sb_add_hexuint (sb,i)

```c
#define sb_add_hexuint (sb,i) sb_add_hexuint_l(sb, i, sizeof(i))
```


#### sb_t


The stuct contains following fields:

```eval_rst
========== ============== 
``char *``  **data**      
``size_t``  **allocted**  
``size_t``  **len**       
========== ============== 
```

#### sb_new

```c
sb_t* sb_new(char *chars);
```

arguments:
```eval_rst
========== =========== 
``char *``  **chars**  
========== =========== 
```
returns: [`sb_t *`](#sb-t)


#### sb_init

```c
sb_t* sb_init(sb_t *sb);
```

arguments:
```eval_rst
================= ======== 
`sb_t * <#sb-t>`_  **sb**  
================= ======== 
```
returns: [`sb_t *`](#sb-t)


#### sb_free

```c
void sb_free(sb_t *sb);
```

arguments:
```eval_rst
================= ======== 
`sb_t * <#sb-t>`_  **sb**  
================= ======== 
```

#### sb_add_char

```c
sb_t* sb_add_char(sb_t *sb, char c);
```

arguments:
```eval_rst
================= ======== 
`sb_t * <#sb-t>`_  **sb**  
``char``           **c**   
================= ======== 
```
returns: [`sb_t *`](#sb-t)


#### sb_add_chars

```c
sb_t* sb_add_chars(sb_t *sb, char *chars);
```

arguments:
```eval_rst
================= =========== 
`sb_t * <#sb-t>`_  **sb**     
``char *``         **chars**  
================= =========== 
```
returns: [`sb_t *`](#sb-t)


#### sb_add_range

```c
sb_t* sb_add_range(sb_t *sb, char *chars, int start, int len);
```

arguments:
```eval_rst
================= =========== 
`sb_t * <#sb-t>`_  **sb**     
``char *``         **chars**  
``int``            **start**  
``int``            **len**    
================= =========== 
```
returns: [`sb_t *`](#sb-t)


#### sb_add_key_value

```c
sb_t* sb_add_key_value(sb_t *sb, char *key, char *value, int lv, bool as_string);
```

arguments:
```eval_rst
================= =============== 
`sb_t * <#sb-t>`_  **sb**         
``char *``         **key**        
``char *``         **value**      
``int``            **lv**         
``bool``           **as_string**  
================= =============== 
```
returns: [`sb_t *`](#sb-t)


#### sb_add_bytes

```c
sb_t* sb_add_bytes(sb_t *sb, char *prefix, bytes_t *bytes, int len, bool as_array);
```

arguments:
```eval_rst
======================= ============== 
`sb_t * <#sb-t>`_        **sb**        
``char *``               **prefix**    
`bytes_t * <#bytes-t>`_  **bytes**     
``int``                  **len**       
``bool``                 **as_array**  
======================= ============== 
```
returns: [`sb_t *`](#sb-t)


#### sb_add_hexuint_l

```c
sb_t* sb_add_hexuint_l(sb_t *sb, uintmax_t uint, size_t l);
```

Other types not supported 

arguments:
```eval_rst
================= ========== 
`sb_t * <#sb-t>`_  **sb**    
``uintmax_t``      **uint**  
``size_t``         **l**     
================= ========== 
```
returns: [`sb_t *`](#sb-t)


### utils.h

utility functions. 

Location: src/core/util/utils.h

#### SWAP (a,b)

```c
#define SWAP (a,b) {                \
    void* p = a;   \
    a       = b;   \
    b       = p;   \
  }
```


#### min (a,b)

```c
#define min (a,b) ((a) < (b) ? (a) : (b))
```


#### max (a,b)

```c
#define max (a,b) ((a) > (b) ? (a) : (b))
```


#### optimize_len (a,l)

```c
#define optimize_len (a,l) while (l > 1 && *a == 0) { \
    l--;                     \
    a++;                     \
  }
```


#### TRY (exp)

```c
#define TRY (exp) {                        \
    int _r = (exp);        \
    if (_r < 0) return _r; \
  }
```


#### TRY_SET (var,exp)

```c
#define TRY_SET (var,exp) {                          \
    var = (exp);             \
    if (var < 0) return var; \
  }
```


#### TRY_GOTO (exp)

```c
#define TRY_GOTO (exp) {                          \
    res = (exp);             \
    if (res < 0) goto clean; \
  }
```


#### pb_size_t


```c
typedef uint32_t pb_size_t
```

#### pb_byte_t


```c
typedef uint_least8_t pb_byte_t
```

#### bytes_to_long

```c
uint64_t bytes_to_long(uint8_t *data, int len);
```

converts the bytes to a unsigned long (at least the last max len bytes) 

arguments:
```eval_rst
============= ========== 
``uint8_t *``  **data**  
``int``        **len**   
============= ========== 
```
returns: `uint64_t`


#### bytes_to_int

```c
static uint32_t bytes_to_int(uint8_t *data, int len);
```

converts the bytes to a unsigned int (at least the last max len bytes) 

arguments:
```eval_rst
============= ========== 
``uint8_t *``  **data**  
``int``        **len**   
============= ========== 
```
returns: `uint32_t`


#### c_to_long

```c
uint64_t c_to_long(char *a, int l);
```

converts a character into a uint64_t 

arguments:
```eval_rst
========== ======= 
``char *``  **a**  
``int``     **l**  
========== ======= 
```
returns: `uint64_t`


#### size_of_bytes

```c
int size_of_bytes(int str_len);
```

the number of bytes used for a conerting a hex into bytes. 

arguments:
```eval_rst
======= ============= 
``int``  **str_len**  
======= ============= 
```
returns: `int`


#### strtohex

```c
uint8_t strtohex(char c);
```

converts a hexchar to byte (4bit) 

arguments:
```eval_rst
======== ======= 
``char``  **c**  
======== ======= 
```
returns: `uint8_t`


#### hex2byte_arr

```c
int hex2byte_arr(char *buf, int len, uint8_t *out, int outbuf_size);
```

convert a c string to a byte array storing it into a existing buffer 

arguments:
```eval_rst
============= ================= 
``char *``     **buf**          
``int``        **len**          
``uint8_t *``  **out**          
``int``        **outbuf_size**  
============= ================= 
```
returns: `int`


#### hex2byte_new_bytes

```c
bytes_t* hex2byte_new_bytes(char *buf, int len);
```

convert a c string to a byte array creating a new buffer 

arguments:
```eval_rst
========== ========= 
``char *``  **buf**  
``int``     **len**  
========== ========= 
```
returns: [`bytes_t *`](#bytes-t)


#### bytes_to_hex

```c
int bytes_to_hex(uint8_t *buffer, int len, char *out);
```

convefrts a bytes into hex 

arguments:
```eval_rst
============= ============ 
``uint8_t *``  **buffer**  
``int``        **len**     
``char *``     **out**     
============= ============ 
```
returns: `int`


#### sha3

```c
bytes_t* sha3(bytes_t *data);
```

hashes the bytes and creates a new bytes_t 

arguments:
```eval_rst
======================= ========== 
`bytes_t * <#bytes-t>`_  **data**  
======================= ========== 
```
returns: [`bytes_t *`](#bytes-t)


#### sha3_to

```c
int sha3_to(bytes_t *data, void *dst);
```

writes 32 bytes to the pointer. 

arguments:
```eval_rst
======================= ========== 
`bytes_t * <#bytes-t>`_  **data**  
``void *``               **dst**   
======================= ========== 
```
returns: `int`


#### long_to_bytes

```c
void long_to_bytes(uint64_t val, uint8_t *dst);
```

converts a long to 8 bytes 

arguments:
```eval_rst
============= ========= 
``uint64_t``   **val**  
``uint8_t *``  **dst**  
============= ========= 
```

#### int_to_bytes

```c
void int_to_bytes(uint32_t val, uint8_t *dst);
```

converts a int to 4 bytes 

arguments:
```eval_rst
============= ========= 
``uint32_t``   **val**  
``uint8_t *``  **dst**  
============= ========= 
```

#### hash_cmp

```c
int hash_cmp(uint8_t *a, uint8_t *b);
```

compares 32 bytes and returns 0 if equal 

arguments:
```eval_rst
============= ======= 
``uint8_t *``  **a**  
``uint8_t *``  **b**  
============= ======= 
```
returns: `int`


#### _strdupn

```c
char* _strdupn(char *src, int len);
```

duplicate the string 

arguments:
```eval_rst
========== ========= 
``char *``  **src**  
``int``     **len**  
========== ========= 
```
returns: `char *`


#### min_bytes_len

```c
int min_bytes_len(uint64_t val);
```

calculate the min number of byte to represents the len 

arguments:
```eval_rst
============ ========= 
``uint64_t``  **val**  
============ ========= 
```
returns: `int`


## Module eth_api 


static lib

### eth_api.h

Ethereum API. 

This header-file defines easy to use function, which are preparing the JSON-RPC-Request, which is then executed and verified by the incubed-client. 

Location: src/eth_api/eth_api.h

#### eth_tx_t

a transaction 


The stuct contains following fields:

```eval_rst
========================= ======================= =========================================
`bytes32_t <#bytes32-t>`_  **hash**               the blockhash
`bytes32_t <#bytes32-t>`_  **block_hash**         hash of ther containnig block
``uint64_t``               **block_number**       number of the containing block
`address_t <#address-t>`_  **from**               sender of the tx
``uint64_t``               **gas**                gas send along
``uint64_t``               **gas_price**          gas price used
`bytes_t <#bytes-t>`_      **data**               data send along with the transaction
``uint64_t``               **nonce**              nonce of the transaction
`address_t <#address-t>`_  **to**                 receiver of the address 0x0000. 
                                                  
                                                  . -Address is used for contract creation.
`uint256_t <#uint256-t>`_  **value**              the value in wei send
``int``                    **transaction_index**  the transaction index
``uint8_t``                **signature**          signature of the transaction
========================= ======================= =========================================
```

#### eth_block_t

a Ethereum Block 


The stuct contains following fields:

```eval_rst
=========================== ======================= ====================================================
``uint64_t``                 **number**             the blockNumber
`bytes32_t <#bytes32-t>`_    **hash**               the blockhash
``uint64_t``                 **gasUsed**            gas used by all the transactions
``uint64_t``                 **gasLimit**           gasLimit
`address_t <#address-t>`_    **author**             the author of the block.
`uint256_t <#uint256-t>`_    **difficulty**         the difficulty of the block.
`bytes_t <#bytes-t>`_        **extra_data**         the extra_data of the block.
``uint8_t``                  **logsBloom**          the logsBloom-data
`bytes32_t <#bytes32-t>`_    **parent_hash**        the hash of the parent-block
`bytes32_t <#bytes32-t>`_    **sha3_uncles**        root hash of the uncle-trie
`bytes32_t <#bytes32-t>`_    **state_root**         root hash of the state-trie
`bytes32_t <#bytes32-t>`_    **receipts_root**      root of the receipts trie
`bytes32_t <#bytes32-t>`_    **transaction_root**   root of the transaction trie
``int``                      **tx_count**           number of transactions in the block
`eth_tx_t * <#eth-tx-t>`_    **tx_data**            array of transaction data or NULL if not requested
`bytes32_t * <#bytes32-t>`_  **tx_hashes**          array of transaction hashes or NULL if not requested
``uint64_t``                 **timestamp**          the unix timestamp of the block
`bytes_t * <#bytes-t>`_      **seal_fields**        sealed fields
``int``                      **seal_fields_count**  number of seal fields
=========================== ======================= ====================================================
```

#### eth_log_t

a linked list of Ethereum Logs 


The stuct contains following fields:

```eval_rst
=============================== ======================= ==============================================================
``bool``                         **removed**            true when the log was removed, due to a chain reorganization. 
                                                        
                                                        false if its a valid log
``size_t``                       **log_index**          log index position in the block
``size_t``                       **transaction_index**  transactions index position log was created from
`bytes32_t <#bytes32-t>`_        **transaction_hash**   hash of the transactions this log was created from
`bytes32_t <#bytes32-t>`_        **block_hash**         hash of the block where this log was in
``uint64_t``                     **block_number**       the block number where this log was in
`address_t <#address-t>`_        **address**            address from which this log originated
`bytes_t <#bytes-t>`_            **data**               non-indexed arguments of the log
`bytes32_t * <#bytes32-t>`_      **topics**             array of 0 to 4 32 Bytes DATA of indexed log arguments
``size_t``                       **topic_count**        counter for topics
`eth_logstruct , * <#eth-log>`_  **next**               pointer to next log in list or NULL
=============================== ======================= ==============================================================
```

#### eth_getStorageAt

```c
uint256_t eth_getStorageAt(in3_t *in3, address_t account, bytes32_t key, uint64_t block);
```

returns the storage value of a given address. 

arguments:
```eval_rst
========================= ============= 
`in3_t * <#in3-t>`_        **in3**      
`address_t <#address-t>`_  **account**  
`bytes32_t <#bytes32-t>`_  **key**      
``uint64_t``               **block**    
========================= ============= 
```
returns: [`uint256_t`](#uint256-t)


#### eth_getCode

```c
bytes_t eth_getCode(in3_t *in3, address_t account, uint64_t block);
```

returns the code of the account of given address. 

(Make sure you free the data-point of the result after use.) 

arguments:
```eval_rst
========================= ============= 
`in3_t * <#in3-t>`_        **in3**      
`address_t <#address-t>`_  **account**  
``uint64_t``               **block**    
========================= ============= 
```
returns: [`bytes_t`](#bytes-t)


#### eth_getBalance

```c
uint256_t eth_getBalance(in3_t *in3, address_t account, uint64_t block);
```

returns the balance of the account of given address. 

arguments:
```eval_rst
========================= ============= 
`in3_t * <#in3-t>`_        **in3**      
`address_t <#address-t>`_  **account**  
``uint64_t``               **block**    
========================= ============= 
```
returns: [`uint256_t`](#uint256-t)


#### eth_blockNumber

```c
uint64_t eth_blockNumber(in3_t *in3);
```

returns the current price per gas in wei. 

arguments:
```eval_rst
=================== ========= 
`in3_t * <#in3-t>`_  **in3**  
=================== ========= 
```
returns: `uint64_t`


#### eth_gasPrice

```c
uint64_t eth_gasPrice(in3_t *in3);
```

returns the current blockNumber, if bn==0 an error occured and you should check 

arguments:
```eval_rst
=================== ========= 
`in3_t * <#in3-t>`_  **in3**  
=================== ========= 
```
returns: `uint64_t`


#### eth_getBlockByNumber

```c
eth_block_t* eth_getBlockByNumber(in3_t *in3, uint64_t number, bool include_tx);
```

returns the block for the given number (if number==0, the latest will be returned). 

If result is null, check ,! otherwise make sure to free the result after using it! 

arguments:
```eval_rst
=================== ================ 
`in3_t * <#in3-t>`_  **in3**         
``uint64_t``         **number**      
``bool``             **include_tx**  
=================== ================ 
```
returns: [`eth_block_t *`](#eth-block-t)


#### eth_getBlockByHash

```c
eth_block_t* eth_getBlockByHash(in3_t *in3, bytes32_t hash, bool include_tx);
```

returns the block for the given hash. 

If result is null, check ,! otherwise make sure to free the result after using it! 

arguments:
```eval_rst
========================= ================ 
`in3_t * <#in3-t>`_        **in3**         
`bytes32_t <#bytes32-t>`_  **hash**        
``bool``                   **include_tx**  
========================= ================ 
```
returns: [`eth_block_t *`](#eth-block-t)


#### eth_getLogs

```c
eth_log_t* eth_getLogs(in3_t *in3, char *fopt);
```

returns a linked list of logs. 

If result is null, check ,! otherwise make sure to free the log, its topics and data after using it! 

arguments:
```eval_rst
=================== ========== 
`in3_t * <#in3-t>`_  **in3**   
``char *``           **fopt**  
=================== ========== 
```
returns: [`eth_log_t *`](#eth-log-t)


#### eth_call_fn

```c
json_ctx_t* eth_call_fn(in3_t *in3, address_t contract, char *fn_sig,...);
```

returns the result of a function_call. 

If result is null, check ,! otherwise make sure to free the result after using it with ,! 

arguments:
```eval_rst
========================= ============== 
`in3_t * <#in3-t>`_        **in3**       
`address_t <#address-t>`_  **contract**  
``char *``                 **fn_sig**    
``...``                                  
========================= ============== 
```
returns: [`json_ctx_t *`](#json-ctx-t)


#### eth_wait_for_receipt

```c
char* eth_wait_for_receipt(in3_t *in3, bytes32_t tx_hash);
```

arguments:
```eval_rst
========================= ============= 
`in3_t * <#in3-t>`_        **in3**      
`bytes32_t <#bytes32-t>`_  **tx_hash**  
========================= ============= 
```
returns: `char *`


#### eth_newFilter

```c
in3_ret_t eth_newFilter(in3_t *in3, json_ctx_t *options);
```

arguments:
```eval_rst
============================= ============= 
`in3_t * <#in3-t>`_            **in3**      
`json_ctx_t * <#json-ctx-t>`_  **options**  
============================= ============= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_newBlockFilter

```c
in3_ret_t eth_newBlockFilter(in3_t *in3);
```

creates a new block filter with specified options and returns its id (>0) on success or 0 on failure 

arguments:
```eval_rst
=================== ========= 
`in3_t * <#in3-t>`_  **in3**  
=================== ========= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_newPendingTransactionFilter

```c
in3_ret_t eth_newPendingTransactionFilter(in3_t *in3);
```

creates a new pending txn filter with specified options and returns its id on success or 0 on failure 

arguments:
```eval_rst
=================== ========= 
`in3_t * <#in3-t>`_  **in3**  
=================== ========= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_uninstallFilter

```c
bool eth_uninstallFilter(in3_t *in3, size_t id);
```

uninstalls a filter and returns true on success or false on failure 

arguments:
```eval_rst
=================== ========= 
`in3_t * <#in3-t>`_  **in3**  
``size_t``           **id**   
=================== ========= 
```
returns: `bool`


#### eth_getFilterChanges

```c
in3_ret_t eth_getFilterChanges(in3_t *in3, size_t id, bytes32_t **block_hashes, eth_log_t **logs);
```

sets the logs (for event filter) or blockhashes (for block filter) that match a filter; returns <0 on error, otherwise no. 

of block hashes matched (for block filter) or 0 (for log filer) 

arguments:
```eval_rst
============================ ================== 
`in3_t * <#in3-t>`_           **in3**           
``size_t``                    **id**            
`bytes32_t ** <#bytes32-t>`_  **block_hashes**  
`eth_log_t ** <#eth-log-t>`_  **logs**          
============================ ================== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_last_error

```c
char* eth_last_error();
```

the current error or null if all is ok 

```eval_rst
  
  
```
returns: `char *`


#### as_double

```c
long double as_double(uint256_t d);
```

converts a , in a long double. 

Important: since a long double stores max 16 byte, there is no garantee to have the full precision.

converts a , in a long double. 

arguments:
```eval_rst
========================= ======= 
`uint256_t <#uint256-t>`_  **d**  
========================= ======= 
```
returns: `long double`


#### as_long

```c
uint64_t as_long(uint256_t d);
```

converts a , in a long . 

Important: since a long double stores 8 byte, this will only use the last 8 byte of the value.

converts a , in a long . 

arguments:
```eval_rst
========================= ======= 
`uint256_t <#uint256-t>`_  **d**  
========================= ======= 
```
returns: `uint64_t`


#### to_uint256

```c
uint256_t to_uint256(uint64_t value);
```

arguments:
```eval_rst
============ =========== 
``uint64_t``  **value**  
============ =========== 
```
returns: [`uint256_t`](#uint256-t)


#### decrypt_key

```c
in3_ret_t decrypt_key(d_token_t *key_data, char *password, bytes32_t dst);
```

arguments:
```eval_rst
=========================== ============== 
`d_token_t * <#d-token-t>`_  **key_data**  
``char *``                   **password**  
`bytes32_t <#bytes32-t>`_    **dst**       
=========================== ============== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### free_log

```c
void free_log(eth_log_t *log);
```

arguments:
```eval_rst
=========================== ========= 
`eth_log_t * <#eth-log-t>`_  **log**  
=========================== ========= 
```

## Module eth_basic 


static lib

### eth_basic.h

Ethereum Nanon verification. 

Location: src/eth_basic/eth_basic.h

#### in3_verify_eth_basic

```c
in3_ret_t in3_verify_eth_basic(in3_vctx_t *v);
```

entry-function to execute the verification context. 

arguments:
```eval_rst
============================= ======= 
`in3_vctx_t * <#in3-vctx-t>`_  **v**  
============================= ======= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_verify_tx_values

```c
in3_ret_t eth_verify_tx_values(in3_vctx_t *vc, d_token_t *tx, bytes_t *raw);
```

verifies internal tx-values. 

arguments:
```eval_rst
============================= ========= 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**   
`d_token_t * <#d-token-t>`_    **tx**   
`bytes_t * <#bytes-t>`_        **raw**  
============================= ========= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_verify_eth_getTransaction

```c
in3_ret_t eth_verify_eth_getTransaction(in3_vctx_t *vc, bytes_t *tx_hash);
```

verifies a transaction. 

arguments:
```eval_rst
============================= ============= 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**       
`bytes_t * <#bytes-t>`_        **tx_hash**  
============================= ============= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_verify_account_proof

```c
in3_ret_t eth_verify_account_proof(in3_vctx_t *vc);
```

verify account-proofs 

arguments:
```eval_rst
============================= ======== 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**  
============================= ======== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_verify_eth_getBlock

```c
in3_ret_t eth_verify_eth_getBlock(in3_vctx_t *vc, bytes_t *block_hash, uint64_t blockNumber);
```

verifies a block 

arguments:
```eval_rst
============================= ================= 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**           
`bytes_t * <#bytes-t>`_        **block_hash**   
``uint64_t``                   **blockNumber**  
============================= ================= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_register_eth_basic

```c
void in3_register_eth_basic();
```

this function should only be called once and will register the eth-nano verifier. 

```eval_rst
  
  
```

#### eth_verify_eth_getLog

```c
in3_ret_t eth_verify_eth_getLog(in3_vctx_t *vc, int l_logs);
```

verify logs 

arguments:
```eval_rst
============================= ============ 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**      
``int``                        **l_logs**  
============================= ============ 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_handle_intern

```c
in3_ret_t eth_handle_intern(in3_ctx_t *ctx, in3_response_t **response);
```

this is called before a request is send 

arguments:
```eval_rst
====================================== ============== 
`in3_ctx_t * <#in3-ctx-t>`_             **ctx**       
`in3_response_t ** <#in3-response-t>`_  **response**  
====================================== ============== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


### signer.h

Ethereum Nanon verification. 

Location: src/eth_basic/signer.h

#### eth_sign

```c
in3_ret_t eth_sign(void *pk, d_signature_type_t type, bytes_t message, bytes_t account, uint8_t *dst);
```

signs the given data 

arguments:
```eval_rst
=========================================== ============= 
``void *``                                   **pk**       
`d_signature_type_t <#d-signature-type-t>`_  **type**     
`bytes_t <#bytes-t>`_                        **message**  
`bytes_t <#bytes-t>`_                        **account**  
``uint8_t *``                                **dst**      
=========================================== ============= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_set_pk_signer

```c
in3_ret_t eth_set_pk_signer(in3_t *in3, bytes32_t pk);
```

sets the signer and a pk to the client 

arguments:
```eval_rst
========================= ========= 
`in3_t * <#in3-t>`_        **in3**  
`bytes32_t <#bytes32-t>`_  **pk**   
========================= ========= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### sign_tx

```c
bytes_t sign_tx(d_token_t *tx, in3_ctx_t *ctx);
```

arguments:
```eval_rst
=========================== ========= 
`d_token_t * <#d-token-t>`_  **tx**   
`in3_ctx_t * <#in3-ctx-t>`_  **ctx**  
=========================== ========= 
```
returns: [`bytes_t`](#bytes-t)


### trie.h

Patricia Merkle Tree Imnpl. 

Location: src/eth_basic/trie.h

#### trie_node_type_t

Node types. 

The enum type contains the following values:

```eval_rst
================= = ============================
 **NODE_EMPTY**   0 empty node
 **NODE_BRANCH**  1 a Branch
 **NODE_LEAF**    2 a leaf containing the value.
 **NODE_EXT**     3 a extension
================= = ============================
```

#### in3_hasher_t

hash-function 


```c
typedef void(* in3_hasher_t) (bytes_t *src, uint8_t *dst)
```


#### in3_codec_add_t

codec to organize the encoding of the nodes 


```c
typedef void(* in3_codec_add_t) (bytes_builder_t *bb, bytes_t *val)
```


#### in3_codec_finish_t


```c
typedef void(* in3_codec_finish_t) (bytes_builder_t *bb, bytes_t *dst)
```


#### in3_codec_decode_size_t


```c
typedef int(* in3_codec_decode_size_t) (bytes_t *src)
```

returns: `int(*`


#### in3_codec_decode_index_t


```c
typedef int(* in3_codec_decode_index_t) (bytes_t *src, int index, bytes_t *dst)
```

returns: `int(*`


#### trie_node_t

single node in the merkle trie. 


The stuct contains following fields:

```eval_rst
======================================= ================ ===============================================
``uint8_t``                              **hash**        the hash of the node
`bytes_t <#bytes-t>`_                    **data**        the raw data
`bytes_t <#bytes-t>`_                    **items**       the data as list
``uint8_t``                              **own_memory**  if true this is a embedded node with own memory
`trie_node_type_t <#trie-node-type-t>`_  **type**        type of the node
`trie_nodestruct , * <#trie-node>`_      **next**        used as linked list
======================================= ================ ===============================================
```

#### trie_codec_t

the codec used to encode nodes. 


The stuct contains following fields:

```eval_rst
===================================== =================== 
`in3_codec_add_t <#in3-codec-add-t>`_  **encode_add**     
``in3_codec_finish_t``                 **encode_finish**  
``in3_codec_decode_size_t``            **decode_size**    
``in3_codec_decode_index_t``           **decode_item**    
===================================== =================== 
```

#### trie_t

a merkle trie implementation. 

This is a Patricia Merkle Tree. 


The stuct contains following fields:

```eval_rst
================================= ============ ==============================
`in3_hasher_t <#in3-hasher-t>`_    **hasher**  hash-function.
`trie_codec_t * <#trie-codec-t>`_  **codec**   encoding of the nocds.
``uint8_t``                        **root**    The root-hash.
`trie_node_t * <#trie-node-t>`_    **nodes**   linked list of containes nodes
================================= ============ ==============================
```

#### trie_new

```c
trie_t* trie_new();
```

creates a new Merkle Trie. 

```eval_rst
  
  
```
returns: [`trie_t *`](#trie-t)


#### trie_free

```c
void trie_free(trie_t *val);
```

frees all resources of the trie. 

arguments:
```eval_rst
===================== ========= 
`trie_t * <#trie-t>`_  **val**  
===================== ========= 
```

#### trie_set_value

```c
void trie_set_value(trie_t *t, bytes_t *key, bytes_t *value);
```

sets a value in the trie. 

The root-hash will be updated automaticly. 

arguments:
```eval_rst
======================= =========== 
`trie_t * <#trie-t>`_    **t**      
`bytes_t * <#bytes-t>`_  **key**    
`bytes_t * <#bytes-t>`_  **value**  
======================= =========== 
```

## Module eth_full 


tommath/bn_error.c

### big.h

Ethereum Nanon verification. 

Location: src/eth_full/big.h

#### big_is_zero

```c
uint8_t big_is_zero(uint8_t *data, wlen_t l);
```

arguments:
```eval_rst
=================== ========== 
``uint8_t *``        **data**  
`wlen_t <#wlen-t>`_  **l**     
=================== ========== 
```
returns: `uint8_t`


#### big_shift_left

```c
void big_shift_left(uint8_t *a, wlen_t len, int bits);
```

arguments:
```eval_rst
=================== ========== 
``uint8_t *``        **a**     
`wlen_t <#wlen-t>`_  **len**   
``int``              **bits**  
=================== ========== 
```

#### big_shift_right

```c
void big_shift_right(uint8_t *a, wlen_t len, int bits);
```

arguments:
```eval_rst
=================== ========== 
``uint8_t *``        **a**     
`wlen_t <#wlen-t>`_  **len**   
``int``              **bits**  
=================== ========== 
```

#### big_cmp

```c
int big_cmp(const uint8_t *a, const wlen_t len_a, const uint8_t *b, const wlen_t len_b);
```

arguments:
```eval_rst
========================= =========== 
``const uint8_t *``        **a**      
`wlen_tconst  <#wlen-t>`_  **len_a**  
``const uint8_t *``        **b**      
`wlen_tconst  <#wlen-t>`_  **len_b**  
========================= =========== 
```
returns: `int`


#### big_signed

```c
int big_signed(uint8_t *val, wlen_t len, uint8_t *dst);
```

returns 0 if the value is positive or 1 if negavtive. 

in this case the absolute value is copied to dst. 

arguments:
```eval_rst
=================== ========= 
``uint8_t *``        **val**  
`wlen_t <#wlen-t>`_  **len**  
``uint8_t *``        **dst**  
=================== ========= 
```
returns: `int`


#### big_int

```c
int32_t big_int(uint8_t *val, wlen_t len);
```

arguments:
```eval_rst
=================== ========= 
``uint8_t *``        **val**  
`wlen_t <#wlen-t>`_  **len**  
=================== ========= 
```
returns: `int32_t`


#### big_add

```c
int big_add(uint8_t *a, wlen_t len_a, uint8_t *b, wlen_t len_b, uint8_t *out, wlen_t max);
```

arguments:
```eval_rst
=================== =========== 
``uint8_t *``        **a**      
`wlen_t <#wlen-t>`_  **len_a**  
``uint8_t *``        **b**      
`wlen_t <#wlen-t>`_  **len_b**  
``uint8_t *``        **out**    
`wlen_t <#wlen-t>`_  **max**    
=================== =========== 
```
returns: `int`


#### big_sub

```c
int big_sub(uint8_t *a, wlen_t len_a, uint8_t *b, wlen_t len_b, uint8_t *out);
```

arguments:
```eval_rst
=================== =========== 
``uint8_t *``        **a**      
`wlen_t <#wlen-t>`_  **len_a**  
``uint8_t *``        **b**      
`wlen_t <#wlen-t>`_  **len_b**  
``uint8_t *``        **out**    
=================== =========== 
```
returns: `int`


#### big_mul

```c
int big_mul(uint8_t *a, wlen_t la, uint8_t *b, wlen_t lb, uint8_t *res, wlen_t max);
```

arguments:
```eval_rst
=================== ========= 
``uint8_t *``        **a**    
`wlen_t <#wlen-t>`_  **la**   
``uint8_t *``        **b**    
`wlen_t <#wlen-t>`_  **lb**   
``uint8_t *``        **res**  
`wlen_t <#wlen-t>`_  **max**  
=================== ========= 
```
returns: `int`


#### big_div

```c
int big_div(uint8_t *a, wlen_t la, uint8_t *b, wlen_t lb, wlen_t sig, uint8_t *res);
```

arguments:
```eval_rst
=================== ========= 
``uint8_t *``        **a**    
`wlen_t <#wlen-t>`_  **la**   
``uint8_t *``        **b**    
`wlen_t <#wlen-t>`_  **lb**   
`wlen_t <#wlen-t>`_  **sig**  
``uint8_t *``        **res**  
=================== ========= 
```
returns: `int`


#### big_mod

```c
int big_mod(uint8_t *a, wlen_t la, uint8_t *b, wlen_t lb, wlen_t sig, uint8_t *res);
```

arguments:
```eval_rst
=================== ========= 
``uint8_t *``        **a**    
`wlen_t <#wlen-t>`_  **la**   
``uint8_t *``        **b**    
`wlen_t <#wlen-t>`_  **lb**   
`wlen_t <#wlen-t>`_  **sig**  
``uint8_t *``        **res**  
=================== ========= 
```
returns: `int`


#### big_exp

```c
int big_exp(uint8_t *a, wlen_t la, uint8_t *b, wlen_t lb, uint8_t *res);
```

arguments:
```eval_rst
=================== ========= 
``uint8_t *``        **a**    
`wlen_t <#wlen-t>`_  **la**   
``uint8_t *``        **b**    
`wlen_t <#wlen-t>`_  **lb**   
``uint8_t *``        **res**  
=================== ========= 
```
returns: `int`


#### big_log256

```c
int big_log256(uint8_t *a, wlen_t len);
```

arguments:
```eval_rst
=================== ========= 
``uint8_t *``        **a**    
`wlen_t <#wlen-t>`_  **len**  
=================== ========= 
```
returns: `int`


### code.h

code cache. 

Location: src/eth_full/code.h

#### in3_get_code

```c
cache_entry_t* in3_get_code(in3_vctx_t *vc, uint8_t *address);
```

arguments:
```eval_rst
============================= ============= 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**       
``uint8_t *``                  **address**  
============================= ============= 
```
returns: [`cache_entry_t *`](#cache-entry-t)


### eth_full.h

Ethereum Nanon verification. 

Location: src/eth_full/eth_full.h

#### in3_verify_eth_full

```c
int in3_verify_eth_full(in3_vctx_t *v);
```

entry-function to execute the verification context. 

arguments:
```eval_rst
============================= ======= 
`in3_vctx_t * <#in3-vctx-t>`_  **v**  
============================= ======= 
```
returns: `int`


#### in3_register_eth_full

```c
void in3_register_eth_full();
```

this function should only be called once and will register the eth-full verifier. 

```eval_rst
  
  
```

### evm.h

main evm-file. 

Location: src/eth_full/evm.h

#### EVM_ERROR_EMPTY_STACK

the no more elements on the stack 

```c
#define EVM_ERROR_EMPTY_STACK -1
```


#### EVM_ERROR_INVALID_OPCODE

the opcode is not supported 

```c
#define EVM_ERROR_INVALID_OPCODE -2
```


#### EVM_ERROR_BUFFER_TOO_SMALL

reading data from a position, which is not initialized 

```c
#define EVM_ERROR_BUFFER_TOO_SMALL -3
```


#### EVM_ERROR_ILLEGAL_MEMORY_ACCESS

the memory-offset does not exist 

```c
#define EVM_ERROR_ILLEGAL_MEMORY_ACCESS -4
```


#### EVM_ERROR_INVALID_JUMPDEST

the jump destination is not marked as valid destination 

```c
#define EVM_ERROR_INVALID_JUMPDEST -5
```


#### EVM_ERROR_INVALID_PUSH

the push data is empy 

```c
#define EVM_ERROR_INVALID_PUSH -6
```


#### EVM_ERROR_UNSUPPORTED_CALL_OPCODE

error handling the call, usually because static-calls are not allowed to change state 

```c
#define EVM_ERROR_UNSUPPORTED_CALL_OPCODE -7
```


#### EVM_ERROR_TIMEOUT

the evm ran into a loop 

```c
#define EVM_ERROR_TIMEOUT -8
```


#### EVM_ERROR_INVALID_ENV

the enviroment could not deliver the data 

```c
#define EVM_ERROR_INVALID_ENV -9
```


#### EVM_ERROR_OUT_OF_GAS

not enough gas to exewcute the opcode 

```c
#define EVM_ERROR_OUT_OF_GAS -10
```


#### EVM_ERROR_BALANCE_TOO_LOW

not enough funds to transfer the requested value. 

```c
#define EVM_ERROR_BALANCE_TOO_LOW -11
```


#### EVM_ERROR_STACK_LIMIT

stack limit reached 

```c
#define EVM_ERROR_STACK_LIMIT -12
```


#### EVM_PROP_FRONTIER

```c
#define EVM_PROP_FRONTIER 1
```


#### EVM_PROP_EIP150

```c
#define EVM_PROP_EIP150 2
```


#### EVM_PROP_EIP158

```c
#define EVM_PROP_EIP158 4
```


#### EVM_PROP_CONSTANTINOPL

```c
#define EVM_PROP_CONSTANTINOPL 16
```


#### EVM_PROP_NO_FINALIZE

```c
#define EVM_PROP_NO_FINALIZE 32768
```


#### EVM_PROP_DEBUG

```c
#define EVM_PROP_DEBUG 65536
```


#### EVM_PROP_STATIC

```c
#define EVM_PROP_STATIC 256
```


#### EVM_ENV_BALANCE

```c
#define EVM_ENV_BALANCE 1
```


#### EVM_ENV_CODE_SIZE

```c
#define EVM_ENV_CODE_SIZE 2
```


#### EVM_ENV_CODE_COPY

```c
#define EVM_ENV_CODE_COPY 3
```


#### EVM_ENV_BLOCKHASH

```c
#define EVM_ENV_BLOCKHASH 4
```


#### EVM_ENV_STORAGE

```c
#define EVM_ENV_STORAGE 5
```


#### EVM_ENV_BLOCKHEADER

```c
#define EVM_ENV_BLOCKHEADER 6
```


#### EVM_ENV_CODE_HASH

```c
#define EVM_ENV_CODE_HASH 7
```


#### EVM_ENV_NONCE

```c
#define EVM_ENV_NONCE 8
```


#### EVM_CALL_MODE_STATIC

```c
#define EVM_CALL_MODE_STATIC 1
```


#### EVM_CALL_MODE_DELEGATE

```c
#define EVM_CALL_MODE_DELEGATE 2
```


#### evm_state

the current state of the evm 

The enum type contains the following values:

```eval_rst
======================== = =====================================
 **EVM_STATE_INIT**      0 just initialised, but not yet started
 **EVM_STATE_RUNNING**   1 started and still running
 **EVM_STATE_STOPPED**   2 successfully stopped
 **EVM_STATE_REVERTED**  3 stopped, but results must be reverted
======================== = =====================================
```

#### evm_state_t

the current state of the evm 


The stuct contains following fields:

```eval_rst
  
  
```

#### evm_get_env

This function provides data from the enviroment. 

depending on the key the function will set the out_data-pointer to the result. This means the enviroment is responsible for memory management and also to clean up resources afterwards.


```c
typedef int(* evm_get_env) (void *evm, uint16_t evm_key, uint8_t *in_data, int in_len, uint8_t **out_data, int offset, int len)
```

returns: `int(*`


#### storage_t


The stuct contains following fields:

```eval_rst
=============================================== =========== 
`bytes32_t <#bytes32-t>`_                        **key**    
`bytes32_t <#bytes32-t>`_                        **value**  
`account_storagestruct , * <#account-storage>`_  **next**   
=============================================== =========== 
```

#### logs_t


The stuct contains following fields:

```eval_rst
========================= ============ 
`bytes_t <#bytes-t>`_      **topics**  
`bytes_t <#bytes-t>`_      **data**    
`logsstruct , * <#logs>`_  **next**    
========================= ============ 
```

#### account_t


The stuct contains following fields:

```eval_rst
=============================== ============= 
`address_t <#address-t>`_        **address**  
`bytes32_t <#bytes32-t>`_        **balance**  
`bytes32_t <#bytes32-t>`_        **nonce**    
`bytes_t <#bytes-t>`_            **code**     
`storage_t * <#storage-t>`_      **storage**  
`accountstruct , * <#account>`_  **next**     
=============================== ============= 
```

#### evm_t


The stuct contains following fields:

```eval_rst
===================================== ====================== ======================================================
`bytes_builder_t <#bytes-builder-t>`_  **stack**             
`bytes_builder_t <#bytes-builder-t>`_  **memory**            
``int``                                **stack_size**        
`bytes_t <#bytes-t>`_                  **code**              
``uint32_t``                           **pos**               
`evm_state_t <#evm-state-t>`_          **state**             
`bytes_t <#bytes-t>`_                  **last_returned**     
`bytes_t <#bytes-t>`_                  **return_data**       
``uint32_t *``                         **invalid_jumpdest**  
``uint32_t``                           **properties**        
`evm_get_env <#evm-get-env>`_          **env**               
``void *``                             **env_ptr**           
``uint8_t *``                          **address**           the address of the current storage
``uint8_t *``                          **account**           the address of the code
``uint8_t *``                          **origin**            the address of original sender of the root-transaction
``uint8_t *``                          **caller**            the address of the parent sender
`bytes_t <#bytes-t>`_                  **call_value**        value send
`bytes_t <#bytes-t>`_                  **call_data**         data send in the tx
`bytes_t <#bytes-t>`_                  **gas_price**         current gasprice
===================================== ====================== ======================================================
```

#### evm_stack_push

```c
int evm_stack_push(evm_t *evm, uint8_t *data, uint8_t len);
```

arguments:
```eval_rst
=================== ========== 
`evm_t * <#evm-t>`_  **evm**   
``uint8_t *``        **data**  
``uint8_t``          **len**   
=================== ========== 
```
returns: `int`


#### evm_stack_push_ref

```c
int evm_stack_push_ref(evm_t *evm, uint8_t **dst, uint8_t len);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
``uint8_t **``       **dst**  
``uint8_t``          **len**  
=================== ========= 
```
returns: `int`


#### evm_stack_push_int

```c
int evm_stack_push_int(evm_t *evm, uint32_t val);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
``uint32_t``         **val**  
=================== ========= 
```
returns: `int`


#### evm_stack_push_long

```c
int evm_stack_push_long(evm_t *evm, uint64_t val);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
``uint64_t``         **val**  
=================== ========= 
```
returns: `int`


#### evm_stack_get_ref

```c
int evm_stack_get_ref(evm_t *evm, uint8_t pos, uint8_t **dst);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
``uint8_t``          **pos**  
``uint8_t **``       **dst**  
=================== ========= 
```
returns: `int`


#### evm_stack_pop

```c
int evm_stack_pop(evm_t *evm, uint8_t *dst, uint8_t len);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
``uint8_t *``        **dst**  
``uint8_t``          **len**  
=================== ========= 
```
returns: `int`


#### evm_stack_pop_ref

```c
int evm_stack_pop_ref(evm_t *evm, uint8_t **dst);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
``uint8_t **``       **dst**  
=================== ========= 
```
returns: `int`


#### evm_stack_pop_byte

```c
int evm_stack_pop_byte(evm_t *evm, uint8_t *dst);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
``uint8_t *``        **dst**  
=================== ========= 
```
returns: `int`


#### evm_stack_pop_int

```c
int32_t evm_stack_pop_int(evm_t *evm);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
=================== ========= 
```
returns: `int32_t`


#### evm_stack_peek_len

```c
int evm_stack_peek_len(evm_t *evm);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
=================== ========= 
```
returns: `int`


#### evm_run

```c
int evm_run(evm_t *evm);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
=================== ========= 
```
returns: `int`


#### evm_sub_call

```c
int evm_sub_call(evm_t *parent, uint8_t address[20], uint8_t account[20], uint8_t *value, wlen_t l_value, uint8_t *data, uint32_t l_data, uint8_t caller[20], uint8_t origin[20], uint64_t gas, wlen_t mode, uint32_t out_offset, uint32_t out_len);
```

handle internal calls. 

arguments:
```eval_rst
=================== ================ 
`evm_t * <#evm-t>`_  **parent**      
``uint8_t``          **address**     
``uint8_t``          **account**     
``uint8_t *``        **value**       
`wlen_t <#wlen-t>`_  **l_value**     
``uint8_t *``        **data**        
``uint32_t``         **l_data**      
``uint8_t``          **caller**      
``uint8_t``          **origin**      
``uint64_t``         **gas**         
`wlen_t <#wlen-t>`_  **mode**        
``uint32_t``         **out_offset**  
``uint32_t``         **out_len**     
=================== ================ 
```
returns: `int`


#### evm_ensure_memory

```c
int evm_ensure_memory(evm_t *evm, uint32_t max_pos);
```

arguments:
```eval_rst
=================== ============= 
`evm_t * <#evm-t>`_  **evm**      
``uint32_t``         **max_pos**  
=================== ============= 
```
returns: `int`


#### in3_get_env

```c
int in3_get_env(void *evm_ptr, uint16_t evm_key, uint8_t *in_data, int in_len, uint8_t **out_data, int offset, int len);
```

arguments:
```eval_rst
============== ============== 
``void *``      **evm_ptr**   
``uint16_t``    **evm_key**   
``uint8_t *``   **in_data**   
``int``         **in_len**    
``uint8_t **``  **out_data**  
``int``         **offset**    
``int``         **len**       
============== ============== 
```
returns: `int`


#### evm_call

```c
int evm_call(in3_vctx_t *vc, uint8_t address[20], uint8_t *value, wlen_t l_value, uint8_t *data, uint32_t l_data, uint8_t caller[20], uint64_t gas, bytes_t **result);
```

run a evm-call 

arguments:
```eval_rst
============================= ============= 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**       
``uint8_t``                    **address**  
``uint8_t *``                  **value**    
`wlen_t <#wlen-t>`_            **l_value**  
``uint8_t *``                  **data**     
``uint32_t``                   **l_data**   
``uint8_t``                    **caller**   
``uint64_t``                   **gas**      
`bytes_t ** <#bytes-t>`_       **result**   
============================= ============= 
```
returns: `int`


#### evm_print_stack

```c
void evm_print_stack(evm_t *evm, uint64_t last_gas, uint32_t pos);
```

arguments:
```eval_rst
=================== ============== 
`evm_t * <#evm-t>`_  **evm**       
``uint64_t``         **last_gas**  
``uint32_t``         **pos**       
=================== ============== 
```

#### evm_free

```c
void evm_free(evm_t *evm);
```

arguments:
```eval_rst
=================== ========= 
`evm_t * <#evm-t>`_  **evm**  
=================== ========= 
```

#### evm_run_precompiled

```c
int evm_run_precompiled(evm_t *evm, uint8_t address[20]);
```

arguments:
```eval_rst
=================== ============= 
`evm_t * <#evm-t>`_  **evm**      
``uint8_t``          **address**  
=================== ============= 
```
returns: `int`


#### evm_is_precompiled

```c
uint8_t evm_is_precompiled(evm_t *evm, uint8_t address[20]);
```

arguments:
```eval_rst
=================== ============= 
`evm_t * <#evm-t>`_  **evm**      
``uint8_t``          **address**  
=================== ============= 
```
returns: `uint8_t`


#### uint256_set

```c
void uint256_set(uint8_t *src, wlen_t src_len, uint8_t dst[32]);
```

arguments:
```eval_rst
=================== ============= 
``uint8_t *``        **src**      
`wlen_t <#wlen-t>`_  **src_len**  
``uint8_t``          **dst**      
=================== ============= 
```

### gas.h

evm gas defines. 

Location: src/eth_full/gas.h

#### op_exec (m,gas)

```c
#define op_exec (m,gas) return m;
```


#### subgas (g)


#### GAS_CC_NET_SSTORE_NOOP_GAS

Once per SSTORE operation if the value doesn't change. 

```c
#define GAS_CC_NET_SSTORE_NOOP_GAS 200
```


#### GAS_CC_NET_SSTORE_INIT_GAS

Once per SSTORE operation from clean zero. 

```c
#define GAS_CC_NET_SSTORE_INIT_GAS 20000
```


#### GAS_CC_NET_SSTORE_CLEAN_GAS

Once per SSTORE operation from clean non-zero. 

```c
#define GAS_CC_NET_SSTORE_CLEAN_GAS 5000
```


#### GAS_CC_NET_SSTORE_DIRTY_GAS

Once per SSTORE operation from dirty. 

```c
#define GAS_CC_NET_SSTORE_DIRTY_GAS 200
```


#### GAS_CC_NET_SSTORE_CLEAR_REFUND

Once per SSTORE operation for clearing an originally existing storage slot. 

```c
#define GAS_CC_NET_SSTORE_CLEAR_REFUND 15000
```


#### GAS_CC_NET_SSTORE_RESET_REFUND

Once per SSTORE operation for resetting to the original non-zero value. 

```c
#define GAS_CC_NET_SSTORE_RESET_REFUND 4800
```


#### GAS_CC_NET_SSTORE_RESET_CLEAR_REFUND

Once per SSTORE operation for resetting to the original zero valuev. 

```c
#define GAS_CC_NET_SSTORE_RESET_CLEAR_REFUND 19800
```


#### G_ZERO

Nothing is paid for operations of the set Wzero. 

```c
#define G_ZERO 0
```


#### G_JUMPDEST

JUMP DEST. 

```c
#define G_JUMPDEST 1
```


#### G_BASE

This is the amount of gas to pay for operations of the set Wbase. 

```c
#define G_BASE 2
```


#### G_VERY_LOW

This is the amount of gas to pay for operations of the set Wverylow. 

```c
#define G_VERY_LOW 3
```


#### G_LOW

This is the amount of gas to pay for operations of the set Wlow. 

```c
#define G_LOW 5
```


#### G_MID

This is the amount of gas to pay for operations of the set Wmid. 

```c
#define G_MID 8
```


#### G_HIGH

This is the amount of gas to pay for operations of the set Whigh. 

```c
#define G_HIGH 10
```


#### G_EXTCODE

This is the amount of gas to pay for operations of the set Wextcode. 

```c
#define G_EXTCODE 700
```


#### G_BALANCE

This is the amount of gas to pay for a BALANCE operation. 

```c
#define G_BALANCE 400
```


#### G_SLOAD

This is paid for an SLOAD operation. 

```c
#define G_SLOAD 200
```


#### G_SSET

This is paid for an SSTORE operation when the storage value is set to non-zero from zero. 

```c
#define G_SSET 20000
```


#### G_SRESET

This is the amount for an SSTORE operation when the storage value’s zeroness remains unchanged or is set to zero. 

```c
#define G_SRESET 5000
```


#### R_SCLEAR

This is the refund given (added into the refund counter) when the storage value is set to zero from non-zero. 

```c
#define R_SCLEAR 15000
```


#### R_SELFDESTRUCT

This is the refund given (added into the refund counter) for self-destructing an account. 

```c
#define R_SELFDESTRUCT 24000
```


#### G_SELFDESTRUCT

This is the amount of gas to pay for a SELFDESTRUCT operation. 

```c
#define G_SELFDESTRUCT 5000
```


#### G_CREATE

This is paid for a CREATE operation. 

```c
#define G_CREATE 32000
```


#### G_CODEDEPOSIT

This is paid per byte for a CREATE operation to succeed in placing code into the state. 

```c
#define G_CODEDEPOSIT 200
```


#### G_CALL

This is paid for a CALL operation. 

```c
#define G_CALL 700
```


#### G_CALLVALUE

This is paid for a non-zero value transfer as part of the CALL operation. 

```c
#define G_CALLVALUE 9000
```


#### G_CALLSTIPEND

This is a stipend for the called contract subtracted from Gcallvalue for a non-zero value transfer. 

```c
#define G_CALLSTIPEND 2300
```


#### G_NEWACCOUNT

This is paid for a CALL or for a SELFDESTRUCT operation which creates an account. 

```c
#define G_NEWACCOUNT 25000
```


#### G_EXP

This is a partial payment for an EXP operation. 

```c
#define G_EXP 10
```


#### G_EXPBYTE

This is a partial payment when multiplied by dlog256(exponent)e for the EXP operation. 

```c
#define G_EXPBYTE 50
```


#### G_MEMORY

This is paid for every additional word when expanding memory. 

```c
#define G_MEMORY 3
```


#### G_TXCREATE

This is paid by all contract-creating transactions after the Homestead transition. 

```c
#define G_TXCREATE 32000
```


#### G_TXDATA_ZERO

This is paid for every zero byte of data or code for a transaction. 

```c
#define G_TXDATA_ZERO 4
```


#### G_TXDATA_NONZERO

This is paid for every non-zero byte of data or code for a transaction. 

```c
#define G_TXDATA_NONZERO 68
```


#### G_TRANSACTION

This is paid for every transaction. 

```c
#define G_TRANSACTION 21000
```


#### G_LOG

This is a partial payment for a LOG operation. 

```c
#define G_LOG 375
```


#### G_LOGDATA

This is paid for each byte in a LOG operation’s data. 

```c
#define G_LOGDATA 8
```


#### G_LOGTOPIC

This is paid for each topic of a LOG operation. 

```c
#define G_LOGTOPIC 375
```


#### G_SHA3

This is paid for each SHA3 operation. 

```c
#define G_SHA3 30
```


#### G_SHA3WORD

This is paid for each word (rounded up) for input data to a SHA3 operation. 

```c
#define G_SHA3WORD 6
```


#### G_COPY

This is a partial payment for *COPY operations, multiplied by the number of words copied, rounded up. 

```c
#define G_COPY 3
```


#### G_BLOCKHASH

This is a payment for a BLOCKHASH operation. 

```c
#define G_BLOCKHASH 20
```


#### G_PRE_EC_RECOVER

Precompile EC RECOVER. 

```c
#define G_PRE_EC_RECOVER 3000
```


#### G_PRE_SHA256

Precompile SHA256. 

```c
#define G_PRE_SHA256 60
```


#### G_PRE_SHA256_WORD

Precompile SHA256 per word. 

```c
#define G_PRE_SHA256_WORD 12
```


#### G_PRE_RIPEMD160

Precompile RIPEMD160. 

```c
#define G_PRE_RIPEMD160 600
```


#### G_PRE_RIPEMD160_WORD

Precompile RIPEMD160 per word. 

```c
#define G_PRE_RIPEMD160_WORD 120
```


#### G_PRE_IDENTITY

Precompile IDENTIY (copyies data) 

```c
#define G_PRE_IDENTITY 15
```


#### G_PRE_IDENTITY_WORD

Precompile IDENTIY per word. 

```c
#define G_PRE_IDENTITY_WORD 3
```


#### G_PRE_MODEXP_GQUAD_DIVISOR

Gquaddivisor from modexp precompile for gas calculation. 

```c
#define G_PRE_MODEXP_GQUAD_DIVISOR 20
```


#### G_PRE_ECADD

Gas costs for curve addition precompile. 

```c
#define G_PRE_ECADD 500
```


#### G_PRE_ECMUL

Gas costs for curve multiplication precompile. 

```c
#define G_PRE_ECMUL 40000
```


#### G_PRE_ECPAIRING

Base gas costs for curve pairing precompile. 

```c
#define G_PRE_ECPAIRING 100000
```


#### G_PRE_ECPAIRING_WORD

Gas costs regarding curve pairing precompile input length. 

```c
#define G_PRE_ECPAIRING_WORD 80000
```


#### EVM_STACK_LIMIT

max elements of the stack 

```c
#define EVM_STACK_LIMIT 1024
```


#### EVM_MAX_CODE_SIZE

max size of the code 

```c
#define EVM_MAX_CODE_SIZE 24576
```


#### FRONTIER_G_EXPBYTE

fork values 

This is a partial payment when multiplied by dlog256(exponent)e for the EXP operation. 

```c
#define FRONTIER_G_EXPBYTE 10
```


#### FRONTIER_G_SLOAD

This is a partial payment when multiplied by dlog256(exponent)e for the EXP operation. 

```c
#define FRONTIER_G_SLOAD 50
```


## Module eth_nano 


static lib

### eth_nano.h

Ethereum Nanon verification. 

Location: src/eth_nano/eth_nano.h

#### in3_verify_eth_nano

```c
in3_ret_t in3_verify_eth_nano(in3_vctx_t *v);
```

entry-function to execute the verification context. 

arguments:
```eval_rst
============================= ======= 
`in3_vctx_t * <#in3-vctx-t>`_  **v**  
============================= ======= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_verify_blockheader

```c
in3_ret_t eth_verify_blockheader(in3_vctx_t *vc, bytes_t *header, bytes_t *expected_blockhash);
```

verifies a blockheader. 

verifies a blockheader. 

arguments:
```eval_rst
============================= ======================== 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**                  
`bytes_t * <#bytes-t>`_        **header**              
`bytes_t * <#bytes-t>`_        **expected_blockhash**  
============================= ======================== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_verify_signature

```c
int eth_verify_signature(in3_vctx_t *vc, bytes_t *msg_hash, d_token_t *sig);
```

verifies a single signature blockheader. 

This function will return a positive integer with a bitmask holding the bit set according to the address that signed it. This is based on the signatiures in the request-config. 

arguments:
```eval_rst
============================= ============== 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**        
`bytes_t * <#bytes-t>`_        **msg_hash**  
`d_token_t * <#d-token-t>`_    **sig**       
============================= ============== 
```
returns: `int`


#### ecrecover_signature

```c
bytes_t* ecrecover_signature(bytes_t *msg_hash, d_token_t *sig);
```

returns the address of the signature if the msg_hash is correct 

arguments:
```eval_rst
=========================== ============== 
`bytes_t * <#bytes-t>`_      **msg_hash**  
`d_token_t * <#d-token-t>`_  **sig**       
=========================== ============== 
```
returns: [`bytes_t *`](#bytes-t)


#### eth_verify_eth_getTransactionReceipt

```c
in3_ret_t eth_verify_eth_getTransactionReceipt(in3_vctx_t *vc, bytes_t *tx_hash);
```

verifies a transaction receipt. 

arguments:
```eval_rst
============================= ============= 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**       
`bytes_t * <#bytes-t>`_        **tx_hash**  
============================= ============= 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### eth_verify_in3_nodelist

```c
in3_ret_t eth_verify_in3_nodelist(in3_vctx_t *vc, uint32_t node_limit, bytes_t *seed, d_token_t *required_addresses);
```

verifies the nodelist. 

arguments:
```eval_rst
============================= ======================== 
`in3_vctx_t * <#in3-vctx-t>`_  **vc**                  
``uint32_t``                   **node_limit**          
`bytes_t * <#bytes-t>`_        **seed**                
`d_token_t * <#d-token-t>`_    **required_addresses**  
============================= ======================== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### in3_register_eth_nano

```c
void in3_register_eth_nano();
```

this function should only be called once and will register the eth-nano verifier. 

```eval_rst
  
  
```

#### create_tx_path

```c
bytes_t* create_tx_path(uint32_t index);
```

helper function to rlp-encode the transaction_index. 

The result must be freed after use! 

arguments:
```eval_rst
============ =========== 
``uint32_t``  **index**  
============ =========== 
```
returns: [`bytes_t *`](#bytes-t)


### merkle.h

Merkle Proof Verification. 

Location: src/eth_nano/merkle.h

#### MERKLE_DEPTH_MAX

```c
#define MERKLE_DEPTH_MAX 64
```


#### trie_verify_proof

```c
int trie_verify_proof(bytes_t *rootHash, bytes_t *path, bytes_t **proof, bytes_t *expectedValue);
```

verifies a merkle proof. 

expectedValue == NULL : value must not exist expectedValue.data ==NULL : please copy the data I want to evaluate it afterwards. expectedValue.data !=NULL : the value must match the data.

arguments:
```eval_rst
======================== =================== 
`bytes_t * <#bytes-t>`_   **rootHash**       
`bytes_t * <#bytes-t>`_   **path**           
`bytes_t ** <#bytes-t>`_  **proof**          
`bytes_t * <#bytes-t>`_   **expectedValue**  
======================== =================== 
```
returns: `int`


#### trie_path_to_nibbles

```c
uint8_t* trie_path_to_nibbles(bytes_t path, int use_prefix);
```

helper function split a path into 4-bit nibbles. 

The result must be freed after use!

arguments:
```eval_rst
===================== ================ 
`bytes_t <#bytes-t>`_  **path**        
``int``                **use_prefix**  
===================== ================ 
```
returns: `uint8_t *` : the resulting bytes represent a 4bit-number each and are terminated with a 0xFF. 




#### trie_matching_nibbles

```c
int trie_matching_nibbles(uint8_t *a, uint8_t *b);
```

helper function to find the number of nibbles matching both paths. 

arguments:
```eval_rst
============= ======= 
``uint8_t *``  **a**  
``uint8_t *``  **b**  
============= ======= 
```
returns: `int`


#### trie_free_proof

```c
void trie_free_proof(bytes_t **proof);
```

used to free the NULL-terminated proof-array. 

arguments:
```eval_rst
======================== =========== 
`bytes_t ** <#bytes-t>`_  **proof**  
======================== =========== 
```

### rlp.h

RLP-En/Decoding as described in the [Ethereum RLP-Spec](https://github.com/ethereum/wiki/wiki/RLP). 

This decoding works without allocating new memory. 

Location: src/eth_nano/rlp.h

#### rlp_decode

```c
int rlp_decode(bytes_t *b, int index, bytes_t *dst);
```

this function decodes the given bytes and returns the element with the given index by updating the reference of dst. 

the bytes will only hold references and do **not** need to be freed!

```c
bytes_t* tx_raw = serialize_tx(tx);

bytes_t item;

// decodes the tx_raw by letting the item point to range of the first element, which should be the body of a list.
if (rlp_decode(tx_raw, 0, &item) !=2) return -1 ;

// now decode the 4th element (which is the value) and let item point to that range.
if (rlp_decode(&item, 4, &item) !=1) return -1 ;
```
arguments:
```eval_rst
======================= =========== 
`bytes_t * <#bytes-t>`_  **b**      
``int``                  **index**  
`bytes_t * <#bytes-t>`_  **dst**    
======================= =========== 
```
returns: `int` : - 0 : means item out of range
- 1 : item found
- 2 : list found ( you can then decode the same bytes again)




#### rlp_decode_in_list

```c
int rlp_decode_in_list(bytes_t *b, int index, bytes_t *dst);
```

this function expects a list item (like the blockheader as first item and will then find the item within this list). 

It is a shortcut for

```c
// decode the list
if (rlp_decode(b,0,dst)!=2) return 0;
// and the decode the item
return rlp_decode(dst,index,dst);
```
arguments:
```eval_rst
======================= =========== 
`bytes_t * <#bytes-t>`_  **b**      
``int``                  **index**  
`bytes_t * <#bytes-t>`_  **dst**    
======================= =========== 
```
returns: `int` : - 0 : means item out of range
- 1 : item found
- 2 : list found ( you can then decode the same bytes again)




#### rlp_decode_len

```c
int rlp_decode_len(bytes_t *b);
```

returns the number of elements found in the data. 

arguments:
```eval_rst
======================= ======= 
`bytes_t * <#bytes-t>`_  **b**  
======================= ======= 
```
returns: `int`


#### rlp_decode_item_len

```c
int rlp_decode_item_len(bytes_t *b, int index);
```

returns the number of bytes of the element specified by index. 

arguments:
```eval_rst
======================= =========== 
`bytes_t * <#bytes-t>`_  **b**      
``int``                  **index**  
======================= =========== 
```
returns: `int` : the number of bytes or 0 if not found. 




#### rlp_decode_item_type

```c
int rlp_decode_item_type(bytes_t *b, int index);
```

returns the type of the element specified by index. 

arguments:
```eval_rst
======================= =========== 
`bytes_t * <#bytes-t>`_  **b**      
``int``                  **index**  
======================= =========== 
```
returns: `int` : - 0 : means item out of range
- 1 : item found
- 2 : list found ( you can then decode the same bytes again)




#### rlp_encode_item

```c
void rlp_encode_item(bytes_builder_t *bb, bytes_t *val);
```

encode a item as single string and add it to the bytes_builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
`bytes_t * <#bytes-t>`_                  **val**  
======================================= ========= 
```

#### rlp_encode_list

```c
void rlp_encode_list(bytes_builder_t *bb, bytes_t *val);
```

encode a the value as list of already encoded items. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**   
`bytes_t * <#bytes-t>`_                  **val**  
======================================= ========= 
```

#### rlp_encode_to_list

```c
bytes_builder_t* rlp_encode_to_list(bytes_builder_t *bb);
```

converts the data in the builder to a list. 

This function is optimized to not increase the memory more than needed and is fastet than creating a second builder to encode the data.

arguments:
```eval_rst
======================================= ======== 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**  
======================================= ======== 
```
returns: [`bytes_builder_t *`](#bytes-builder-t) : the same builder. 




#### rlp_encode_to_item

```c
bytes_builder_t* rlp_encode_to_item(bytes_builder_t *bb);
```

converts the data in the builder to a rlp-encoded item. 

This function is optimized to not increase the memory more than needed and is fastet than creating a second builder to encode the data.

arguments:
```eval_rst
======================================= ======== 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**  
======================================= ======== 
```
returns: [`bytes_builder_t *`](#bytes-builder-t) : the same builder. 




#### rlp_add_length

```c
void rlp_add_length(bytes_builder_t *bb, uint32_t len, uint8_t offset);
```

helper to encode the prefix for a value 

arguments:
```eval_rst
======================================= ============ 
`bytes_builder_t * <#bytes-builder-t>`_  **bb**      
``uint32_t``                             **len**     
``uint8_t``                              **offset**  
======================================= ============ 
```

### serialize.h

serialization of ETH-Objects. 

This incoming tokens will represent their values as properties based on [JSON-RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC). 

Location: src/eth_nano/serialize.h

#### BLOCKHEADER_PARENT_HASH

```c
#define BLOCKHEADER_PARENT_HASH 0
```


#### BLOCKHEADER_SHA3_UNCLES

```c
#define BLOCKHEADER_SHA3_UNCLES 1
```


#### BLOCKHEADER_MINER

```c
#define BLOCKHEADER_MINER 2
```


#### BLOCKHEADER_STATE_ROOT

```c
#define BLOCKHEADER_STATE_ROOT 3
```


#### BLOCKHEADER_TRANSACTIONS_ROOT

```c
#define BLOCKHEADER_TRANSACTIONS_ROOT 4
```


#### BLOCKHEADER_RECEIPT_ROOT

```c
#define BLOCKHEADER_RECEIPT_ROOT 5
```


#### BLOCKHEADER_LOGS_BLOOM

```c
#define BLOCKHEADER_LOGS_BLOOM 6
```


#### BLOCKHEADER_DIFFICULTY

```c
#define BLOCKHEADER_DIFFICULTY 7
```


#### BLOCKHEADER_NUMBER

```c
#define BLOCKHEADER_NUMBER 8
```


#### BLOCKHEADER_GAS_LIMIT

```c
#define BLOCKHEADER_GAS_LIMIT 9
```


#### BLOCKHEADER_GAS_USED

```c
#define BLOCKHEADER_GAS_USED 10
```


#### BLOCKHEADER_TIMESTAMP

```c
#define BLOCKHEADER_TIMESTAMP 11
```


#### BLOCKHEADER_EXTRA_DATA

```c
#define BLOCKHEADER_EXTRA_DATA 12
```


#### BLOCKHEADER_SEALED_FIELD1

```c
#define BLOCKHEADER_SEALED_FIELD1 13
```


#### BLOCKHEADER_SEALED_FIELD2

```c
#define BLOCKHEADER_SEALED_FIELD2 14
```


#### BLOCKHEADER_SEALED_FIELD3

```c
#define BLOCKHEADER_SEALED_FIELD3 15
```


#### serialize_tx_receipt

```c
bytes_t* serialize_tx_receipt(d_token_t *receipt);
```

creates rlp-encoded raw bytes for a receipt. 

The bytes must be freed with b_free after use!

arguments:
```eval_rst
=========================== ============= 
`d_token_t * <#d-token-t>`_  **receipt**  
=========================== ============= 
```
returns: [`bytes_t *`](#bytes-t)


#### serialize_tx

```c
bytes_t* serialize_tx(d_token_t *tx);
```

creates rlp-encoded raw bytes for a transaction. 

The bytes must be freed with b_free after use!

arguments:
```eval_rst
=========================== ======== 
`d_token_t * <#d-token-t>`_  **tx**  
=========================== ======== 
```
returns: [`bytes_t *`](#bytes-t)


#### serialize_tx_raw

```c
bytes_t* serialize_tx_raw(bytes_t nonce, bytes_t gas_price, bytes_t gas_limit, bytes_t to, bytes_t value, bytes_t data, uint64_t v, bytes_t r, bytes_t s);
```

creates rlp-encoded raw bytes for a transaction from direct values. 

The bytes must be freed with b_free after use! 

arguments:
```eval_rst
===================== =============== 
`bytes_t <#bytes-t>`_  **nonce**      
`bytes_t <#bytes-t>`_  **gas_price**  
`bytes_t <#bytes-t>`_  **gas_limit**  
`bytes_t <#bytes-t>`_  **to**         
`bytes_t <#bytes-t>`_  **value**      
`bytes_t <#bytes-t>`_  **data**       
``uint64_t``           **v**          
`bytes_t <#bytes-t>`_  **r**          
`bytes_t <#bytes-t>`_  **s**          
===================== =============== 
```
returns: [`bytes_t *`](#bytes-t)


#### serialize_account

```c
bytes_t* serialize_account(d_token_t *a);
```

creates rlp-encoded raw bytes for a account. 

The bytes must be freed with b_free after use! 

arguments:
```eval_rst
=========================== ======= 
`d_token_t * <#d-token-t>`_  **a**  
=========================== ======= 
```
returns: [`bytes_t *`](#bytes-t)


#### serialize_block_header

```c
bytes_t* serialize_block_header(d_token_t *block);
```

creates rlp-encoded raw bytes for a blockheader. 

The bytes must be freed with b_free after use!

arguments:
```eval_rst
=========================== =========== 
`d_token_t * <#d-token-t>`_  **block**  
=========================== =========== 
```
returns: [`bytes_t *`](#bytes-t)


#### rlp_add

```c
int rlp_add(bytes_builder_t *rlp, d_token_t *t, int ml);
```

adds the value represented by the token rlp-encoded to the byte_builder. 

arguments:
```eval_rst
======================================= ========= 
`bytes_builder_t * <#bytes-builder-t>`_  **rlp**  
`d_token_t * <#d-token-t>`_              **t**    
``int``                                  **ml**   
======================================= ========= 
```
returns: `int` : 0 if added -1 if the value could not be handled. 




## Module libin3 


add the executablex

### in3.h

the entry-points for the shares library. 

Location: src/libin3/in3.h

#### in3_create

```c
in3_t* in3_create();
```

creates a new client 

```eval_rst
  
  
```
returns: [`in3_t *`](#in3-t)


#### in3_send

```c
int in3_send(in3_t *c, char *method, char *params, char **result, char **error);
```

sends a request and stores the result in the provided buffer 

arguments:
```eval_rst
=================== ============ 
`in3_t * <#in3-t>`_  **c**       
``char *``           **method**  
``char *``           **params**  
``char **``          **result**  
``char **``          **error**   
=================== ============ 
```
returns: `int`


#### in3_dispose

```c
void in3_dispose(in3_t *a);
```

frees the references of the client 

arguments:
```eval_rst
=================== ======= 
`in3_t * <#in3-t>`_  **a**  
=================== ======= 
```

## Module transport_curl 


add a option

### in3_curl.h

transport-handler using libcurl. 

Location: src/transport_curl/in3_curl.h

#### send_curl

```c
in3_ret_t send_curl(char **urls, int urls_len, char *payload, in3_response_t *result);
```

arguments:
```eval_rst
===================================== ============== 
``char **``                            **urls**      
``int``                                **urls_len**  
``char *``                             **payload**   
`in3_response_t * <#in3-response-t>`_  **result**    
===================================== ============== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


### in3_storage.h

storage handler storing cache in the home-dir/.in3 

Location: src/transport_curl/in3_storage.h

#### storage_get_item

```c
bytes_t* storage_get_item(void *cptr, char *key);
```

arguments:
```eval_rst
========== ========== 
``void *``  **cptr**  
``char *``  **key**   
========== ========== 
```
returns: [`bytes_t *`](#bytes-t)


#### storage_set_item

```c
void storage_set_item(void *cptr, char *key, bytes_t *content);
```

arguments:
```eval_rst
======================= ============= 
``void *``               **cptr**     
``char *``               **key**      
`bytes_t * <#bytes-t>`_  **content**  
======================= ============= 
```

## Module usn_api 


static lib

### usn_api.h

USN API. 

This header-file defines easy to use function, which are verifying USN-Messages. 

Location: src/usn_api/usn_api.h

#### usn_msg_type_t

The enum type contains the following values:

```eval_rst
================== = 
 **USN_ACTION**    0 
 **USN_REQUEST**   1 
 **USN_RESPONSE**  2 
================== = 
```

#### usn_event_type_t

The enum type contains the following values:

```eval_rst
=================== = 
 **BOOKING_NONE**   0 
 **BOOKING_START**  1 
 **BOOKING_STOP**   2 
=================== = 
```

#### usn_booking_handler


```c
typedef int(* usn_booking_handler) (usn_event_t *)
```

returns: `int(*`


#### usn_verify_message

```c
usn_msg_result_t usn_verify_message(usn_device_conf_t *conf, char *message);
```

arguments:
```eval_rst
=========================================== ============= 
`usn_device_conf_t * <#usn-device-conf-t>`_  **conf**     
``char *``                                   **message**  
=========================================== ============= 
```
returns: [`usn_msg_result_t`](#usn-msg-result-t)


#### usn_register_device

```c
in3_ret_t usn_register_device(usn_device_conf_t *conf, char *url);
```

arguments:
```eval_rst
=========================================== ========== 
`usn_device_conf_t * <#usn-device-conf-t>`_  **conf**  
``char *``                                   **url**   
=========================================== ========== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### usn_parse_url

```c
usn_url_t usn_parse_url(char *url);
```

arguments:
```eval_rst
========== ========= 
``char *``  **url**  
========== ========= 
```
returns: [`usn_url_t`](#usn-url-t)


#### usn_update_state

```c
unsigned int usn_update_state(usn_device_conf_t *conf, unsigned int wait_time);
```

arguments:
```eval_rst
=========================================== =============== 
`usn_device_conf_t * <#usn-device-conf-t>`_  **conf**       
``unsigned int``                             **wait_time**  
=========================================== =============== 
```
returns: `unsigned int`


#### usn_update_bookings

```c
in3_ret_t usn_update_bookings(usn_device_conf_t *conf);
```

arguments:
```eval_rst
=========================================== ========== 
`usn_device_conf_t * <#usn-device-conf-t>`_  **conf**  
=========================================== ========== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### usn_remove_old_bookings

```c
void usn_remove_old_bookings(usn_device_conf_t *conf);
```

arguments:
```eval_rst
=========================================== ========== 
`usn_device_conf_t * <#usn-device-conf-t>`_  **conf**  
=========================================== ========== 
```

#### usn_get_next_event

```c
usn_event_t usn_get_next_event(usn_device_conf_t *conf);
```

arguments:
```eval_rst
=========================================== ========== 
`usn_device_conf_t * <#usn-device-conf-t>`_  **conf**  
=========================================== ========== 
```
returns: [`usn_event_t`](#usn-event-t)


#### usn_rent

```c
in3_ret_t usn_rent(in3_t *c, address_t contract, address_t token, char *url, uint32_t seconds, bytes32_t tx_hash);
```

arguments:
```eval_rst
========================= ============== 
`in3_t * <#in3-t>`_        **c**         
`address_t <#address-t>`_  **contract**  
`address_t <#address-t>`_  **token**     
``char *``                 **url**       
``uint32_t``               **seconds**   
`bytes32_t <#bytes32-t>`_  **tx_hash**   
========================= ============== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### usn_return

```c
in3_ret_t usn_return(in3_t *c, address_t contract, char *url, bytes32_t tx_hash);
```

arguments:
```eval_rst
========================= ============== 
`in3_t * <#in3-t>`_        **c**         
`address_t <#address-t>`_  **contract**  
``char *``                 **url**       
`bytes32_t <#bytes32-t>`_  **tx_hash**   
========================= ============== 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


#### usn_price

```c
in3_ret_t usn_price(in3_t *c, address_t contract, address_t token, char *url, uint32_t seconds, address_t controller, bytes32_t price);
```

arguments:
```eval_rst
========================= ================ 
`in3_t * <#in3-t>`_        **c**           
`address_t <#address-t>`_  **contract**    
`address_t <#address-t>`_  **token**       
``char *``                 **url**         
``uint32_t``               **seconds**     
`address_t <#address-t>`_  **controller**  
`bytes32_t <#bytes32-t>`_  **price**       
========================= ================ 
```
returns: [`in3_ret_t`](#in3-ret-t) the [result-status](#in3-ret-t) of the function. 

*Please make sure you check if it was successfull (`==IN3_OK`)*


