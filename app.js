//Dependencies and Express initialization
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

//Instantiate Connection wih DB
const connection = mysql.createConnection({
    user:'root',
    host:'localhost',
    //Might Need PW for local root user
    password:'',
    database:'quickdb',   
});

//Check Connection with DB
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected');
});

//Set 'views' directory
app.set('views',path.join(__dirname,'views'));

//Establish ejs and initialize body-parser
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Index
app.get('/', (req, res) => {
    res.render('user_index', {
        title : "Welcome to QuickCab"
    });
});

//Showing Details to User before confirming order
app.get('/confirm/:reg_id/:driver_id/:customer_id', (req, res) => {
    //Saving arguments received and initialzing variables
    let regionId = req.params.reg_id;
    let cus_id = req.params.customer_id;
    let driver_id = req.params.driver_id;
    let cus_fname, cus_lname;
    let tax = .08;
    let fee;
    // Randomly generated values
    let trip_id = Math.floor(Math.random()*90000) + 10000;
    let trip_miles = Math.floor(Math.random()*90) + 10;
    let cost_gas = (Math.random() * (4.0 - 2.5) + 2.5).toFixed(2);

    //Get Region Fee
    let getRegion =`SELECT fee FROM REGION WHERE reg_id=${regionId}`;
    let getFee = connection.query(getRegion,(err,result) =>{
        if (err) throw err;
        fee = result[0].fee;
        
        //Calculate Order Cost
        let total_cost = ((((trip_miles * cost_gas) * tax) + ((trip_miles * cost_gas) * fee) + (trip_miles * cost_gas))).toFixed(2);
        
        //Get Custumoer details for invoice
        let getNames = `SELECT cus_fname,cus_lname FROM customer WHERE cus_id=${cus_id}`; 
        let names = connection.query(getNames,(err,result) => {
        if (err) throw err;
        cus_fname = result[0].cus_fname;
        cus_lname = result[0].cus_lname;
        
        //Invoice model
        let data = {trip_id: trip_id,
            driver_id:driver_id,
            cus_id:cus_id,
            reg_id: regionId,
            cus_fname: cus_fname,
            cus_lname: cus_lname,
            fee : fee,
            trip_miles: trip_miles,
            cost_gas:cost_gas,
            tax:tax,
            total_cost: total_cost};
        
       //Show invoice     
       res.render('confirm_trip',{
           invoice : data
    })
   });
  });
});

//Post confirmed invoice to Database
app.post('/submit_trip', (req, res) => {
    let data = {trip_id: req.body.trip_id,
        driver_id: req.body.driver_id,
        cus_id: req.body.cus_id,
        reg_id: req.body.reg_id,
        cus_fname: req.body.cus_fname,
        cus_lname: req.body.cus_lname,
        fee : req.body.fee,
        trip_miles: req.body.trip_miles,
        cost_gas:req.body.cost_gas,
        tax:req.body.tax,
        total_cost: req.body.total_cost};
    //Insert into DB
    let register = "INSERT INTO invoice SET ?"
    let query = connection.query(register,data,(err) =>{
        if(err) throw err;
        res.render('thankyou');
    });
});

//Register User to Database
app.post('/register', (req, res) => {
    //Randomly generate ID
    let user_id = Math.floor(Math.random()*90000) + 10000;
    //Customer model
    let data = {cus_id: user_id, reg_id: req.body.reg_id, cus_fname: req.body.cus_fname, cus_lname:req.body.cus_lname, dest_address:req.body.dest_address};
    
    let register = "INSERT INTO customer SET ?"
    let driverSet = `SELECT * FROM DRIVER WHERE reg_id = ${req.body.reg_id}`
    
    //Post Customer to DB
    let query = connection.query(register,data,(err) =>{
        if(err) throw err;
    });

    //Render Avaialble Drivers according to Region
    let driverSelect = connection.query (driverSet , (err,rows) => {
        if (err) throw err;
        res.render( 'user_select_driver', {
           title : "Drivers Available",
           driver : rows,
           customer : data
        });
    });
});

//Detailed view of driver
app.get('/user_view_driver/:driver_id/:cus_id', (req,res) => {
    const driver_id = req.params.driver_id;
    const customer = {cus_id:req.params.cus_id};
    
    //Retrieve Specific Driver and Render info
    let sql = `SELECT * FROM driver WHERE driver_id = ${driver_id}`;
    let query = connection.query (sql , (err,result) => {
        if (err) throw err;
        res.render( 'User_view_driver', {
           title : "Driver Information:"+ result[0].f_name,
           driver : result[0],  
           customer : customer
        });
    });
});

//Show all invoices
app.get('/invoice_table', (req,res) => {
    let sql = "SELECT * FROM invoice";
    let query = connection.query (sql , (err,rows) => {
        if (err) throw err;
        res.render( 'invoice', {
           title : "Invoices Available",
           invoice : rows
        });
    });
});

//Show all drivers
app.get('/driver_index', (req,res) => {
    let sql = "SELECT * FROM driver";
    let query = connection.query (sql , (err,rows) => {
        if (err) throw err;
        res.render( 'driver_index', {
           title : "Drivers Available",
           driver : rows
        });
    });
});

//Show detailed account of specific driver
app.get('/view_driver/:driver_id/', (req,res) => {
    const driver_id = req.params.driver_id;
    let sql = `SELECT * FROM driver WHERE driver_id = ${driver_id}`;
    let query = connection.query (sql , (err,result) => {
        if (err) throw err;
        res.render( 'view_driver', {
           title : "Driver Information:"+ result[0].f_name,
           driver : result[0],  
        });
    });
});

//Edit Current Driver
app.get('/edit_driver/:driver_id', (req,res) => {
    const driver_id = req.params.driver_id;
    //Retrieve Driver Record and send to Client for manipulation
    let sql = `SELECT * FROM DRIVER WHERE driver_id = ${driver_id}`;
    let query = connection.query (sql , (err,result) => {
        if (err) throw err;
        res.render( 'edit_driver', {
           title : "Edit Information:"+ result[0].f_name,
           driver : result[0]   
        });
    });
});

//Delete Specific Driver
app.get('/delete_driver/:driver_id',(req, res) => {
    const driver_id = req.params.driver_id;
    let sql = `DELETE from DRIVER where driver_id = ${driver_id}`;
    let query = connection.query(sql,(err) => {
        if(err) throw err;
        res.redirect('/driver_index');
    });
});

//Update Driver Info
app.post('/update',(req, res) => {
    const driver_id = req.body.driver_id;
    //Receive arguments and Post to DB
    let sql = "UPDATE driver SET driver_id='"+req.body.driver_id+"',  car_id='"+req.body.car_id+"',  reg_id='"+req.body.reg_id+"', f_name='"+req.body.f_name+"', l_name='"+req.body.l_name+"' WHERE driver_id ="+driver_id;
    let query = connection.query(sql,(err) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//New driver Page
app.get('/add_driver', (req, res) => {
    res.render('add_driver', {
        title : "Add New Driver"
    });
});

//Receive arguments for new Driver and post to DB
app.post('/save', (req, res) => {
        let data = {driver_id: req.body.driver_id,car_id: req.body.car_id,reg_id: req.body.reg_id, f_name: req.body.f_name, l_name: req.body.l_name};
        let sql = "INSERT INTO driver SET ?"
        let query = connection.query(sql,data,(err) =>{
            if(err) throw err;
            res.redirect('/');
        });
});

//Establish express server port
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
