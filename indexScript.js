// Version 3 will have an order builder function
// how many parts do you need
// how quickly do you need
// - builds a combination of different suppliers to minimize cost while fulfilling parameters
// - loading bar
// - blue check system

// Placeholder data

const item1 = {
  supplier: "Bilstein",
  businessType: 1, // 1 = manufactuer 2 = distributer
  price: 100,
  inStock: 116,
  shipLocation: "Henderson, NV",
  shippingTime: 3,
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
  inStock: "backordered",
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

// Code for parsing data
const filterCatagories = document.querySelector(".supplier__filters");
const partsEntries = document.querySelector(".product__row");
const searchButton = document.querySelector(".search");
const filtersButton = document.querySelector(".filters__button");

// Run the data through some filters, then display with HTML

const displayFilters = function (returnedProducts, sort = false) {
  //   productSupplyers.innerHTML = "";
  const manufacturerSet = new Set();
  const distributorSet = new Set();
  var inStockArray = [];
  var inStockArraySTR = [];
  const shippingArray = [];
  const shippingArraySTR = [];

  // filter numerical arrays by catagory (magnetude) for checkboxes
  const filterArray = function (
    item,
    mag1,
    mag2,
    mag3,
    mag4,
    arrayStr,
    arrayNum
  ) {
    if (typeof item === "string") {
      arrayStr.unshift(item);
    } else if (item >= mag4) {
      arrayNum.unshift(mag4);
    } else if (item >= mag3) {
      arrayNum.unshift(mag3);
    } else if (item >= mag2) {
      arrayNum.unshift(mag2);
    } else if (item >= mag1) {
      arrayNum.unshift(mag1);
    } else {
      arrayNum.unshift(1);
    }
  };

  // sort out manufacturers and distributers for sorting by checkboxes
  returnedProducts.forEach(function (item) {
    if (item.businessType == 1) {
      manufacturerSet.add(item.supplier);
    }
    if (item.businessType == 2) {
      distributorSet.add(item.supplier);
    }

    filterArray(item.inStock, 4, 10, 25, 100, inStockArraySTR, inStockArray);
    filterArray(
      item.shippingTime,
      2,
      3,
      7,
      14,
      shippingArraySTR,
      shippingArray
    );
  });

  // sort the numerical catagories least to greatest, convert to string add +
  const orderArrays = function (arrayNum, arrayStr) {
    arrayNum.sort(function (a, b) {
      return a - b;
    });
    var arraySTR = arrayStr.concat(arrayNum);
    var arraySTR = arraySTR.toString();
    var arrayBae = arraySTR.split(",");
    // var arrayBae = arrayBae.map(function (obj) {
    //   return (obj += "+");
    // });

    return arrayBae;
  };

  // add numerical array to str array, convert to set to remove duplicates
  var inStockSet = new Set(orderArrays(inStockArray, inStockArraySTR));
  var shippingSet = new Set(orderArrays(shippingArray, shippingArraySTR));

  // this is what to modify if you want to show more filters
  const filters = [
    { filter: "manufacturers", set: manufacturerSet, titleCheck: 1 },
    { filter: "distributors", set: distributorSet, titleCheck: 1 },
    { filter: "In-Stock", set: inStockSet, titleCheck: 0 },
    { filter: "Shipping-Speed", set: shippingSet, titleCheck: 0 },
  ];

  // Creates HTML injection if set greater than 1, adds a filter row HTML injection for each element of set
  const showfilters = function (arrayOfFilters) {
    arrayOfFilters.forEach(function (filterElement) {
      // console.log(filterElement.filter, filterElement.set);
      if (filterElement.set.size > 0) {
        if (filterElement.titleCheck === 1) {
          var titleHtml = `
          <div class="filters__row">
            <div class="filters__type--title">
                <input type="checkbox" checked id="${filterElement.filter}--title" value=1>
                <label for="${filterElement.filter}--title">${filterElement.filter}</label>
            </div>
          </div>
        `;
        } else {
          var titleHtml = `
        <div class="filters__row">
          <div class="filters__type--title">
            <label for="${filterElement.filter}--title">${filterElement.filter}</label>
          </div>
        </div>
      `;
        }

        filterCatagories.insertAdjacentHTML("beforeend", titleHtml);

        // adds a row for each sub element
        filterElement.set.forEach(function (mov) {
          var subHTML = `
                  <div class="filters__row">
                    <div class="filters__type--norm">
                      <input type="checkbox" checked value="${mov}" class="subChecks--${filterElement.filter}"/>
                      <label for="${filterElement.filter}--norm">${mov}</label>
                    </div>
                  </div>
                `;

          filterCatagories.insertAdjacentHTML("beforeend", subHTML);
        });
      }
    });
  };

  showfilters(filters);
  return filters;
};

const filters = displayFilters(availableProducts);

// filters full list of products, sorts by rank, returns 15 at a time
const filterProducts = function (
  products, // array of products
  // sameSupplier = 0, something to implament in V.3 bundles
  manufacAll = 1, // 1 or 0
  distribAll = 1, // 1 or 0
  manufacturers = [], // array of strings
  distributers = [], // array of strings
  inStock = -1, // int to be greater than
  shipSpeed = -1 // int to be less than
) {
  console.log("Product list:", products);

  var masterList = [];
  const multiFilter = function (arrayBase, arrayFilters) {
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

    console.log("tempList:", tempList);
    return tempList;
  };

  // checks if all manufacturers are selected
  if (manufacAll === 1) {
    var manufac = products.filter(function (variable) {
      return variable.businessType === 1;
    });
  }
  // adds only the manufacturers selected to mnufa
  else {
    var manufac = multiFilter(products, manufacturers);
  }

  // checks if all distributers were selected
  if (distribAll === 1) {
    // if check list.includes(product.supplier.toLowerCase())
    var distri = products.filter(function (variable) {
      return variable.businessType === 2;
    });
  }
  // adds only distributers selected
  else {
    var distri = multiFilter(products, distributers);
  }

  masterList = masterList.concat(manufac, distri);

  // filters out anythong above the inStock variable
  // if (inStock != -1) {
  //   masterList = masterList.filter(function (variable) {
  //     return variable.inStock >= inStock;
  //   });
  // }

  // Transforms inStockNumbers string elements to int
  if (Array.isArray(inStock)) {
    var inStockNumbers = inStock.map(function (x) {
      return parseInt(x, 10);
    });
    console.log("real in stock", inStockNumbers);
  }

  //TODO: get this to compare variable.inStock to the minimum value in inStockNumbers
  if (inStock != -1) {
    masterList = masterList.filter(function (variable) {
      if (Number(variable.inStock) >= inStock) {
        // console.log(`${variable.inStock} is greater than ${inStock}`);
        console.log("var_1", Number(variable.inStock));
        console.log("var_2 instock", inStock);
        // console.log("variable", variable);
      }
    });
  }

  // filters out anythong above the shipSpeed variable
  if (shipSpeed != -1) {
    masterList = masterList.filter(function (variable) {
      return variable.shippingTime <= shipSpeed;
    });
  }
  return masterList;
};

// Sorts products from least to greatest (cost, shipping)
// defaults to cheepest will add best in the near future
const sortProducts = function (arrayBase, cheepest = 1, fastest = 0) {
  if (cheepest === 1) {
    function compareNumbers(a, b) {
      return a.price - b.price;
    }
    arrayBase = arrayBase.sort(compareNumbers);
  }

  if (fastest === 1) {
    function compareNumbers(a, b) {
      return a.shippingTime - b.shippingTime;
    }
    arrayBase = arrayBase.sort(compareNumbers);
  }

  console.log(arrayBase);
  return arrayBase;
};

// Display rows of products from the filtered list
const displayProducts = function (returnedProducts, sort = false) {
  const productRows = function (rp, sort = false) {
    // image = "";
    supplier = rp.supplier; // placeholder for image
    inStock = rp.inStock;
    shippingTime = rp.shippingTime;
    price = rp.price;
    // savings = 0; Not sure how to implament this yet

    html = `
    <div class="product__info">
    <div class="product__supplier">${supplier}</div>
    <div class="product__inStock">${inStock} Units</div>
    <div class="product__shippingTime">${shippingTime} Days</div>
    <div class="product__price">$${price}</div>
    </div>`;

    partsEntries.insertAdjacentHTML("beforeend", html);
  };

  //
  returnedProducts.forEach(function (item) {
    productRows(item);
  });
};

displayProducts(
  sortProducts(
    filterProducts(
      availableProducts,
      (manufacAll = 1),
      (distribAll = 1),
      (manufacturers = []),
      (distributers = []),
      (inStock = -1),
      (shipSpeed = -1)
    ),
    (cheepest = 1),
    (fastest = 0)
  )
);

searchButton.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();
  var quantity = document.getElementById("quanitiyfilter");
  var date = document.getElementById("datefilter").value;

  console.log(quantity);
  console.log(date);
});

