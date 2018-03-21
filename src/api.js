const {CAR_DYNAMIC_API} = require('./constants');
const post = require('./post');
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
const fs = require('fs');
var brandModels = require('./brands.json');
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



async function printModels () {
  for (var i = 0; i < brandModels.length; i++) {
    const models = await getModels(brandModels[i]);
    console.log("models: ");
      console.log(models);
      try{
        fs.appendFile('models.json', JSON.stringify(models, null, 4), function(err)
                              {
                                  console.log('written in models.json.');
                              });
      }
      catch(e){
        return Promise.reject(e);
      }
    brandModels[i]
  }


}

printModels();
/*fs.writeFile('brands.json', JSON.stringify(json, null, 4), function(err)
                      {
                          console.log('Success.');
                      });*/
