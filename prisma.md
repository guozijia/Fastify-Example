## Initialise prisma
npx prisma init --datasource-provider postgresql

### Migrate the schema
npx prisma migrate dev --name init

### 浏览器访问
npx prisma studio