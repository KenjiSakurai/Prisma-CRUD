const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {

    const user = await prisma.user.create({
        data: {
            username:"",
            name: "",
            birthday: "", 
            password: "",
            pfpimg: ""
        },
    })

    const users = await prisma.user.findMany()


    console.log(user)
    console.log(users)
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