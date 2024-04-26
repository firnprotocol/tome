# TOME: _Anonymous Broadcast_, by Firn

Tome has two purposes:
1. To demonstrate, by the means of an open-source, easy-to-understand repository, how to use Firn's [MetaMask Snap](https://github.com/MetaMask/snaps) (itself available on npm at [`@firnprotocol/snap`](https://www.npmjs.com/package/@firnprotocol/snap)).
2. To be useful in its own right.

Tome allows anyone to immutably post data onto Ethereum (actually, onto the Base L2), while moreover protecting his identity (by concealing who paid the posting transaction's gas costs). This wasn't possible before Tome!

Once you understand how Firn's Snap works, Tome is very easy to understand. Firn's Snap lets an arbitrary Dapp (like Tome) privately execute Ethereum transactions on behalf of its users. In the case of Tome, the transactions at hand simply call a function whose sole effect is to emit an Event containing a user-supplied string. Tome solicits this string from the user, and forwards it to Firn's Snap.

How will _your_ Dapp use Firn's Snap to "plug" privacy into its functionality?

You can access a live, hosted version of Tome at [tome.fm](https://tome.fm). You can also visit Firn's main page at [firn.io](https://firn.io).
