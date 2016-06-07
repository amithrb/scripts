/* 
 Author: Prateek
 Description:    This is a casperjs automated test script for showning that when a cells from a notebook is modified from Rcloud, the respective
 content should be modified from search Results
 */

//Begin Tests
casper.test.begin(" Edit a multiple cells from a single notebook", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item1 = "'GameOf'";//1st item to be searched
    var item2 = "'Thorne'";//item to be searched
    var title;//get notebook title
    var temp;

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

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("Notebook title : " + title);
        this.wait(2000);
        combo = github_username + ' / ' + title;
    });

    //Added a new cells
    functions.addnewcell(casper);
    functions.addnewcell(casper);

    //Add contents to this cell and then execute it using run option
    casper.then(function () {
        this.sendKeys({
            type: 'xpath',
            path: "/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[3]/div[1]/div[2]/div/div[2]/div"
        }, item1);//Adding contents to the second cell
        this.wait(2000);
        this.click({
            type: 'xpath',
            path: "/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div"
        });//Clicking on 1st cell
        this.sendKeys({
            type: 'xpath',
            path: "/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div"
        }, item1);//Adding contents to the first cell
        this.wait(2000);
        this.click({type: 'xpath', path: '//*[@id="run-notebook"]'});//Clicking on Run-all button
        this.wait(2000);
    });

    casper.viewport(1024, 768).then(function () {

        //checking if Search div is open
        casper.then(function () {
            if (this.visible('#input-text-search')) {
                console.log('Search div is already opened');
            }
            else {
                var z = casper.evaluate(function () {
                    $(' .icon-search').click();
                });
                this.echo("Opened Search div");
            }
        });

        //entering item to be searched
        casper.then(function () {
            this.sendKeys('#input-text-search', item1);
            this.wait(6000);
            this.click('#search-form > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)');
        });

        casper.wait(5000);

        //counting number of Search results
        casper.then(function () {
            var counter = 0;
            do
            {
                counter = counter + 1;
                this.wait(2000);
            }
            while (this.visible(x('/html/body/div[3]/div/div[1]/div[1]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr[1]/td/a')));

            counter = counter - 1;
            this.echo("number of search results:" + counter);

            if (counter > 0) {
                this.test.pass("searched item has been found ");
            }
            else {
                this.test.fail("search item didnot find ");
            }
        });
    });

    //Modify contents to this cell and then execute it using run option
    casper.then(function () {
        this.click({type: 'xpath', path: "/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[2]/span[2]/i"});
        this.sendKeys({
            type: 'xpath',
            path: "html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div"
        }, item2);
        this.wait(2000);
    });
    casper.then(function () {
        this.click({type: 'xpath', path: "/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[2]/div[2]/span[2]/i"});
        this.sendKeys({
            type: 'xpath',
            path: "/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[3]/div[1]/div[2]/div/div[2]/div"
        }, item2);
        this.wait(2000);
    });

    casper.wait(5000);

    casper.then(function () {
        var z = casper.evaluate(function () {
            $('#save-notebook').click();
        });

        this.echo("executed the modified contents of First and second cell");
        this.wait(6000);
    });

    //reload the page to make the cell editable
    casper.then(function () {
        this.reload();
        this.echo("Page reloaded");
        this.wait(10000);
    });
    casper.wait(3000);

    casper.viewport(1024, 768).then(function () {
        temp = item1 + item2;

        //checking if Search div is open
        casper.then(function () {
            if (this.visible('#input-text-search')) {
                console.log('Search div is already opened');
            }
            else {
                var z = casper.evaluate(function () {
                    $(' .icon-search').click();
                });
                this.echo("Opened Search div");
            }
        });

        //entering item to be searched

        casper.then(function () {
            this.sendKeys('#input-text-search', temp);
            this.wait(6000);
            this.click('#search-form > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)');
        });

        casper.wait(5000);

        //counting number of Search results
        casper.then(function () {
            var counter = 0;
            do
            {
                counter = counter + 1;
                this.wait(2000);
            }
            while (this.visible(x('/html/body/div[3]/div/div[1]/div[1]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr[1]/td/a')));

            counter = counter - 1;
            this.echo("number of search results:" + counter);

            if (counter > 0) {
                this.test.pass("searched item has been found as per cell modifications ");
            }
            else {
                this.test.fail("searched item didnot find ");
            }
        });
    });

    casper.then(function () {
        var z = casper.evaluate(function () {
            $('.icon-trash').click();
        });
    });

    casper.wait(3000);

    casper.run(function () {
        test.done();
    });
});
