## Prisma

`npx prisma db pull` - adds prisma models to `schema.prisma` that reflect current DB state

`npx prisma db push` - adds prisma models from `schema.prisma` to DB

`npx prisma db seed` - adds initial data to DB see [this][https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding]

`npx prisma studio` - opens prisma ui on port 5555

`npx prisma generate` - adds javascript typings that correlate to our data models (`schema.prisma`)

## Useful NPM Commands

`npm run dev` - starts the server locally in dev mode on port `8080`, features hot reloading

`npm run db-push` - runs `prisma db push`

`npm run db-seed` - runs `prisma db seed`

`npm run prisma-generate` - runs `prisma generate`

`npm run prisma-studio` - runs `prisma studio`

TEST DATA
PARENT USER WITH CHILDREN:
User: Klaus
email:email@email.com
Password: IAmASpy
