
## Architecture

The overall system structure is depicted in this [UML deployment diagram](https://www.uml-diagrams.org/deployment-diagrams.html).

![Architecture](./Architecture.png)

This figure was made with [Visual Paradigm Community Edition](https://www.visual-paradigm.com/download/community.jsp)

### Back end

The back end consist of Smart Contracts, written in Solidity and IPFS as an off-chain file storage. The contract structure is depicted in this [UML component diagram](https://www.uml-diagrams.org/component-diagrams.html) 

<img src="./backend.png"  width="800" >

Access to certain objects and operatins is restricted to different roles: Admin, Programm-Commitee Member and Author. Accounts can be assigned to such a role by the conference admin. 
The account which created a conference is the conference's admin. This model, namely [Role Based Access Control](https://de.wikipedia.org/wiki/Role_Based_Access_Control) is described by this figure:


<img src="./rbac.png"  width="500" >

The [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity) framework offers many pieces of security relevant Solidity scripts, including interfaces for RBAC.

### Front end

