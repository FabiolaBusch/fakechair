## Architecture

The overall system structure is depicted in this [UML deployment diagram](https://www.uml-diagrams.org/deployment-diagrams.html).

![Architecture](./Architecture.png)

Smart contracts, deployed on the Ethereum testnet Rinkeby perform internal computations like conference and account management. 
This computation is executed via the EVM on each miner's computer. The web interface is deployed on a web server, while conference management information is 
fetched from the blockchain via RPC. This communication is enabled by  the JavaScript API web3, which is injected by the  add-on MetaMask into the user's browser. 
Detailed conference information, paper PDFs and review texts are stored on the P2P file storage network IPFS.

This figure was made with [Visual Paradigm Community Edition](https://www.visual-paradigm.com/download/community.jsp)

### Back end

The back end consist of Smart Contracts, written in Solidity and IPFS as an off-chain file storage. The contract structure is depicted in this [UML component diagram](https://www.uml-diagrams.org/component-diagrams.html) 

<img src="./backend.png"  width="800" >

Conferences are created via a conference registry. Each conference possesses a list of papers, each paper possess a list of reviews.

Access to certain objects and operatins is restricted to different roles: Admin, Programm-Commitee Member and Author. Accounts can be assigned to such a role by the conference admin. 
The account which created a conference is the conference's admin. This model, namely [Role Based Access Control](https://de.wikipedia.org/wiki/Role_Based_Access_Control) is described by this figure:


<img src="./rbac.png"  width="500" >

The [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity) framework offers many pieces of security relevant Solidity scripts, including interfaces for RBAC.

### Front end

