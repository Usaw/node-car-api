const {CAR_DYNAMIC_API} = require('./constants');
const post = require('./post');
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
const fs = require('fs');
//var express = require('express');
//var request = require('request');
//var cheerio = require('cheerio');
//var app     = express();
/**
 * Parse response to get brands
 * @param  {String} body
 * @return {Array}
 */

const parse = response => {
  try {
    const text = JSON.parse(response.text);

    return text.hits && text.hits.content || [];
  } catch (e) {
    return [];
  }
};

module.exports = async (payload, configuration = {}) => {
  try {
    const action = configuration.action || CAR_DYNAMIC_API;
    const response = await post(Object.assign({}, {action, payload}, configuration));
    const data = parse(response);

    if (data) {
      return data;
    }

    return Promise.reject('NOT_AVAILABLE');
  } catch (e) {
    return Promise.reject(e);
  }

};

async function printBrands () {
  const brands = await getBrands();
  fs.writeFile('brands.json', JSON.stringify(brands, null, 4), function(err)
                        {
                            console.log('Success.');
                        });

console.log("brands: ");
  console.log(brands);

}

printBrands();



/*async function printModels () {
  const models = await getModels('PEUGEOT');
  console.log("models: ");
    console.log(models);

}

printModels();*/
/*fs.writeFile('brands.json', JSON.stringify(json, null, 4), function(err)
                      {
                          console.log('Success.');
                      });*/
