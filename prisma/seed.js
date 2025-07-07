import { Sex, PrismaClient, IdType, RelationType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  // await prisma.admin.create({
  //   data: {
  //     id: 'admin1',
  //     username: 'admin1',
  //   },
  // });
  // await prisma.admin.create({
  //   data: {
  //     id: 'admin2',
  //     username: 'admin2',
  //   },
  // });

  // MEMBER
  // for (let i = 1; i <= 11; i++) {
  //   await prisma.person.create({
  //     data: {
  //       nationalId: `nationalId${i}`,
  //       idType: i % 2 === 0 ? IdType.GhCard : IdType.Passport,
  //       firstName: `FName ${i}`,
  //       middleName: `MName ${i}`,
  //       lastName: `PSurname ${i}`,
  //       gender: i % 2 === 0 ? Sex.Male : Sex.Female,
  //       birthday: new Date(
  //         new Date().setFullYear(new Date().getFullYear() - 10)
  //       ),
  //       spouseFullname: `SFullname ${i}`,
  //       spousebirthday: new Date(
  //         new Date().setFullYear(new Date().getFullYear() - 10)
  //       ),
  //       email: `member${i}@example.com`,
  //       telephone: `123-456-789${i}`,
  //       residence: `Residence ${i}`,
  //       underlying: i % 2 === 0 ? true : false,
  //       condition: `Condition${i}`,
  //       declaration: i % 2 === 0 ? true : false,
  //     },
  //   });
  // }

  // Child
  for (let i = 1; i <= 30; i++) {
    await prisma.child.create({
      data: {
        fullName: `CFullName${i}`,
        personId: Math.ceil(i / 2) % 11 || 11,
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 10)
        ),
      },
    });
  }

  // Parent
  for (let i = 1; i <= 30; i++) {
    await prisma.parent.create({
      data: {
        fullName: `CFullName${i}`,
        personId: Math.ceil(i / 2) % 11 || 11,
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 10)
        ),
        relationship: i % 2 === 0 ? RelationType.Father : RelationType.Inlaw,
      },
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
