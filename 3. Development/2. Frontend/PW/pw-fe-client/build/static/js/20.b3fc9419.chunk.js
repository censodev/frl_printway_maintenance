(this.webpackJsonppgc_seller=this.webpackJsonppgc_seller||[]).push([[20],{184:function(e,t,n){var r=n(493),a=n(398),l=n(372),o=n(494);e.exports=function(e){return r(e)||a(e)||l(e)||o()}},272:function(e,t,n){"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=(r=n(570))&&r.__esModule?r:{default:r};t.default=a,e.exports=a},356:function(e,t,n){"use strict";n.d(t,"a",(function(){return _})),n.d(t,"b",(function(){return H}));var r=n(11),a=n.n(r),l=n(5),o=n.n(l),i=n(23),c=n.n(i),s=n(24),u=n.n(s),d=n(25),p=n.n(d),f=n(26),m=n.n(f),h=n(1),v=n(12),y=n.n(v),g=n(36),b=n(567),x=n.n(b),w=n(272),O=n.n(w),C=n(407),E=n.n(C),N=n(492),S=n(75),k=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},P=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n},j={xs:"479.98px",sm:"575.98px",md:"767.98px",lg:"991.98px",xl:"1199.98px",xxl:"1599.98px"},_=h.createContext({}),z=function(){var e=0;return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return e+=1,"".concat(t).concat(e)}}(),M=function(e){p()(n,e);var t=m()(n);function n(e){var r,l,i;return c()(this,n),(r=t.call(this,e)).responsiveHandler=function(e){r.setState({below:e.matches});var t=r.props.onBreakpoint,n=r.state.collapsed;t&&t(e.matches),n!==e.matches&&r.setCollapsed(e.matches,"responsive")},r.setCollapsed=function(e,t){"collapsed"in r.props||r.setState({collapsed:e});var n=r.props.onCollapse;n&&n(e,t)},r.toggle=function(){var e=!r.state.collapsed;r.setCollapsed(e,"clickTrigger")},r.renderSider=function(e){var t,n=e.getPrefixCls,l=r.props,i=l.prefixCls,c=l.className,s=l.theme,u=l.collapsible,d=l.reverseArrow,p=l.trigger,f=l.style,m=l.width,v=l.collapsedWidth,b=l.zeroWidthTriggerStyle,w=l.children,C=P(l,["prefixCls","className","theme","collapsible","reverseArrow","trigger","style","width","collapsedWidth","zeroWidthTriggerStyle","children"]),N=r.state,S=N.collapsed,j=N.below,_=n("layout-sider",i),z=Object(g.a)(C,["collapsed","defaultCollapsed","onCollapse","breakpoint","onBreakpoint","siderHook","zeroWidthTriggerStyle"]),M=S?v:m,H=k(M)?"".concat(M,"px"):String(M),W=0===parseFloat(String(v||0))?h.createElement("span",{onClick:r.toggle,className:y()("".concat(_,"-zero-width-trigger"),"".concat(_,"-zero-width-trigger-").concat(d?"right":"left")),style:b},p||h.createElement(x.a,null)):null,I={expanded:d?h.createElement(O.a,null):h.createElement(E.a,null),collapsed:d?h.createElement(E.a,null):h.createElement(O.a,null)}[S?"collapsed":"expanded"],q=null!==p?W||h.createElement("div",{className:"".concat(_,"-trigger"),onClick:r.toggle,style:{width:H}},p||I):null,A=o()(o()({},f),{flex:"0 0 ".concat(H),maxWidth:H,minWidth:H,width:H}),L=y()(_,"".concat(_,"-").concat(s),(t={},a()(t,"".concat(_,"-collapsed"),!!S),a()(t,"".concat(_,"-has-trigger"),u&&null!==p&&!W),a()(t,"".concat(_,"-below"),!!j),a()(t,"".concat(_,"-zero-width"),0===parseFloat(H)),t),c);return h.createElement("aside",o()({className:L},z,{style:A}),h.createElement("div",{className:"".concat(_,"-children")},w),u||j&&W?q:null)},r.uniqueId=z("ant-sider-"),"undefined"!==typeof window&&(l=window.matchMedia),l&&e.breakpoint&&e.breakpoint in j&&(r.mql=l("(max-width: ".concat(j[e.breakpoint],")"))),i="collapsed"in e?e.collapsed:e.defaultCollapsed,r.state={collapsed:i,below:!1},r}return u()(n,[{key:"componentDidMount",value:function(){var e;this.mql&&(this.mql.addListener(this.responsiveHandler),this.responsiveHandler(this.mql)),null===(e=this.props)||void 0===e||e.siderHook.addSider(this.uniqueId)}},{key:"componentWillUnmount",value:function(){var e,t;null===(e=null===this||void 0===this?void 0:this.mql)||void 0===e||e.removeListener(this.responsiveHandler),null===(t=this.props)||void 0===t||t.siderHook.removeSider(this.uniqueId)}},{key:"render",value:function(){var e=this.state.collapsed,t=this.props.collapsedWidth;return h.createElement(_.Provider,{value:{siderCollapsed:e,collapsedWidth:t}},h.createElement(S.a,null,this.renderSider))}}],[{key:"getDerivedStateFromProps",value:function(e){return"collapsed"in e?{collapsed:e.collapsed}:null}}]),n}(h.Component);M.defaultProps={collapsible:!1,defaultCollapsed:!1,reverseArrow:!1,width:200,collapsedWidth:80,style:{},theme:"dark"};var H=function(e){p()(n,e);var t=m()(n);function n(){return c()(this,n),t.apply(this,arguments)}return u()(n,[{key:"render",value:function(){var e=this;return h.createElement(N.a.Consumer,null,(function(t){return h.createElement(M,o()({},t,e.props))}))}}]),n}(h.Component)},398:function(e,t){e.exports=function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},407:function(e,t,n){"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=(r=n(572))&&r.__esModule?r:{default:r};t.default=a,e.exports=a},485:function(e,t,n){"use strict";n(69),n(566)},486:function(e,t,n){"use strict";var r=n(492),a=n(356);r.b.Sider=a.b,t.a=r.b},492:function(e,t,n){"use strict";n.d(t,"a",(function(){return O}));var r=n(184),a=n.n(r),l=n(11),o=n.n(l),i=n(5),c=n.n(i),s=n(23),u=n.n(s),d=n(24),p=n.n(d),f=n(25),m=n.n(f),h=n(26),v=n.n(h),y=n(1),g=n(12),b=n.n(g),x=n(75),w=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n},O=y.createContext({siderHook:{addSider:function(){return null},removeSider:function(){return null}}});function C(e){var t=e.suffixCls,n=e.tagName,r=e.displayName;return function(e){var a;return(a=function(r){m()(l,r);var a=v()(l);function l(){var r;return u()(this,l),(r=a.apply(this,arguments)).renderComponent=function(a){var l=a.getPrefixCls,o=r.props.prefixCls,i=l(t,o);return y.createElement(e,c()({prefixCls:i,tagName:n},r.props))},r}return p()(l,[{key:"render",value:function(){return y.createElement(x.a,null,this.renderComponent)}}]),l}(y.Component)).displayName=r,a}}var E=function(e){var t=e.prefixCls,n=e.className,r=e.children,a=e.tagName,l=w(e,["prefixCls","className","children","tagName"]),o=b()(t,n);return y.createElement(a,c()({className:o},l),r)},N=function(e){m()(n,e);var t=v()(n);function n(){var e;return u()(this,n),(e=t.apply(this,arguments)).state={siders:[]},e.renderComponent=function(t){var n,r=t.direction,a=e.props,l=a.prefixCls,i=a.className,s=a.children,u=a.hasSider,d=a.tagName,p=w(a,["prefixCls","className","children","hasSider","tagName"]),f=b()(l,(n={},o()(n,"".concat(l,"-has-sider"),"boolean"===typeof u?u:e.state.siders.length>0),o()(n,"".concat(l,"-rtl"),"rtl"===r),n),i);return y.createElement(O.Provider,{value:{siderHook:e.getSiderHook()}},y.createElement(d,c()({className:f},p),s))},e}return p()(n,[{key:"getSiderHook",value:function(){var e=this;return{addSider:function(t){e.setState((function(e){return{siders:[].concat(a()(e.siders),[t])}}))},removeSider:function(t){e.setState((function(e){return{siders:e.siders.filter((function(e){return e!==t}))}}))}}}},{key:"render",value:function(){return y.createElement(x.a,null,this.renderComponent)}}]),n}(y.Component),S=C({suffixCls:"layout",tagName:"section",displayName:"Layout"})(N),k=C({suffixCls:"layout-header",tagName:"header",displayName:"Header"})(E),P=C({suffixCls:"layout-footer",tagName:"footer",displayName:"Footer"})(E),j=C({suffixCls:"layout-content",tagName:"main",displayName:"Content"})(E);S.Header=k,S.Footer=P,S.Content=j,t.b=S},493:function(e,t,n){var r=n(429);e.exports=function(e){if(Array.isArray(e))return r(e)}},494:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},566:function(e,t,n){},567:function(e,t,n){"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=(r=n(568))&&r.__esModule?r:{default:r};t.default=a,e.exports=a},568:function(e,t,n){"use strict";var r=n(147),a=n(149);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l=a(n(1)),o=r(n(569)),i=r(n(150)),c=function(e,t){return l.createElement(i.default,Object.assign({},e,{ref:t,icon:o.default}))};c.displayName="BarsOutlined";var s=l.forwardRef(c);t.default=s},569:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM104 228a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0zm0 284a56 56 0 10112 0 56 56 0 10-112 0z"}}]},name:"bars",theme:"outlined"}},570:function(e,t,n){"use strict";var r=n(147),a=n(149);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l=a(n(1)),o=r(n(571)),i=r(n(150)),c=function(e,t){return l.createElement(i.default,Object.assign({},e,{ref:t,icon:o.default}))};c.displayName="RightOutlined";var s=l.forwardRef(c);t.default=s},571:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"}}]},name:"right",theme:"outlined"}},572:function(e,t,n){"use strict";var r=n(147),a=n(149);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l=a(n(1)),o=r(n(573)),i=r(n(150)),c=function(e,t){return l.createElement(i.default,Object.assign({},e,{ref:t,icon:o.default}))};c.displayName="LeftOutlined";var s=l.forwardRef(c);t.default=s},573:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"}}]},name:"left",theme:"outlined"}},616:function(e,t,n){e.exports={wrap:"wrap--3r0UD"}},721:function(e,t,n){"use strict";n.r(t);n(79);var r=n(50),a=n(40),l=n(41),o=n(43),i=n(42),c=(n(485),n(486)),s=n(1),u=n.n(s),d=n(3),p=u.a.lazy((function(){return n.e(25).then(n.bind(null,725))})),f=u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(9)]).then(n.bind(null,715))})),m=u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(11)]).then(n.bind(null,724))})),h=u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(12)]).then(n.bind(null,719))})),v=u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(8)]).then(n.bind(null,717))})),y=u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(14)]).then(n.bind(null,716))})),g=u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(7)]).then(n.bind(null,712))})),b=u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(13)]).then(n.bind(null,713))})),x=[{path:"/",exact:!0,component:u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(10)]).then(n.bind(null,718))}))},{path:"/news",exact:!0,component:m},{path:"/sites",exact:!0,component:f},{path:"/category/:id",exact:!0,component:p},{path:"/balance",exact:!0,component:h},{path:"/products",exact:!0,component:v},{path:"/profile",exact:!0,component:y},{path:"/orders",exact:!0,component:g},{path:"/order/:id",exact:!0,component:b}],w=n(616),O=n.n(w),C=c.a.Content,E=u.a.lazy((function(){return Promise.all([n.e(0),n.e(2),n.e(21),n.e(23)]).then(n.bind(null,710))})),N=u.a.lazy((function(){return n.e(24).then(n.bind(null,711))})),S=u.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(17)]).then(n.bind(null,714))})),k=function(e){Object(o.a)(n,e);var t=Object(i.a)(n);function n(){var e;Object(a.a)(this,n);for(var l=arguments.length,o=new Array(l),i=0;i<l;i++)o[i]=arguments[i];return(e=t.call.apply(t,[this].concat(o))).loading=function(){return u.a.createElement("div",{className:"page-loading"},u.a.createElement(r.a,null))},e.signOut=function(){localStorage.clear(),window.location.href="/login"},e.validateLoggedIn=function(){return!!localStorage.id_token},e}return Object(l.a)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.history,r=t.match;return u.a.createElement(c.a,null,u.a.createElement(E,{history:n,match:r}),u.a.createElement(c.a,null,u.a.createElement(S,{signOut:this.signOut,history:n}),u.a.createElement(s.Suspense,{fallback:this.loading()},u.a.createElement(C,{className:O.a.wrap},u.a.createElement(s.Suspense,{fallback:this.loading()},u.a.createElement(d.d,null,x.map((function(t,n){return t.component?u.a.createElement(d.b,{key:n.toString(),path:t.path,exact:t.exact,name:t.name,render:function(n){return e.validateLoggedIn()?u.a.createElement(t.component,n):u.a.createElement(d.a,{to:{pathname:"/login"}})}}):null})),u.a.createElement(d.a,{from:"/",to:"/"}))))),u.a.createElement(N,null)))}}]),n}(s.Component);t.default=k}}]);
//# sourceMappingURL=20.b3fc9419.chunk.js.map