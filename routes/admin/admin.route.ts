import express from "express";
import adminModel from "../../models/Admin.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import md5 from "md5";
import { auth, providerGG, providerFB } from "../../firebase/firebase";
import { resolveSoa } from "dns";

const router = express.Router();
const primaryKey = config.PRIMARYKEY;

router.get("/", (req, res) => {
  res.send("<h1>ROUTE USER</h1>");
});

router.post("/login", (req, res) => {
  // req.body has
  // username,password
  if (req.body.username && req.body.password) {
    req.body.password = md5(req.body.password);

    adminModel.find(
      { user: req.body.username, password: req.body.password },
      (err, docs: any) => {
        if (err) {
          res.sendStatus(503);
        } else {
          // send jwt
          if (docs.length > 0) {
            docs[0].password = "";
            jwt.sign(docs[0].toJSON(), primaryKey, (err: any, token: any) => {
              if (err) {
                res.sendStatus(503);
              } else {
                res.send({
                  token,
                  _id: docs[0]._id,
                  user: docs[0].user,
                  avatar: docs[0].avatar,
                  name: docs[0].name,
                  old: docs[0].old,
                });
              }
            });
          } else {
            res.sendStatus(401);
          }
        }
      }
    );
  } else {
    res.sendStatus(404);
  }
});

router.post("/loginGGFB", (req, res) => {
  if (req.body.username && req.body.password) {
    req.body.password = md5(req.body.password);
    // Build Firebase credential with the Google ID token.
    let credential;
    if (req.body.loginfb) {
      credential = (providerFB as any).credentital({
        accessToken: req.body.idToken,
      });
    } else {
      credential = (providerGG as any).credential(req.body.idToken);
    }

    // Sign in with credential from the Google user.
    auth
      .signInWithCredential(credential)
      .then((data) => {
        adminModel.find(
          { user: req.body.username, password: req.body.password },
          (err, docs: any) => {
            if (err) {
              res.sendStatus(503);
            } else {
              // send jwt
              if (docs.length > 0) {
                docs[0].password = "";
                jwt.sign(docs[0].toJSON(), primaryKey, (err, token) => {
                  if (err) {
                    res.sendStatus(503);
                  } else {
                    res.send({
                      token,
                      _id: docs[0]._id,
                      user: docs[0].user,
                      avatar: docs[0].avatar,
                      name: docs[0].name,
                      old: docs[0].old,
                    });
                  }
                });
              } else {
                adminModel.create(
                  {
                    user: req.body.username,
                    password: req.body.password,
                    avatar: req.body.avatar,
                    name: req.body.name,
                  },
                  (err, docs) => {
                    if (err) {
                      res.sendStatus(503);
                    } else {
                      docs.password = "";
                      jwt.sign(docs.toJSON(), primaryKey, (err, token) => {
                        if (err) {
                          res.sendStatus(503);
                        } else {
                          res.send({
                            token,
                            _id: docs._id,
                            user: docs.user,
                            avatar: docs.avatar,
                            name: docs.name,
                          });
                        }
                      });
                    }
                  }
                );
              }
            }
          }
        );
      })
      .catch(function (error) {
        res.sendStatus(401);
      });
  }
});

router.get("/loginagain", checkAuthorization, (req: any, res) => {
  adminModel.findById(req.authorization._id, (err, doc) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send({
        _id: doc._id,
        user: doc.user,
        avatar: doc.avatar,
        name: doc.name,
        old: doc.old,
      });
    }
  });
});

router.post("/register", (req, res) => {
  adminModel.findOne({ user: req.body.user }, (err, doc) => {
    if (err) {
      res.sendStatus(400);
    } else {
      if (doc) {
        res.sendStatus(400);
      } else {
        req.body.password = md5(req.body.password);
        req.body.old = 0;
        req.body.avatar = "";
        adminModel.create(req.body, (err, doc) => {
          if (err) {
            res.sendStatus(503);
          } else res.sendStatus(201);
        });
      }
    }
  });
});

function checkAuthorization(req, res, next) {
  // check header contain beader
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, primaryKey, function (err, decoded) {
      if (err) {
        res.sendStatus(401);
        return;
      } else {
        req.authorization = decoded;
      }
    });
    next();
  } else {
    res.sendStatus(403);
  }
}

export default router;
