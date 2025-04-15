"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./components/PromptInput.tsx":
/*!************************************!*\
  !*** ./components/PromptInput.tsx ***!
  \************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ PromptInput; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction PromptInput(param) {\n    let { prompt, onPromptChange, onSubmit, isLoading } = param;\n    const handleSubmit = (e)=>{\n        e.preventDefault();\n        if (prompt.trim()) {\n            onSubmit();\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"form\", {\n        onSubmit: handleSubmit,\n        className: \"space-y-4\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"textarea\", {\n                className: \"w-full bg-oled text-text border border-cyan rounded px-3 py-2 min-h-[80px] focus:outline-none transition-all duration-200 focus:ring-4 focus:ring-cyan-300/90 focus:shadow-[0_0_32px_8px_rgba(0,255,247,0.45)] hover:shadow-[0_0_32px_8px_rgba(0,255,247,0.45)] hover:ring-4 hover:ring-cyan-300/90\",\n                placeholder: \"Enter your prompt here...\",\n                value: prompt,\n                onChange: (e)=>onPromptChange(e.target.value),\n                disabled: isLoading\n            }, void 0, false, {\n                fileName: \"/Users/jonathanreed/Downloads/API tester/components/PromptInput.tsx\",\n                lineNumber: 20,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex justify-end\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                    type: \"submit\",\n                    className: \"bg-cyan-400 text-black font-semibold rounded-lg px-6 py-3 shadow-md hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 transition disabled:opacity-60\",\n                    disabled: isLoading || !prompt.trim(),\n                    children: isLoading ? \"Running...\" : \"Run Comparison\"\n                }, void 0, false, {\n                    fileName: \"/Users/jonathanreed/Downloads/API tester/components/PromptInput.tsx\",\n                    lineNumber: 28,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/jonathanreed/Downloads/API tester/components/PromptInput.tsx\",\n                lineNumber: 27,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/jonathanreed/Downloads/API tester/components/PromptInput.tsx\",\n        lineNumber: 19,\n        columnNumber: 5\n    }, this);\n}\n_c = PromptInput;\nvar _c;\n$RefreshReg$(_c, \"PromptInput\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL1Byb21wdElucHV0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBc0Q7QUFTdkMsU0FBU0MsWUFBWSxLQUFpRTtRQUFqRSxFQUFFQyxNQUFNLEVBQUVDLGNBQWMsRUFBRUMsUUFBUSxFQUFFQyxTQUFTLEVBQW9CLEdBQWpFO0lBQ2xDLE1BQU1DLGVBQWUsQ0FBQ0M7UUFDcEJBLEVBQUVDLGNBQWM7UUFDaEIsSUFBSU4sT0FBT08sSUFBSSxJQUFJO1lBQ2pCTDtRQUNGO0lBQ0Y7SUFFQSxxQkFDRSw4REFBQ007UUFBS04sVUFBVUU7UUFBY0ssV0FBVTs7MEJBQ3RDLDhEQUFDQztnQkFDQ0QsV0FBVTtnQkFDVkUsYUFBWTtnQkFDWkMsT0FBT1o7Z0JBQ1BhLFVBQVUsQ0FBQ1IsSUFBd0NKLGVBQWVJLEVBQUVTLE1BQU0sQ0FBQ0YsS0FBSztnQkFDaEZHLFVBQVVaOzs7Ozs7MEJBRVosOERBQUNhO2dCQUFJUCxXQUFVOzBCQUNiLDRFQUFDUTtvQkFDQ0MsTUFBSztvQkFDTFQsV0FBVTtvQkFDVk0sVUFBVVosYUFBYSxDQUFDSCxPQUFPTyxJQUFJOzhCQUVsQ0osWUFBWSxlQUFlOzs7Ozs7Ozs7Ozs7Ozs7OztBQUt0QztLQTVCd0JKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvUHJvbXB0SW5wdXQudHN4PzdiYTYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENoYW5nZUV2ZW50LCBGb3JtRXZlbnQgfSBmcm9tICdyZWFjdCc7XG5cbmludGVyZmFjZSBQcm9tcHRJbnB1dFByb3BzIHtcbiAgcHJvbXB0OiBzdHJpbmc7XG4gIG9uUHJvbXB0Q2hhbmdlOiAodmFsOiBzdHJpbmcpID0+IHZvaWQ7XG4gIG9uU3VibWl0OiAoKSA9PiB2b2lkO1xuICBpc0xvYWRpbmc6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFByb21wdElucHV0KHsgcHJvbXB0LCBvblByb21wdENoYW5nZSwgb25TdWJtaXQsIGlzTG9hZGluZyB9OiBQcm9tcHRJbnB1dFByb3BzKSB7XG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IChlOiBGb3JtRXZlbnQ8SFRNTEZvcm1FbGVtZW50PikgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAocHJvbXB0LnRyaW0oKSkge1xuICAgICAgb25TdWJtaXQoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0fSBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgIDx0ZXh0YXJlYVxuICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctb2xlZCB0ZXh0LXRleHQgYm9yZGVyIGJvcmRlci1jeWFuIHJvdW5kZWQgcHgtMyBweS0yIG1pbi1oLVs4MHB4XSBmb2N1czpvdXRsaW5lLW5vbmUgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwIGZvY3VzOnJpbmctNCBmb2N1czpyaW5nLWN5YW4tMzAwLzkwIGZvY3VzOnNoYWRvdy1bMF8wXzMycHhfOHB4X3JnYmEoMCwyNTUsMjQ3LDAuNDUpXSBob3ZlcjpzaGFkb3ctWzBfMF8zMnB4XzhweF9yZ2JhKDAsMjU1LDI0NywwLjQ1KV0gaG92ZXI6cmluZy00IGhvdmVyOnJpbmctY3lhbi0zMDAvOTBcIlxuICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgcHJvbXB0IGhlcmUuLi5cIlxuICAgICAgICB2YWx1ZT17cHJvbXB0fVxuICAgICAgICBvbkNoYW5nZT17KGU6IENoYW5nZUV2ZW50PEhUTUxUZXh0QXJlYUVsZW1lbnQ+KSA9PiBvblByb21wdENoYW5nZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgIGRpc2FibGVkPXtpc0xvYWRpbmd9XG4gICAgICAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktZW5kXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJiZy1jeWFuLTQwMCB0ZXh0LWJsYWNrIGZvbnQtc2VtaWJvbGQgcm91bmRlZC1sZyBweC02IHB5LTMgc2hhZG93LW1kIGhvdmVyOmJnLWN5YW4tMzAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTIgZm9jdXM6cmluZy1jeWFuLTIwMCBmb2N1czpyaW5nLW9mZnNldC0yIHRyYW5zaXRpb24gZGlzYWJsZWQ6b3BhY2l0eS02MFwiXG4gICAgICAgICAgZGlzYWJsZWQ9e2lzTG9hZGluZyB8fCAhcHJvbXB0LnRyaW0oKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtpc0xvYWRpbmcgPyAnUnVubmluZy4uLicgOiAnUnVuIENvbXBhcmlzb24nfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZm9ybT5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJSZWFjdCIsIlByb21wdElucHV0IiwicHJvbXB0Iiwib25Qcm9tcHRDaGFuZ2UiLCJvblN1Ym1pdCIsImlzTG9hZGluZyIsImhhbmRsZVN1Ym1pdCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInRyaW0iLCJmb3JtIiwiY2xhc3NOYW1lIiwidGV4dGFyZWEiLCJwbGFjZWhvbGRlciIsInZhbHVlIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJkaXNhYmxlZCIsImRpdiIsImJ1dHRvbiIsInR5cGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/PromptInput.tsx\n"));

/***/ })

});