// document.querySelector(".messageCheckbox").checked;

// let currentDate = new Date().toJSON().slice(0, 10);
// console.log(currentDate); // "2022-06-17"

// var date = moment();
// var disDate = date.format("YYYY-MM-DD");
// console.log(disDate); // "2023-05-14"

// Creates a list for each sub element in filters and injects into function to show only selected items
filtersButton.addEventListener("click", function (e) {
  e.preventDefault();

  const checked = function (checkbox) {
    var isChecked = 0;
    if (checkbox.checked) {
      isChecked = 1;
    }
    return isChecked;
  };

  // Get manufac and dist elements and determine if checked
  var manuCheck = document.getElementById("manufacturers--title");
  var distCheck = document.getElementById("distributors--title");
  var manuValue = checked(manuCheck);
  var distValue = checked(distCheck);
  var manuArray = [];
  var distArray = [];
  var stockArray = [];
  var shipArray = [];

  // Creates a list for each sub element in filters
  filters.forEach(function (obj) {
    var checks = document.getElementsByClassName(`subChecks--${obj.filter}`);
    for (var i = 0; i < checks.length; i++) {
      if (checked(checks[i]) === 1) {
        if (obj.filter === "manufacturers") {
          manuArray.push(checks[i].value);
        } else if (obj.filter === "distributors") {
          distArray.push(checks[i].value);
        } else if (obj.filter === "In-Stock") {
          if (checks[i].value === "backordered") {
            stockArray.push("0");
          } else {
            stockArray.push(checks[i].value);
          }
        } else if (obj.filter === "Shipping-Speed") {
          shipArray.push(checks[i].value);
        }
      }
    }
  });

  // helpful logs

  // console.log("manuarray", manuArray);
  // console.log("distarray", distArray);
  console.log("stockarray", stockArray);
  // console.log("shiparray", shipArray);

  // console.log(manuValue);
  // console.log(distValue);
  // console.log(manuArray);
  // console.log(distArray);
  // console.log(stockArray);
  // console.log(shipArray);

  // console.log("ManuArray", manuArray);
  // console.log("DistArray", distArray);
  // console.log("StockArray", stockArray);
  // console.log("ShipArray", shipArray);

  // filters function is looking for a minimum number of In-Stock to apply and a maximum number of days to ship.
  var minSupply = Math.min(...stockArray);
  var maxShip = Math.max(...shipArray);

  // console.log("minni", minSupply);

  // In Stock not filtering properly. it is taking higher number than it should

  partsEntries.innerHTML = "";
  // This is messing things up.

  // console.log("ap", availableProducts);

  // Convert availableProducts inStock backordered into 0
  const backorderedToZero = function (array) {
    availableProductsTemp = [];
    array.forEach(function (arrayitem) {
      if (arrayitem.inStock === "backordered") {
        arrayitem.inStock = 0;
        availableProductsTemp.push(arrayitem);
      } else {
        availableProductsTemp.push(arrayitem);
      }
      // console.log("testing", arrayitem.inStock);
    });
    return availableProductsTemp;
  };

  var availableProductsAdjusted = backorderedToZero(availableProducts);
  // console.log("newArray", availableProductsAdjusted);

  // console.log("ap2", availableProducts);

  displayProducts(
    sortProducts(
      filterProducts(
        availableProductsAdjusted,
        (manufacAll = manuValue),
        (distribAll = distValue),
        (manufacturers = manuArray),
        (distributers = distArray),
        (inStock = stockArray), // -1 shows all (problem of not showing)
        (shipSpeed = -1) // -1 shows all (problem of not showing)
      ),
      (cheepest = 1),
      (fastest = 0)
    )
  );

  console.log("its kinda working");
});
