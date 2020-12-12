// current main function connects to our mongodb, runs a function listing Databases inside, and then closes
// you can copy and use this same structure to open, do something, and close anywhere you see necessary
async function main(){
	const {MongoClient} = require('mongodb');
	const uri = "mongodb+srv://CS411:movieapp@cluster0.yr08c.mongodb.net/CS411db?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

	//await client.connect();
	//await listDatabases(client);

	try {
		await client.connect();

	//	await listDatabases(client);

/*
Note: In the addition below, we add 3 fields, but we can have as many or few as we want. The only
necessary one is the _id which will be the easiest way to search for it later as all _id will be unique.
		await addToDatabase(client, {
								name: "Foo B",
								_id: 1,
								favorite: "Star Wars"
								}
							) */
	
/*	
Note: In this example below, we print out all 3 input fields from the add above,
but if we instead did data.favorite, it would only print out Star Wars.
	data = await readData(client, 1);
	console.log(data); */
	
 
	} catch (e) {
		console.error(e);
	} finally {
		await client.close();
	}
}
main().catch(console.error);

// lists databases within our mongodb project
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// adds a data object to the collection UserInfo
/* 
As an example: Say we wanted a user to tell us their favorite movie after login to
display on their page. We can call addToDatabase(client, {
													name: use the user.displayName google gave us,
													_id: use the user.id google gave us,
													favorite: include the string the user gave of their favorite movie
													}
												)
Now you would have created a file in the database with all those parameters that can be searched for using the _id field
using the following function. Note, you can also add the above main functions parts for connecting to the database when you're
calling this from a different script. (Currently commented out) In this, client is defined in the function so you can take it out of the input
*/
async function addToDatabase(client, data){
//	const {MongoClient} = require('mongodb');
//	const uri = "mongodb+srv://CS411:movieapp@cluster0.yr08c.mongodb.net/CS411db?retryWrites=true&w=majority";
//	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//	try {
//		await client.connect();

	
		await client.db("CS411db").collection("UserInfo").insertOne(data);
 
//	} catch (e) {
//		console.error(e);
//	} finally {
//		await client.close();
//	}
};


// finds and returns a data object from the database using the user.id from google as the dataID input.
/*
Similarly to above, this includes the code to open and close the database commented out so it will be easy to put back in
for you based on your preference. Again, in this case, remove the client input argument. This currently will return the full
data object including all the fields you included when you put the object in the database
*/
function readData(client, dataID){
	//	const {MongoClient} = require('mongodb');
//	const uri = "mongodb+srv://CS411:movieapp@cluster0.yr08c.mongodb.net/CS411db?retryWrites=true&w=majority";
//	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//	try {
//		await client.connect();

	
		result = client.db("CS411db").collection("UserInfo")
                        .findOne({ _id: dataID });
		return result;
 
//	} catch (e) {
//		console.error(e);
//	} finally {
//		await client.close();
//	}
};