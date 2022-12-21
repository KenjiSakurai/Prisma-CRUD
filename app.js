const bcrypt = require("bcrypt");
const multer = require("multer");
const express = require("express");
const ejs = require("ejs");
const { PrismaClient } = require('@prisma/client');
const bodyParser = require("body-parser");
const session = require("express-session"); 

const prisma = new PrismaClient()
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("images"));  

const storage = multer.diskStorage({
destination: function(req, file, cb) {
    cb(null, "./images");
},
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
var upload = multer({storage:storage});







app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))
  
function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else next('route')
}

app.get('/', isAuthenticated, (req, res)=>{
    res.locals.pfp = req.session.user.image;
    res.locals.username = req.session.user.username;
    res.locals.name = req.session.user.name;
    res.render('index');

});

app.get('/', (req, res)=>{
    res.render('index');
});


app.get('/create', (req, res)=>{
    res.render('create');
})

app.get('/login', (req, res)=>{
    res.render('login');
});

app.get('/update', (req, res)=>{
    res.render('update');
});

app.get('/delete', (req, res)=>{
    res.render('delete');
});



app.get('/logout', isAuthenticated, (req, res)=>{
    req.session.destroy(function(err) { })
    res.render('login');
});

app.post('/posted', upload.single("FormFile"), (req, res, next)=>{

    const bday = req.body.InputBday;
    const pass1 = req.body.InputPass;

    console.log(req.file);

    async function main() {
        const hashedpass = await bcrypt.hash(pass1, 10)
        const createuser = await prisma.prismaTable.create({
            data: {
                    username:req.body.InputUname,
                    name:req.body.InputFname,
                    birthday: new Date(bday),
                    password:hashedpass,
                    image:req.file.originalname
                },
        });
    }

    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.error(e)
            await prisma.$disconnect()
            process.exit(1)
        })
        res.redirect('login'); 
})


app.post('/check', (req, res)=>{

    const userName = req.body.InputUname;
    const password = req.body.InputPass;

    async function main()
    {
        req.session.regenerate(async(err)=>{
            const findUser = await prisma.prismaTable.findUnique({
                where:{
                    username: userName,
                }
            });
    
            const tempPass = findUser.password;
            const result = await bcrypt.compare(password, tempPass);
    
            if(result === true){
                req.session.save(function(err){
                    req.session.user=findUser;
                    req.session.secret = findUser.user_id;
                    console.log(req.session.user);
                    res.redirect("/");
                })
            } 
            else{
                console.log("Wrong Password!");
            }
        })
    }
    main();
})


app.post('/remove', (req, res) => {

    async function main(){
        const userName = req.body.InputUname;
        const password = req.body.InputPass;
        const findUser = await prisma.prismaTable.findUnique({
            where:{
                username: userName,
            }
        })

        const tempPass = findUser.password;
        const passcheck = await bcrypt.compare(password, tempPass);

        if(passcheck === true){
            const deleteUser = await prisma.prismaTable.delete({
                where: {
                    username: userName,
                },
            })
            req.session.destroy(function(err) { })
            res.render('login');
        } else{
            console.log("Wrong Information");
        }
    }
    main();
})




app.post('/change', (req, res) => {

    async function main(){
        const userName = req.body.InputUname;
        const password = req.body.InputPass;
        const newPass = req.body.InputNewPass;

        const findUser = await prisma.prismaTable.findUnique({
            where:{
                username: userName,
            }
        });

        const tempPass = findUser.password;
        const passcheck = await bcrypt.compare(password, tempPass);

        if(passcheck === true){ 

            const hashedpass = await bcrypt.hash(newPass, 10)
            const updateUser = await prisma.prismaTable.update({
                where: {
                    username: userName,
                },
                data: {
                    password: hashedpass,
                },
            })
            res.redirect('/');
        }
    }
    main();
})







// let accSum = 0;
// const numbers = [65, 44, 12, 4];
// numbers.forEach(myFunction);

// const tr = document.createElement("tr");

// function myFunction(item) {
//     accSum += item;

//     const td = document.createElement("td");
//     tr.appendChild(td);

// }





app.listen(2500)