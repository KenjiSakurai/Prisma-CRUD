# Prisma-CRUD

This project is a prototype of a login system utilizing all abilitiies of CRUD(Create, Read, Update, Delete). 
I used the include function in EJS to display the navigation bar which cut of a lot of repetetive and bulky code. Another challenge for me was learning how to work with node.js and prisma. 

## CRUD
The Create part was the first thing that I worked on in the project. I made a registration form where you would input thing like name password and birthday. When you then clicked submit it would send the input data to a phpMyAdmin database that I had set up with XAMPP. The password is encrypted through the bcrypt function for security. Logging in was done by fetching the login data from the database and comparing to the input. If it matches a session is started to keep you logged in when switching between the different pages on the project. Changing password can be done by reading and comparing the input with the database just like in Read and when confirmed it will use the prisma update function to change the password. Deletion of an account is done similarly but with the prisma delete function. 

One problem I faced was that the index page would not load if you were not logged in to an account due to the fact that it displayed a variable that remains undefined until an account has logging in. This was solved by making an If-else statement containing the locals property. 