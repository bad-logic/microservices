module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/tickets/[ticketId].js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./hooks/useRequest.js":
/*!*****************************!*\
  !*** ./hooks/useRequest.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return useRequest; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);\nvar _jsxFileName = \"/usr/app/hooks/useRequest.js\";\n\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\nfunction useRequest({\n  url,\n  method,\n  body,\n  onSuccess\n}) {\n  const {\n    0: errors,\n    1: setErrors\n  } = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(null);\n\n  const visualizeError = errs => {\n    console.log('errs', errs);\n    setErrors(__jsx(\"div\", {\n      className: \"alert alert-danger\",\n      role: \"alert\",\n      __self: this,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 11,\n        columnNumber: 23\n      }\n    }, __jsx(\"ul\", {\n      className: \"my-0\",\n      __self: this,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 12,\n        columnNumber: 13\n      }\n    }, errs.map((e, ind) => {\n      if (e.field === 'confirmPassword') return __jsx(\"li\", {\n        key: ind,\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 15,\n          columnNumber: 60\n        }\n      }, \"Confirm Password should match the password\");\n      return __jsx(\"li\", {\n        key: ind,\n        __self: this,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 16,\n          columnNumber: 28\n        }\n      }, e.message);\n    }))));\n  };\n\n  const doRequest = async (payload = {}) => {\n    try {\n      setErrors(null);\n      console.log('data', _objectSpread(_objectSpread({}, body), payload));\n      const resp = await axios__WEBPACK_IMPORTED_MODULE_1___default.a[method](url, _objectSpread(_objectSpread({}, body), payload));\n      if (onSuccess) onSuccess(resp.data);\n      return resp.data;\n    } catch (err) {\n      console.log(err);\n      visualizeError(err.response.data.errors);\n    }\n  };\n\n  return {\n    doRequest,\n    errors\n  };\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ob29rcy91c2VSZXF1ZXN0LmpzPzZiNWQiXSwibmFtZXMiOlsidXNlUmVxdWVzdCIsInVybCIsIm1ldGhvZCIsImJvZHkiLCJvblN1Y2Nlc3MiLCJlcnJvcnMiLCJzZXRFcnJvcnMiLCJ1c2VTdGF0ZSIsInZpc3VhbGl6ZUVycm9yIiwiZXJycyIsImNvbnNvbGUiLCJsb2ciLCJtYXAiLCJlIiwiaW5kIiwiZmllbGQiLCJtZXNzYWdlIiwiZG9SZXF1ZXN0IiwicGF5bG9hZCIsInJlc3AiLCJheGlvcyIsImRhdGEiLCJlcnIiLCJyZXNwb25zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFHZSxTQUFTQSxVQUFULENBQW9CO0FBQUNDLEtBQUQ7QUFBS0MsUUFBTDtBQUFZQyxNQUFaO0FBQWlCQztBQUFqQixDQUFwQixFQUFnRDtBQUUzRCxRQUFNO0FBQUEsT0FBQ0MsTUFBRDtBQUFBLE9BQVFDO0FBQVIsTUFBcUJDLHNEQUFRLENBQUMsSUFBRCxDQUFuQzs7QUFFQSxRQUFNQyxjQUFjLEdBQUlDLElBQUQsSUFBUTtBQUMzQkMsV0FBTyxDQUFDQyxHQUFSLENBQVksTUFBWixFQUFtQkYsSUFBbkI7QUFDSUgsYUFBUyxDQUFDO0FBQUssZUFBUyxFQUFDLG9CQUFmO0FBQW9DLFVBQUksRUFBQyxPQUF6QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQ1Y7QUFBSSxlQUFTLEVBQUMsTUFBZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BRUlHLElBQUksQ0FBQ0csR0FBTCxDQUFTLENBQUNDLENBQUQsRUFBR0MsR0FBSCxLQUFTO0FBQ2QsVUFBR0QsQ0FBQyxDQUFDRSxLQUFGLEtBQVUsaUJBQWIsRUFBZ0MsT0FBTztBQUFJLFdBQUcsRUFBRUQsR0FBVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNEQUFQO0FBQ2hDLGFBQU87QUFBSSxXQUFHLEVBQUVBLEdBQVQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFlRCxDQUFDLENBQUNHLE9BQWpCLENBQVA7QUFDSCxLQUhELENBRkosQ0FEVSxDQUFELENBQVQ7QUFVUCxHQVpEOztBQWFBLFFBQU1DLFNBQVMsR0FBRyxPQUFNQyxPQUFPLEdBQUMsRUFBZCxLQUFtQjtBQUNqQyxRQUFHO0FBQ0NaLGVBQVMsQ0FBQyxJQUFELENBQVQ7QUFDQUksYUFBTyxDQUFDQyxHQUFSLENBQVksTUFBWixrQ0FBdUJSLElBQXZCLEdBQStCZSxPQUEvQjtBQUNBLFlBQU1DLElBQUksR0FBRyxNQUFNQyw0Q0FBSyxDQUFDbEIsTUFBRCxDQUFMLENBQWNELEdBQWQsa0NBQXNCRSxJQUF0QixHQUE4QmUsT0FBOUIsRUFBbkI7QUFDQSxVQUFHZCxTQUFILEVBQWNBLFNBQVMsQ0FBQ2UsSUFBSSxDQUFDRSxJQUFOLENBQVQ7QUFDZCxhQUFPRixJQUFJLENBQUNFLElBQVo7QUFDSCxLQU5ELENBTUMsT0FBTUMsR0FBTixFQUFVO0FBQ1BaLGFBQU8sQ0FBQ0MsR0FBUixDQUFZVyxHQUFaO0FBQ0FkLG9CQUFjLENBQUNjLEdBQUcsQ0FBQ0MsUUFBSixDQUFhRixJQUFiLENBQWtCaEIsTUFBbkIsQ0FBZDtBQUNIO0FBQ0osR0FYRDs7QUFZQSxTQUFPO0FBQUVZLGFBQUY7QUFBYVo7QUFBYixHQUFQO0FBQ0giLCJmaWxlIjoiLi9ob29rcy91c2VSZXF1ZXN0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7dXNlU3RhdGV9IGZyb20gJ3JlYWN0JztcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VSZXF1ZXN0KHt1cmwsbWV0aG9kLGJvZHksb25TdWNjZXNzfSl7XG5cbiAgICBjb25zdCBbZXJyb3JzLHNldEVycm9yc10gPSB1c2VTdGF0ZShudWxsKTtcblxuICAgIGNvbnN0IHZpc3VhbGl6ZUVycm9yID0gKGVycnMpPT57XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJzJyxlcnJzKTtcbiAgICAgICAgICAgIHNldEVycm9ycyg8ZGl2IGNsYXNzTmFtZT1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm15LTBcIj5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlcnJzLm1hcCgoZSxpbmQpPT57XG4gICAgICAgICAgICAgICAgICAgIGlmKGUuZmllbGQ9PT0nY29uZmlybVBhc3N3b3JkJykgcmV0dXJuIDxsaSBrZXk9e2luZH0+Q29uZmlybSBQYXNzd29yZCBzaG91bGQgbWF0Y2ggdGhlIHBhc3N3b3JkPC9saT47XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiA8bGkga2V5PXtpbmR9PntlLm1lc3NhZ2V9PC9saT47XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2Pik7XG4gICAgfTtcbiAgICBjb25zdCBkb1JlcXVlc3QgPSBhc3luYyhwYXlsb2FkPXt9KT0+e1xuICAgICAgICB0cnl7XG4gICAgICAgICAgICBzZXRFcnJvcnMobnVsbCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGF0YScsey4uLmJvZHksLi4ucGF5bG9hZH0pO1xuICAgICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGF4aW9zW21ldGhvZF0odXJsLHsuLi5ib2R5LC4uLnBheWxvYWR9KTtcbiAgICAgICAgICAgIGlmKG9uU3VjY2Vzcykgb25TdWNjZXNzKHJlc3AuZGF0YSk7IFxuICAgICAgICAgICAgcmV0dXJuIHJlc3AuZGF0YTtcbiAgICAgICAgfWNhdGNoKGVycil7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgdmlzdWFsaXplRXJyb3IoZXJyLnJlc3BvbnNlLmRhdGEuZXJyb3JzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBkb1JlcXVlc3QsIGVycm9ycyB9O1xufSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./hooks/useRequest.js\n");

/***/ }),

