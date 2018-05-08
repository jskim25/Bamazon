// Week 12 Homework - Bamazon (Manager)

// require npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

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
    console.log("Successfully connected!")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        showOptions(res)
    });
})

function showOptions(products) {
    // inquirer prompt - ask user what they want to do
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Cancel"],
            message: "Please select a command.",
        }
    ])
    .then(function (val) {
        switch (val.action) {
        case "View Products for Sale":
            showProducts();
            break;
        case "View Low Inventory":
            viewLowInventory();
            break;
        case "Add to Inventory":
            addInventory(products);
            break;
        case "Add New Product":
            addProduct(products);
            break;
        case "Cancel":
            userCancel();
            break;
        default:
            console.log("Select a valid command");
            break;
        }
    });
}

function showProducts() {
    // select all data from the products table
    connection.query("SELECT * FROM products", function (err, res) {
        // throw error if unable to make connection to this db
        if (err) throw err;
        // console.table the results
        console.table(res);
        // go back to options
        showOptions(res);
    });
}

// function that runs when user's input is 'view low inventory'
function viewLowInventory() {
    // show all items from the products table where stock quantity is less than or equal to 10
    connection.query("SELECT * FROM products WHERE stock_quantity <= 10", function (err, res) {
        if (err) throw err;
        console.table(res);
        // go back to options
        showOptions();
    });
}

// function that runs when user's input is 'add to inventory'
function addInventory(inventory) {
    console.table(inventory);
    inquirer.prompt([
        {
            type: "input",
            name: "add_inventory",
            message: "Which item would you like to restock? Enter in the item ID number.",
            validate: function (val) {
                return !isNaN(val);
            }
        }
    ])
    .then(function (val) {
        var userChoice = parseInt(val.add_inventory);

        // if the selected item can be found in the products table, prompt for quantity
        if (checkInventory(userChoice, inventory)) {
            quantitySelection(checkInventory(userChoice, inventory));
        }
        // otherwise, let user know item is not in products table
        else {
            console.log("=======================================================================");
            console.log("Sorry, we could not find that item in our inventory. Please choose another item and try again.");
            console.log("=======================================================================");
            // go back to options
            showProducts();
        }
    });
}

function quantitySelection(product) {
    // inquirer prompt - ask user how many of the selected item they want to add to inventory
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "Please enter in the quantity that you would like to add to the current stock.",
            validate: function (val) {
                return val > 0;
            }
        }
    ])
    .then(function (val) {
        var quantity = parseInt(val.quantity);
        // update the table with the specified quantity
        connection.query(
            "UPDATE products SET stock_quantity = ? WHERE item_id = ?", [product.stock_quantity + quantity, product.item_id], function (err, res) {
                // let user know quantity added successfully
                console.log("=======================================================================");
                console.log("Successfully added to inventory.");
                console.log("=======================================================================");
                // go back to options
                showOptions();
            }
        );
    });
}

// function that runs when user's input is 'add new product'
function addProduct(products) {
    // prompt user for name, dept, price, quantity (all columns from 'products' table)
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Product name:"
        },
        {
            type: "input",
            name: "department_name",
            message: "Department:"
        },
        {
            type: "input",
            name: "price",
            message: "Price:",
            validate: function (val) {
                return val > 0;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Stock Quantity:",
            validate: function (val) {
                return !isNaN(val);
            }
        }
    ])
    // insert into db
    .then(function(val) {
        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [val.product_name, val.department_name, val.price, val.quantity], function (err, res) {
            if (err) throw err;
            console.log("=======================================================================");
            console.log(val.product_name + " has been added to inventory.");
            console.log("=======================================================================");
            showOptions();
        })
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

// if user's input is [C] at any of the prompts, end the program
function userCancel() {
    console.log("Exiting...");
    process.exit(0);
}
