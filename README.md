# georgBot
A discord bot made for the Astral Army channel.
# Description
The "Georg" bot uses a simple resource system.
In few words, every user can create items, which are a `name-link` pair.

For example, using command `create itemName url`, user can create an `itemName-url` pair which they can later ask georg with `@GEORG itemName".`
### Example
 **user**: @GEORG create google https://www.google.com


**georg**: @user, success! created google!


###### Item 'google' is now created and stored inside georg's database. Now user can fetch it.

**user**: @GEORG get google

**georg**: @user, https://www.google.com

# Available commands
To use georg, just mention him and provide a command.
***
## get
Fetches an item from georg's database.
Template: `@GEORG ITEMNAME` or a shortcut: `%g ITEMNAME`
#### Example
**user**: @GEORG google

**georg**: @user, https://www.google.com

***
## create
Creates an item in Georg's database. User has to provide both a **name** for the item and a **url**.

Template: `@GEORG create ITEMNAME URL`

#### Example
 **user**: @GEORG create google https://www.google.com


**georg**: @user, success! created google!
***
## edit
Edits an existing item in Georg's database. User has to provide georg with a **name** of the item and a new **url**.

Template: `@GEORG edit ITEMNAME NEWURL`

Edits can be done by the original author of the item, moderator or administrator.
#### Example

**user**: @GEORG edit google https://www.bing.com

**georg**: @user, edited item google!
***
## delete
Deletes an existing item in Georg's database. User has to provide georg with a **name** of the item.

Template: `@GEORG delete ITEMNAME`

Deletes can be done by the original author of the **item**, **moderator** or **administrator**.
#### Example

**user**: @GEORG delete google

**georg**: @user, deleted item google!
***
## help
Displays a basic help message.

Template: `@GEORG help` | `@GEORG help COMMAND`

#### Example
`@GEORG help` `@GEORG help get` `@GEORG help create` etc.
***
## random
Fetches a random item from Georg's database.
Template: `@GEORG random`

If you specify a second parameter, Georg will get you only an item which contains the searched word.

Template : `@GEORG random query`
***
## wiki
Fetches a random article link from the Eureka seveN Wiki.

Template: `@GEORG wiki` or `@GEORG wiki searchword`
***
# Backup
Backup is done every 3 hours, all database changes are sent to this repository.
***
# How to run

#### You need node.js and npm to run georg.

1. clone this repository
2. `npm install`
3. npm start

***
# Future
If you have an idea for a feature, send me a message!

Ideas List
1. Welcome message
2. Logging message edits, and all that jazz
8. Periodic Events ( quizes or sth like that )