/***/ "./pages/tickets/[ticketId].js":
/*!*************************************!*\
  !*** ./pages/tickets/[ticketId].js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _hooks_useRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useRequest */ \"./hooks/useRequest.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\nvar _jsxFileName = \"/usr/app/pages/tickets/[ticketId].js\";\n\nvar __jsx = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement;\n\n\n\nconst ticketDetails = ({\n  currentUser,\n  ticket,\n  networkErrors\n}) => {\n  const {\n    doRequest,\n    errors\n  } = Object(_hooks_useRequest__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n    url: '/api/order/v1/new-order',\n    method: 'post',\n    body: {\n      ticketId: ticket ? ticket.id : null\n    },\n    onSuccess: data => next_router__WEBPACK_IMPORTED_MODULE_2___default.a.push('/orders/[orderId]', `/orders/${data.order.id}`)\n  });\n\n  const onClickHandler = async e => {\n    e.preventDefault();\n    await doRequest();\n  };\n\n  return networkErrors ? __jsx(\"div\", {\n    className: \"alert alert-danger\",\n    role: \"alert\",\n    __self: undefined,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 24,\n      columnNumber: 17\n    }\n  }, __jsx(\"ul\", {\n    className: \"my-0\",\n    __self: undefined,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 25,\n      columnNumber: 21\n    }\n  }, networkErrors.map((e, ind) => {\n    return __jsx(\"li\", {\n      key: ind,\n      __self: undefined,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 28,\n        columnNumber: 36\n      }\n    }, e.message);\n  }))) : __jsx(\"div\", {\n    __self: undefined,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 34,\n      columnNumber: 17\n    }\n  }, __jsx(\"h1\", {\n    __self: undefined,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 35,\n      columnNumber: 21\n    }\n  }, ticket.title), __jsx(\"h4\", {\n    __self: undefined,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 36,\n      columnNumber: 21\n    }\n  }, \"Price: \", ticket.price), errors, __jsx(\"button\", {\n    onClick: onClickHandler,\n    className: \"btn btn-primary\",\n    __self: undefined,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 38,\n      columnNumber: 21\n    }\n  }, \"Purchase\"));\n};\n\nticketDetails.getInitialProps = async (context, client, currentUser) => {\n  try {\n    const data = await client.get('/api/ticket/v1/get-ticket/' + context.query.ticketId);\n    return {\n      ticket: data.data.ticket\n    };\n  } catch (err) {\n    console.log(err);\n    return {\n      networkErrors: err.response.data.errors\n    };\n  }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ticketDetails);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy90aWNrZXRzL1t0aWNrZXRJZF0uanM/NDFmOCJdLCJuYW1lcyI6WyJ0aWNrZXREZXRhaWxzIiwiY3VycmVudFVzZXIiLCJ0aWNrZXQiLCJuZXR3b3JrRXJyb3JzIiwiZG9SZXF1ZXN0IiwiZXJyb3JzIiwidXNlUmVxdWVzdCIsInVybCIsIm1ldGhvZCIsImJvZHkiLCJ0aWNrZXRJZCIsImlkIiwib25TdWNjZXNzIiwiZGF0YSIsIlJvdXRlciIsInB1c2giLCJvcmRlciIsIm9uQ2xpY2tIYW5kbGVyIiwiZSIsInByZXZlbnREZWZhdWx0IiwibWFwIiwiaW5kIiwibWVzc2FnZSIsInRpdGxlIiwicHJpY2UiLCJnZXRJbml0aWFsUHJvcHMiLCJjb250ZXh0IiwiY2xpZW50IiwiZ2V0IiwicXVlcnkiLCJlcnIiLCJjb25zb2xlIiwibG9nIiwicmVzcG9uc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBO0FBQ0E7O0FBRUEsTUFBTUEsYUFBYSxHQUFHLENBQUM7QUFBQ0MsYUFBRDtBQUFhQyxRQUFiO0FBQW9CQztBQUFwQixDQUFELEtBQXNDO0FBRXhELFFBQU07QUFBQ0MsYUFBRDtBQUFXQztBQUFYLE1BQXFCQyxpRUFBVSxDQUFDO0FBQ2xDQyxPQUFHLEVBQUMseUJBRDhCO0FBRWxDQyxVQUFNLEVBQUMsTUFGMkI7QUFHbENDLFFBQUksRUFBQztBQUNEQyxjQUFRLEVBQUNSLE1BQU0sR0FBQ0EsTUFBTSxDQUFDUyxFQUFSLEdBQVc7QUFEekIsS0FINkI7QUFNbENDLGFBQVMsRUFBRUMsSUFBRCxJQUFTQyxrREFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBaUMsV0FBVUYsSUFBSSxDQUFDRyxLQUFMLENBQVdMLEVBQUcsRUFBekQ7QUFOZSxHQUFELENBQXJDOztBQVNBLFFBQU1NLGNBQWMsR0FBRyxNQUFPQyxDQUFQLElBQVc7QUFDOUJBLEtBQUMsQ0FBQ0MsY0FBRjtBQUNBLFVBQU1mLFNBQVMsRUFBZjtBQUNILEdBSEQ7O0FBS0EsU0FDSUQsYUFBYSxHQUVMO0FBQUssYUFBUyxFQUFDLG9CQUFmO0FBQW9DLFFBQUksRUFBQyxPQUF6QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQ0k7QUFBSSxhQUFTLEVBQUMsTUFBZDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBRVFBLGFBQWEsQ0FBQ2lCLEdBQWQsQ0FBa0IsQ0FBQ0YsQ0FBRCxFQUFHRyxHQUFILEtBQVM7QUFDM0IsV0FBTztBQUFJLFNBQUcsRUFBRUEsR0FBVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQWVILENBQUMsQ0FBQ0ksT0FBakIsQ0FBUDtBQUNDLEdBRkQsQ0FGUixDQURKLENBRkssR0FZTDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUFLcEIsTUFBTSxDQUFDcUIsS0FBWixDQURKLEVBRUk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnQkFBWXJCLE1BQU0sQ0FBQ3NCLEtBQW5CLENBRkosRUFHS25CLE1BSEwsRUFJSTtBQUFRLFdBQU8sRUFBRVksY0FBakI7QUFBaUMsYUFBUyxFQUFDLGlCQUEzQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUpKLENBYlo7QUFvQkgsQ0FwQ0Q7O0FBeUNBakIsYUFBYSxDQUFDeUIsZUFBZCxHQUFnQyxPQUFPQyxPQUFQLEVBQWVDLE1BQWYsRUFBc0IxQixXQUF0QixLQUFvQztBQUNoRSxNQUFHO0FBQ0MsVUFBTVksSUFBSSxHQUFHLE1BQU1jLE1BQU0sQ0FBQ0MsR0FBUCxDQUFXLCtCQUE2QkYsT0FBTyxDQUFDRyxLQUFSLENBQWNuQixRQUF0RCxDQUFuQjtBQUNBLFdBQU87QUFBQ1IsWUFBTSxFQUFDVyxJQUFJLENBQUNBLElBQUwsQ0FBVVg7QUFBbEIsS0FBUDtBQUNILEdBSEQsQ0FHQyxPQUFNNEIsR0FBTixFQUFVO0FBQ1BDLFdBQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0EsV0FBTztBQUFDM0IsbUJBQWEsRUFBQzJCLEdBQUcsQ0FBQ0csUUFBSixDQUFhcEIsSUFBYixDQUFrQlI7QUFBakMsS0FBUDtBQUNIO0FBQ0osQ0FSRDs7QUFVZUwsNEVBQWYiLCJmaWxlIjoiLi9wYWdlcy90aWNrZXRzL1t0aWNrZXRJZF0uanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAgdXNlUmVxdWVzdCBmcm9tIFwiLi4vLi4vaG9va3MvdXNlUmVxdWVzdFwiO1xuaW1wb3J0IFJvdXRlciBmcm9tICduZXh0L3JvdXRlcic7XG5cbmNvbnN0IHRpY2tldERldGFpbHMgPSAoe2N1cnJlbnRVc2VyLHRpY2tldCxuZXR3b3JrRXJyb3JzfSk9PntcblxuICAgIGNvbnN0IHtkb1JlcXVlc3QsZXJyb3JzfSA9IHVzZVJlcXVlc3Qoe1xuICAgICAgICB1cmw6Jy9hcGkvb3JkZXIvdjEvbmV3LW9yZGVyJyxcbiAgICAgICAgbWV0aG9kOidwb3N0JyxcbiAgICAgICAgYm9keTp7XG4gICAgICAgICAgICB0aWNrZXRJZDp0aWNrZXQ/dGlja2V0LmlkOm51bGxcbiAgICAgICAgfSxcbiAgICAgICAgb25TdWNjZXNzOihkYXRhKT0+IFJvdXRlci5wdXNoKCcvb3JkZXJzL1tvcmRlcklkXScsYC9vcmRlcnMvJHtkYXRhLm9yZGVyLmlkfWApIFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb25DbGlja0hhbmRsZXIgPSBhc3luYyAoZSk9PntcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhd2FpdCBkb1JlcXVlc3QoKTtcbiAgICB9XG4gICAgICAgICAgIFxuICAgIHJldHVybiAoXG4gICAgICAgIG5ldHdvcmtFcnJvcnMgXG4gICAgICAgICAgICAgICAgPyBcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiPlxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwibXktMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldHdvcmtFcnJvcnMubWFwKChlLGluZCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gPGxpIGtleT17aW5kfT57ZS5tZXNzYWdlfTwvbGk+O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+IFxuICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDE+e3RpY2tldC50aXRsZX08L2gxPlxuICAgICAgICAgICAgICAgICAgICA8aDQ+UHJpY2U6IHt0aWNrZXQucHJpY2V9PC9oND5cbiAgICAgICAgICAgICAgICAgICAge2Vycm9yc31cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNsaWNrSGFuZGxlcn0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCI+UHVyY2hhc2U8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbn07IFxuXG5cblxuXG50aWNrZXREZXRhaWxzLmdldEluaXRpYWxQcm9wcyA9IGFzeW5jIChjb250ZXh0LGNsaWVudCxjdXJyZW50VXNlcik9PntcbiAgICB0cnl7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBjbGllbnQuZ2V0KCcvYXBpL3RpY2tldC92MS9nZXQtdGlja2V0LycrY29udGV4dC5xdWVyeS50aWNrZXRJZCk7XG4gICAgICAgIHJldHVybiB7dGlja2V0OmRhdGEuZGF0YS50aWNrZXR9O1xuICAgIH1jYXRjaChlcnIpe1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICByZXR1cm4ge25ldHdvcmtFcnJvcnM6ZXJyLnJlc3BvbnNlLmRhdGEuZXJyb3JzfTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHRpY2tldERldGFpbHM7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/tickets/[ticketId].js\n");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJheGlvc1wiPzcwYzYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiYXhpb3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJheGlvc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///axios\n");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"next/router\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJuZXh0L3JvdXRlclwiP2Q4M2UiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoibmV4dC9yb3V0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L3JvdXRlclwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///next/router\n");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdFwiPzU4OGUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoicmVhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///react\n");

/***/ })

/******/ });