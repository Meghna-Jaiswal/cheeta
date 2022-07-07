process.env.NODE_ENV = "test1";
process.env.JWT_BASE_URL = "https://stag-apis.mogiio.com/jwt/";
process.env.VIDEO_CONFIG_BASE_URL = "https://stag-apis.mogiio.com/video-config/";
// process.env.MONGO_DB_URL = "mongodb://mongodb-01,mongodb-02,mongodb-03/ott-stag?replicaSet=rs0"
process.env.MONGO_DB_URL = "mongodb+srv://user001:eHn7Aj8Ou5x78RdX@cluster0.juhuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const expect = require("chai").expect;
const request = require("supertest");
const app = require("../../app");

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) o = o[k];
    else return;
  }
  return o;
};

const updateData = (tc, set) => {
  tc.updateDB.forEach(async (ddb) => {
    let model = require(ddb.model);
    let updateRes = await model.findOneAndUpdate(ddb.filter, {
      $set: ddb[set],
    });
    if (updateRes) console.log("Update Date :: ", updateRes);
  });
};

const requestApp = (tc) => {
  it("OK, " + tc.name, (done) => {

    if (tc.deleteDB && tc.deleteDB.length > 0) {

      tc.deleteDB.forEach(async (ddb) => {
        let model = require(ddb.model);
        let delRes = await model.deleteMany(ddb.filter);
        if (delRes) 
          console.log(delRes);
      });
    }

    if (tc.updateDB && tc.updateDB.length > 0) 
      updateData(tc, "update");

    let reqObj = request(app)[tc.type](tc.path).set(tc.header);

    if (tc.type != "get" || tc.type != "delete") 
      reqObj.send(tc.reqBody);

    reqObj
      .then((res) => {
        const body = res.body;
        console.log("Body >>> ", body);

        tc.validators.forEach((validate) => {
          // Comparision (INT, String), Contains,
          let respValue = Object.byString(body, validate.field);

          if (typeof validate.expectedValue == "number") {
            expect(respValue).to.equal(validate.expectedValue);
          } else if (typeof validate.expectedValue == "string") {
            expect(respValue).to.be.a("string", validate.expectedValue);
          } else {
            expect(respValue).to.contain.property(validate.field);
          }
        });

        if (tc.updateDB && tc.updateDB.length > 0) 
          updateData(tc, "revert");

        done();
      })
      .catch((err) => {
        console.log(err, "in catch");
        done(err);
      });
  });
};

/**
 * @param {Array} UTS - the array of require statements of require statements e.g. [ require('get.json'), require('post.json')
 * @return {void}
 * */

const jsonUnitTesterInit = (UTS) => {
  UTS.forEach((UT) => {
    const metaData = UT.shift();

    if (metaData && metaData.method) {
      describe(`${metaData.method} ${metaData.path}`, () => {
        before((done) => {
          console.log(metaData.beforeMessage, new Date());
          done();
        });

        after((done) => {
          console.log(metaData.afterMessage, new Date());
          done();
        });

        UT.forEach((tc) => {
          requestApp(tc);
        });
      });
    }
  });
};

module.exports = jsonUnitTesterInit;
