# SSPChat
A privacy centered centralized chat platform.
## FAQ
### Why?
I did this as a side project to combine different technologies. From the perspective of a student this is a very interesting project as it involves asymmetric encryption, database managemenent, web development, server-client communication, websockets...
However, it must also be noted that we are in a moment in time where privacy is lacking. There are few companies that will or are able to protect your privacy when using their products. The objective of this chat platform is to make it mathematically impossible for any government or individual to eavesdrop even if they have full access to the database. It may be centralized but the central server has no idea what is happening.
### How?
This is done by moving all the encryption from the centralized server to the client. In this code you will notice that all libraries related to encryption and public/private key pairs are in the client folder. This means however, that security is also moved from the server to the user. The server only stores your private key encrypted by a password.
### What government?
By government I do not mean those governments that are openly restrictive such as the Chinese government. Here in Europe we are slowly becoming illusions of free societies. People should be able to say, communicate whatever they want as long as it does not constitute a threat, plausible incitement of violence or defamation. This software helps ensure this right is never denied.
### The code sucks.
I am well aware, feel free to give feedback.
### Why not use x js rendering library? (React, Vue...)
no

