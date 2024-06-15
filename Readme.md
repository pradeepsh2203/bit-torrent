# Bit-Torrent Client (Peer to Peer protocol)

I would be trying to built a bit-torrent client from scratch without any tutorial. Using NodeJs, TypeScript.

## To-Do

&#9745; Simple Landing Webpage to upload the torrent file.  
&#9744; Bencoder Parser. &#9745; InfoHash Working next task is to remove the clutter and store the peers(port and ip somewhere)

the url for bit torrent client is https://www.bittorrent.org/beps/bep_0015.html

I have all sorted till the process of recieving have messages but now how to ensure that we have recieved all the have messages and we can start downloading our pieces.

**_Alas at last I should give up my hopes here. Looks to me that this was not that good of an idea building torrent client in node . I think I should have known this earlier that the single threaded nature of node would not allow me to make multiple connections with peers at the same time. and to make connection with one peer at a time is not that efficient._**

**Remarks:- Actually we can devise some algorithm here that can basically make connections with peer one by one and get the data from the peers. keep the data of the in some local storage :)(which I already have available)**
