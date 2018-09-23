# georgBot
A discord bot made for the Astral Army channel.
# Description
The "Georg" bot uses a simple resource system.
In few words, every user can create items, which are a `name-link` pair.

For example, using command `create itemName url`, user can create an `itemName-url` pair which they can later ask georg with command `get itemName`.
### Example
 **user**: georg create google https://www.google.com


**georg**: @user, success! created google!


###### Item 'google' is now created and stored inside georg's database. Now user can fetch it.

**user**: georg get google

**georg**: @user, https://www.google.com

# Available commands
#### The hot word is `georg`. Can be in uppercase too.
## get
Fetches an item from georg's database.
Template: `georg get ITEMNAME`
#### Example
**user**: georg get google

**georg**: @user, https://www.google.com

If requested item doesn't exist, **Georg** will inform that the item doesn't exist. *duh :P*
## create
Creates an item in Georg's database. User has to provide both a **name** for the item and a **url**.

If the item with provided name already exists, Georg will inform you about that.

Template: `georg create ITEMNAME URL`

#### Example 
 **user**: georg create google https://www.google.com


**georg**: @user, success! created google!

## edit
Edits an existing item in Georg's database. User has to provide georg with a **name** of the item and a new **url**.

Template: `georg edit ITEMNAME NEWURL`

Edits can be done by the original author of the item, moderator or administrator. No one else.
#### Example

**user**: georg edit google https://www.bing.com

**georg**: @user, edited item google!

## delete
Deletes an existing item in Georg's database. User has to provide georg with a **name** of the item.

Template: `georg delete ITEMNAME`

Deletes can be done by the original author of the **item**, **moderator** or **administrator**. No one else.
#### Example

**user**: georg delete google

**georg**: @user, deleted item google!

## help
Displays a basic help message.

Template: `georg help` | `georg help COMMAND`

#### Example
`georg help` `georg help get` `georg help create` etc.
## random
Fetches a random item from Georg's database.
Template: `georg random`
# Backup
Backup is done every 6 hours, all database changes are send to this repository.
# Logging
***There is no god, only log ~ Confucius***

Everything is logged to both files in the ./log folder.

Logs are send to this repository along with the database. In case something goes wrong, check there.

# How to run

#### You need node.js and npm to run georg.

1. clone this repository
2. `npm install`
3. node server.js
4. PROFIT
