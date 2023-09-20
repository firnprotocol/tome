# TOME: _Anonymous Broadcast_, by Firn Protocol

Tome has two purposes:
1. To demonstrate, by the means of an open-source, easy-to-understand repository, how to use Firn's [MetaMask Snap](https://github.com/MetaMask/snaps) (itself available on npm at [`@firnprotocol/snap`](https://www.npmjs.com/package/@firnprotocol/snap)).
2. To be useful in its own right.

Tome allows anyone to immutably post data onto Ethereum (actually, onto the Base L2), while moreover hiding his identity (by concealing who paid the gas to have the data posted). This wasn't possible before Tome!

Once you understand how Firn's Snap works, Tome is very easy to understand. Firn's Snap lets an arbitrary Dapp (like Tome) privately execute Ethereum transactions on behalf of its users. In the case of Tome, the transactions at hand are very simple: they just call a function whose single effect is to emit an Event, containing a user-supplied string. Tome solicits that string from the user, and forwards it to Firn's Snap.

Simple, yet extremely powerful. How will _your_ Dapp use Firn's Snap to "plug" privacy into its functionality?

You can access a live, hosted version of Tome at [tome.fm](https://tome.fm). You can also visit Firn's main page at [app.firn.cash](https://app.firn.cash).
