/*
 Author: Sanket (tc_61.1.2.js)
 Description: This is casperJS automated test to check whether locator() gets invoked with R cell without plot
*/
//Begin

casper.test.begin("Invoke locator function without plot", 6, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "locator(2)";
    

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //add a new cell and execute its contents
    functions.addnewcell(casper);
    functions.addcontentstocell(casper,input_code);

    //check for locator() feature to be invoked 
    casper.then(function() {
        this.test.assertVisible('.icon-exclamation', 'Locator feature didn\'t get invoked' ); 
        this.wait(2000)
    });

    //Delete the cell created for this test case
    casper.then(function(){
        this.mouse.move('.jqtree-selected > div:nth-child(1) > span:nth-child(1)');
        this.wait(2000)
        this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)')
    });

    casper.run(function () {
        test.done();
    });
});
    


