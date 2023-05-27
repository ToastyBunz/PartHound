const item1 = {
  supplier: "Bilstein",
  businessType: 1, // 1 = manufactuer 2 = distributer
  price: 100,
  inStock: 116,
  shipLocation: "Henderson, NV",
  shippingTime: 2,
};

const item2 = {
  supplier: "Turn14",
  businessType: 2, // 1 = manufactuer 2 = distributer
  price: 110,
  inStock: "backordered",
  shipLocation: "Austin, Tx",
  shippingTime: 3,
};

const item3 = {
  supplier: "Turn14",
  businessType: 2, // 1 = manufactuer 2 = distributer
  price: 115,
  inStock: 2,
  shipLocation: "Pittsburg, PA",
  shippingTime: 5,
};

const item4 = {
  supplier: "Meyer",
  businessType: 2, // 1 = manufactuer 2 = distributer
  price: 120,
  inStock: 25,
  shipLocation: "Henderson, NV",
  shippingTime: 2,
};

const item5 = {
  supplier: "Meyer",
  businessType: 2, // 1 = manufactuer 2 = distributer
  price: 95,
  inStock: 10,
  shipLocation: "MDI, ME",
  shippingTime: 14,
};

const item6 = {
  supplier: "Meyer",
  businessType: 2, // 1 = manufactuer 2 = distributer
  price: 95,
  inStock: "backordered",
  shipLocation: "MDI, ME",
  shippingTime: 28,
};

const availableProducts = [item1, item2, item3, item4, item5, item6];
var filterSupps = ["Bilstein", "Turn14"];

const multiFilterManu = function (arrayFilters, arrayBase) {
  var tempList = [];
  arrayFilters.forEach(function (obj) {
    var tempTempList = arrayBase.filter(function (dist) {
      if (
        dist.supplier === undefined ||
        dist.supplier.toLowerCase() != obj.toLowerCase()
      ) {
        return false;
      } else {
        return true;
      }
    });
    tempList = tempList.concat(tempTempList);
  });

  return tempList;
};

const test = multiFilterManu(filterSupps, availableProducts);
console.log(test);

// // for (var key in filterSupps) {
// //   console.log(filterSupps[key]);
// // }

// // const suppers = availableProducts.filter(function (obj) {

// // console.log(suppers);

// var filter = {
//   address: "England",
//   name: "Mark",
// };
// var users = [
//   {
//     name: "John",
//     email: "johnson@mail.com",
//     age: 25,
//     address: "USA",
//   },
//   {
//     name: "Tom",
//     email: "tom@mail.com",
//     age: 35,
//     address: "England",
//   },
//   {
//     name: "Mark",
//     email: "mark@mail.com",
//     age: 28,
//     address: "England",
//   },
// ];

// // users = users.filter(function (item) {
// //   for (var key in filter) {
// //     if (item[key] === undefined || item[key] != filter[key]) return false;
// //   }
// //   return true;
// // });

// // console.log(users);

// pepes = ["mark", "Tom"];

// const namer = users.filter(
//   (people) =>
//     pepes[0].toLowerCase() == people.name.toLowerCase() ||
//     pepes[1].toLowerCase() == people.name.toLowerCase()
// );
// console.log(namer);
