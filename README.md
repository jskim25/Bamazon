# Bamazon
Week 12 homework

Bamazon is an Amazon-like storefront where the app takes in orders and changes the data in a SQL database to reflect the commands selected.

There are two main features to this app: the customer side and manager side. on the customer side, the user is able to select an item that he/she wishes to purchase and the quantity of that item. Once those two parameters are specified, the terminal will let the user know that the transaction was successful.

On the manager side, the user is able to do one of four things: view all the products for sale, view low inventory, add inventory, or add a new product.

Getting Started
Open the command line and type in "node bamazonCustomer.js" or "node bamazonManager.js" depending on what you are interested in doing. An inquirer prompt will give you directions each step of the way. There is a cancel command for both in case you'd like to exit the program.

Prerequisites
For this application to work, you will need to have installed the inquirer, mysql, and console.table npm packages.

Installing
To install an NPM package, type "npm install" followed by the NPM package name.