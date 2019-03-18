const faker = require("faker/locale/pt_BR");

// {
//   firstName: "Rafael",
//   lastName: "Fagundes",
//   fullName: "Rafael Fagundes",
//   email: "rafaelcflima@gmail.com",
//   gender: "M",
//   phone: [
//   {
//           number: "32991267913",
//           whatsApp: true
//   }
//   ],
//   company: ObjectId("5c3e0d49eeeedc6846411e0e"),
//   createdAt: ISODate("2019-02-26 22:00")
// }

for (let index = 0; index < 10; index++) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const fullName = firstName + " " + lastName;
  const email = faker.internet.email();
  const gender = "F";
  const phone = [
    {
      number: faker.phone.phoneNumber(),
      whatsApp: faker.random.boolean()
    }
  ];

  object = {
    firstName,
    lastName,
    fullName,
    email,
    gender,
    phone,
    company: `ObjectId("5c3e0d49eeeedc6846411e0e")`,
    createdAt: `ISODate("2019-02-26 22:00")`
  };

  console.log(object);
}

// objTemplate = {
//   firstName: faker.name.firstName,
//   lastName: faker.name.lastName,
//   fullName: "Rafael Fagundes",
//   email: "rafaelcflima@gmail.com",
//   gender: "M",
//   phone: [
//     {
//       number: "32991267913",
//       whatsApp: true
//     }
//   ],
//   company: `ObjectId("5c3e0d49eeeedc6846411e0e")`,
//   createdAt: `ISODate("2019-02-26 22:00")`
// };

// console.log(objTemplate);
