// Week 12 Homework - Bamazon (Customer)

// require npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

// initialize connection to sql db
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "james",

    password: "asdfasdf",
    database: "bamazonDB"
});

// create connection
connection.connect(function (err) {
    // throw error if connection unsuccessful
    if (err) throw err;
    console.log("Succesfully connected!")
    // show the products from the bamazon db
    showProducts();
});

function showProducts() {
    // select all data from the products table
    connection.query("SELECT * FROM products", function (err, res) {
        // throw error if unable to make connection to this db
        if (err) throw err;
        // console.table the results
        console.table(res);
        // run the next function
        itemSelection(res);
    });
}

function itemSelection(inventory) {
    // inquirer prompt - ask user which item they would like to purchase
    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: "Please enter in the ID number for the item you would like to purchase. If you are no longer interested in purchasing an item, press [C] to cancel",
            // make sure user can only enter a number or [C] to cancel
            validate: function (val) {
                return !isNaN(val) || val.toUpperCase() === "C";
            }
        }
    ])
    .then(function (val) {
        // make sure user did not cancel
        userCancel(val.item_id);

        var userChoice = parseInt(val.item_id);

        // if user enters an item ID # in the products table, prompt for quantity
        if (checkInventory(userChoice, inventory)) {
            quantitySelection(checkInventory(userChoice, inventory));
        }
        // otherwise, let user know item is not in products table
        else {
            console.log("=======================================================================");
            console.log("Sorry, we could not find that item in our inventory. Please choose another item and try again.");
            console.log("=======================================================================");
            showProducts();
        }
    });
}

function quantitySelection(product) {
    // inquirer prompt - ask user how many of the selected item they want to purchase
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "Please enter in the desired quantity of the item selected. If you are no longer interested in purchasing an item, press [C] to cancel",
            // make sure user can only enter a number greater than 0 or 'C' to cancel
            validate: function (val) {
                return val > 0 || val.toUpperCase() === "C";
            }
        }
    ])
    .then(function (val) {
        // make sure user did not cancel
        userCancel(val.quantity);
        var quantity = parseInt(val.quantity);
        // if the quantity requested is greater than available stock, log to user
        if (quantity > product.stock_quantity) {
            console.log("=======================================================================");
            console.log("Sorry, we only have " + product.stock_quantity + " of this item remaining. Please select a lower quantity.");
            console.log("=======================================================================");
            showProducts();
        }
        else {
            // otherwise, finalize the purchase
            connection.query(
                "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
                [quantity, product.item_id],
                function (err, res) {
                    // Let the user know the purchase was successful, re-run showProducts
                    console.log("=======================================================================");
                    console.log("You have successfuly purchased " + quantity + " " + product.product_name + ". Your total was $" + (quantity * product.price).toFixed(2) + ".");
                    console.log("=======================================================================");
                    showProducts();
                }
            );
        }
    });
}

// check to see if item selected exists in the table
function checkInventory(userChoice, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === userChoice) {
            return inventory[i];
        }
    }
    return null;
}

// if user presses [C] during prompts, end the program
function userCancel(item_id) {
    if (item_id.toUpperCase() === "C") {
        console.log("Exiting...");
        process.exit(0);
    }
}
