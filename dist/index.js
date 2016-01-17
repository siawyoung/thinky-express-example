/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(2);

	var _express = __webpack_require__(3);

	var _express2 = _interopRequireDefault(_express);

	var _bodyParser = __webpack_require__(4);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = (0, _express2.default)();

	app.use(_bodyParser2.default.json());
	app.use(_bodyParser2.default.urlencoded({ extended: true }));

	var config = __webpack_require__(5);
	var models = __webpack_require__(6)(config);

	__webpack_require__(11)(app, models);

	app.listen(config.express.port, function () {
	  console.log('Express server listening on port ' + config.express.port + '.');
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  express: {
	    port: 3333
	  },
	  rethinkdb: {
	    host: 'localhost',
	    port: 28015,
	    authKey: "",
	    db: 'test'
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = function (config) {
	  var thinky = __webpack_require__(7)(config.rethinkdb);
	  var r = thinky.r;
	  var type = thinky.type;

	  var User = thinky.createModel("User", {
	    id: type.string(),
	    username: type.string().required(),
	    email: type.string().email().required()
	  });

	  var Post = thinky.createModel("Post", {
	    id: type.string(),
	    content: type.string().required()
	  });

	  var Category = thinky.createModel("Category", {
	    id: type.string(),
	    name: type.string().required()
	  });

	  User.hasMany(Post, "posts", "id", "userId");

	  Post.belongsTo(User, "user", "userId", "id");
	  Post.belongsTo(Category, "category", "categoryId", "id");

	  Category.hasMany(Post, "posts", "id", "categoryId");

	  var allModels = { User: User, Post: Post, Category: Category };

	  return {
	    User: __webpack_require__(8)(r, allModels),
	    Post: __webpack_require__(9)(r, allModels),
	    Category: __webpack_require__(10)(r, allModels)
	  };
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("thinky");

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (r, models) {
	  var User = models.User;

	  return {

	    find: function find(id) {
	      var user = User.get(id);
	      return user;
	    },

	    create: function create(params) {
	      var id = params.id;
	      var username = params.username;
	      var email = params.email;

	      var newUser = new User({ id: id, username: username, email: email });
	      return newUser.save();
	    }

	  };
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

	module.exports = function (r, models) {
	  var Post = models.Post;
	  var User = models.User;
	  var Category = models.Category;

	  return {

	    getUserPosts: function () {
	      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(userId) {
	        var user, posts;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.next = 2;
	                return User.get(userId);

	              case 2:
	                user = _context.sent;
	                posts = user.getJoin({ posts: true });
	                return _context.abrupt('return', posts);

	              case 5:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));

	      return function getUserPosts(_x) {
	        return ref.apply(this, arguments);
	      };
	    }(),

	    create: function () {
	      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(userId, params) {
	        var content, user, category, post;
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                content = params.content;
	                _context2.next = 3;
	                return User.get(userId);

	              case 3:
	                user = _context2.sent;
	                _context2.next = 6;
	                return Category.get(params['category']);

	              case 6:
	                category = _context2.sent;
	                post = new Post({ content: content });

	                post.user = user;
	                post.category = category;
	                return _context2.abrupt('return', post.saveAll());

	              case 11:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, this);
	      }));

	      return function create(_x2, _x3) {
	        return ref.apply(this, arguments);
	      };
	    }()

	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (r, models) {
	  var Category = models.Category;

	  return {

	    getPosts: function getPosts(id) {
	      var category = Category.get(id);
	      var posts = category.getJoin({ posts: true });
	      return posts;
	    },

	    create: function create(params) {
	      var newCategory = new Category(params);
	      return newCategory.save();
	    }

	  };
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _express = __webpack_require__(3);

	var _express2 = _interopRequireDefault(_express);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var routes = ['users', 'categories'];

	var nestedRoutes = new Map();
	nestedRoutes.set('users', ['posts']);

	module.exports = function (app, models) {
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {

	    for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var route = _step.value;

	      var router = _express2.default.Router();
	      __webpack_require__(12)("./" + route)(router, models);
	      app.use('/' + route, router);
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = nestedRoutes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var _step2$value = _slicedToArray(_step2.value, 2);

	      var parent = _step2$value[0];
	      var _routes = _step2$value[1];
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = _routes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var route = _step3.value;

	          var nestedRouter = _express2.default.Router({ mergeParams: true });
	          __webpack_require__(12)("./" + route)(nestedRouter, models);
	          app.use('/' + parent + '/:id/' + route, nestedRouter);
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./categories": 13,
		"./categories.js": 13,
		"./posts": 14,
		"./posts.js": 14,
		"./users": 15,
		"./users.js": 15
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 12;


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

	module.exports = function (router, models) {
	  var Category = models.Category;

	  router.post('/', function () {
	    var _this = this;

	    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
	      var newCategory;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return Category.create(req.body);

	            case 3:
	              newCategory = _context.sent;

	              res.json(newCategory);
	              _context.next = 10;
	              break;

	            case 7:
	              _context.prev = 7;
	              _context.t0 = _context['catch'](0);

	              res.sendStatus(422);

	            case 10:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, _this, [[0, 7]]);
	    }));

	    return function (_x, _x2) {
	      return ref.apply(this, arguments);
	    };
	  }());

	  router.get('/:id', function () {
	    var _this2 = this;

	    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
	      var posts;
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              _context2.prev = 0;
	              _context2.next = 3;
	              return Category.getPosts(req.params.id);

	            case 3:
	              posts = _context2.sent;

	              res.json(posts);
	              _context2.next = 10;
	              break;

	            case 7:
	              _context2.prev = 7;
	              _context2.t0 = _context2['catch'](0);

	              res.sendStatus(404);

	            case 10:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, _this2, [[0, 7]]);
	    }));

	    return function (_x3, _x4) {
	      return ref.apply(this, arguments);
	    };
	  }());
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

	module.exports = function (router, models) {
	  var Post = models.Post;

	  router.post('/', function () {
	    var _this = this;

	    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
	      var newPost;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return Post.create(req.params.id, req.body);

	            case 3:
	              newPost = _context.sent;

	              res.json(newPost);
	              _context.next = 10;
	              break;

	            case 7:
	              _context.prev = 7;
	              _context.t0 = _context['catch'](0);

	              res.sendStatus(422);

	            case 10:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, _this, [[0, 7]]);
	    }));

	    return function (_x, _x2) {
	      return ref.apply(this, arguments);
	    };
	  }());

	  router.get('/', function () {
	    var _this2 = this;

	    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res) {
	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              _context2.prev = 0;
	              _context2.t0 = res;
	              _context2.next = 4;
	              return Post.getUserPosts(req.params.id);

	            case 4:
	              _context2.t1 = _context2.sent;

	              _context2.t0.json.call(_context2.t0, _context2.t1);

	              _context2.next = 11;
	              break;

	            case 8:
	              _context2.prev = 8;
	              _context2.t2 = _context2['catch'](0);

	              res.sendStatus(404);

	            case 11:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, _this2, [[0, 8]]);
	    }));

	    return function (_x3, _x4) {
	      return ref.apply(this, arguments);
	    };
	  }());
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

	module.exports = function (router, models) {
	  var User = models.User;

	  router.post('/', function () {
	    var _this = this;

	    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
	      var newUser;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return User.create(req.body);

	            case 3:
	              newUser = _context.sent;

	              res.json(newUser);
	              _context.next = 10;
	              break;

	            case 7:
	              _context.prev = 7;
	              _context.t0 = _context['catch'](0);

	              res.sendStatus(422);

	            case 10:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, _this, [[0, 7]]);
	    }));

	    return function (_x, _x2) {
	      return ref.apply(this, arguments);
	    };
	  }());
	};

/***/ }
/******/ ]);