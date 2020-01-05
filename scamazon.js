var mysql = require ("mysql");
var inquirer = require ("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "scamazon_db",
    port: 3306
})
connection.connect();

var display = function (){
    connection.query("SELECT * FROM products", function (err, res){
        if (err) throw err;
        console.log("-------------------------");
        console.log("   Quit Gawkin'! Buy something, will ya?   ");
        console.log("-------------------------");
        console.log("");
        console.log("All products are 102% nearly quality sometimes");
        console.log("");
        var table = new Table({
        head: ["Product ID", "Product Description", "Cost"],
        colWidths: [12, 50, 8],
        colAligns: ["center", "left", "right"],
        style: {
            head: ["aqua"],
            compact: true
        }
    });
    for (var i=0; i<res.length; i++){
        table.push ([res[i].id, res[i].product, res[i].price]);
    }
    console.log(table.toString());
    console.log("");
    shopping();
});
};

var shopping = function (){
    inquirer.prompt({
        name: "productToBuy",
        type: "input",
        message: "What's the stock number? ... ... ... ID! What's da ID?! Do I gotta spell it out for ya?"
    }).then(function(answer1){
        
        var selection = answer1.productToBuy;
        connection.query("SELECT * FROM products WHERE id =?", selection, function(err, res){
            if (err) throw err;
            if (res.length === 0) {
                console.log("Is this some kinda joke? I ain't got nothin' like that.");

            shopping();
            } else {
                inquirer.prompt({
                    name: "quantity",
                    type: "input",
                    message: "Want me to crack open a new case of em, or just want one or two?"
                }).then(function(answer2){
                    var left = answer2.quantity;
                    if (left > res[0].quantity) {
                        console.log(
                            "Whatever. I only gots " + res[0].quantity + " of em. Try again, bub."
                        )
                        shopping();
                    }else{
                        console.log("");
                        console.log(res[0].product + " purchased");
                        console.log(left + " qty @ $" + res[0].price);

                        var newQuantity = res[0].quantity - left;
                        connection.query(
                            "Update products SET quantity =" + newQuantity + " WHERE id = " + res[0].id,
                            function(err, resUpdate) {
                                if (err) throw err;
                                console.log("");
                                console.log("A'ight. Here ya go.");
                                console.log("Don't let the door hit ya on the ass.");
                                console.log("");
                                connection.end();
                            }
                        );
                    }
                });
            }
        });
    });
};

display();