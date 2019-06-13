"use strict";

exports.__esModule = true;
exports.MenuItem = exports.MenuLink = exports.MenuButton = exports.MenuList = exports.Menu = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _portal = require("@reach/portal");

var _portal2 = _interopRequireDefault(_portal);

var _rect = require("@reach/rect");

var _rect2 = _interopRequireDefault(_rect);

var _windowSize = require("@reach/window-size");

var _windowSize2 = _interopRequireDefault(_windowSize);

var _componentComponent = require("@reach/component-component");

var _componentComponent2 = _interopRequireDefault(_componentComponent);

var _propTypes = require("prop-types");

var _utils = require("@reach/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// TODO: add the mousedown/drag/mouseup to select of native menus, will
// also help w/ remove the menu button tooltip hide-flash.

// TODO: add type-to-highlight like native menus

var _createContext = (0, _react.createContext)(),
    Provider = _createContext.Provider,
    Consumer = _createContext.Consumer;

var checkIfAppManagedFocus = function checkIfAppManagedFocus(_ref) {
  var refs = _ref.refs,
      state = _ref.state,
      prevState = _ref.prevState;

  if (!state.isOpen && prevState.isOpen) {
    return !refs.menu.contains(document.activeElement);
  }
  return false;
};

var manageFocusOnUpdate = function manageFocusOnUpdate(_ref2, appManagedFocus) {
  var refs = _ref2.refs,
      state = _ref2.state,
      prevState = _ref2.prevState;

  if (state.isOpen && !prevState.isOpen) {
    window.__REACH_DISABLE_TOOLTIPS = true;
    if (state.selectionIndex !== -1) {
      // haven't measured the popover yet, give it a frame otherwise
      // we'll scroll to the bottom of the page >.<
      requestAnimationFrame(function () {
        refs.items[state.selectionIndex].focus();
      });
    } else {
      refs.menu.focus();
    }
  } else if (!state.isOpen && prevState.isOpen) {
    if (!appManagedFocus) {
      refs.button.focus();
    }
    // we want to ignore the immediate focus of a tooltip so it doesn't pop
    // up again when the menu closes, only pops up when focus returns again
    // to the tooltip (like native OS tooltips)
    window.__REACH_DISABLE_TOOLTIPS = false;
  } else if (state.selectionIndex !== prevState.selectionIndex) {
    if (state.selectionIndex === -1) {
      // clear highlight when mousing over non-menu items, but focus the menu
      // so the the keyboard will work after a mouseover
      refs.menu.focus();
    } else {
      refs.items[state.selectionIndex].focus();
    }
  }
};

var openAtFirstItem = function openAtFirstItem(state) {
  return { isOpen: true, selectionIndex: 0 };
};

var close = function close(state) {
  return {
    isOpen: false,
    selectionIndex: -1,
    closingWithClick: false
  };
};

var selectItemAtIndex = function selectItemAtIndex(index) {
  return function (state) {
    return {
      selectionIndex: index
    };
  };
};

var genId = function genId(prefix) {
  return prefix + "-" + Math.random().toString(32).substr(2, 8);
};

////////////////////////////////////////////////////////////////////////
var getMenuRefs = function getMenuRefs() {
  return {
    button: null,
    menu: null,
    items: []
  };
};

var getInitialMenuState = function getInitialMenuState() {
  return {
    isOpen: false,
    buttonRect: undefined,
    selectionIndex: -1,
    closingWithClick: false,
    buttonId: genId("button")
  };
};

var checkIfStylesIncluded = function checkIfStylesIncluded() {
  return (0, _utils.checkStyles)("menu-button");
};

var Menu = function Menu(_ref3) {
  var children = _ref3.children;
  return _react2.default.createElement(
    _componentComponent2.default,
    {
      getRefs: getMenuRefs,
      getInitialState: getInitialMenuState,
      didMount: checkIfStylesIncluded,
      didUpdate: manageFocusOnUpdate,
      getSnapshotBeforeUpdate: checkIfAppManagedFocus
    },
    function (context) {
      return _react2.default.createElement(
        Provider,
        { value: context },
        typeof children === "function" ? children({ isOpen: context.state.isOpen }) : children
      );
    }
  );
};

process.env.NODE_ENV !== "production" ? Menu.propTypes = {
  children: (0, _propTypes.oneOfType)([_propTypes.func, _propTypes.node])
} : void 0;

////////////////////////////////////////////////////////////////////////
var MenuButton = _react2.default.forwardRef(function (_ref4, _ref7) {
  var onClick = _ref4.onClick,
      onKeyDown = _ref4.onKeyDown,
      onMouseDown = _ref4.onMouseDown,
      props = _objectWithoutProperties(_ref4, ["onClick", "onKeyDown", "onMouseDown"]);

  return _react2.default.createElement(
    Consumer,
    null,
    function (_ref5) {
      var refs = _ref5.refs,
          state = _ref5.state,
          setState = _ref5.setState;
      return _react2.default.createElement(
        _rect2.default,
        {
          observe: state.isOpen,
          onChange: function onChange(buttonRect) {
            return setState({ buttonRect: buttonRect });
          }
        },
        function (_ref6) {
          var rectRef = _ref6.ref;
          return _react2.default.createElement("button", _extends({
            id: state.buttonId,
            "aria-haspopup": "menu",
            "aria-expanded": state.isOpen,
            "data-reach-menu-button": true,
            type: "button",
            ref: function ref(node) {
              rectRef(node);
              (0, _utils.assignRef)(_ref7, node);
              refs.button = node;
            },
            onMouseDown: (0, _utils.wrapEvent)(onMouseDown, function () {
              if (state.isOpen) {
                setState({ closingWithClick: true });
              }
            }),
            onClick: (0, _utils.wrapEvent)(onClick, function () {
              if (state.isOpen) {
                setState(close);
              } else {
                setState(openAtFirstItem);
              }
            }),
            onKeyDown: (0, _utils.wrapEvent)(onKeyDown, function (event) {
              if (event.key === "ArrowDown") {
                event.preventDefault(); // prevent scroll
                setState(openAtFirstItem);
              } else if (event.key === "ArrowUp") {
                event.preventDefault(); // prevent scroll
                setState(openAtFirstItem);
              }
            })
          }, props));
        }
      );
    }
  );
});

MenuButton.propTypes = {
  onClick: _propTypes.func,
  onKeyDown: _propTypes.func,
  children: _propTypes.node
};

var MenuItem = _react2.default.forwardRef(function (_ref8, _ref9) {
  var onSelect = _ref8.onSelect,
      onClick = _ref8.onClick,
      _ref8$role = _ref8.role,
      role = _ref8$role === undefined ? "menuitem" : _ref8$role,
      state = _ref8.state,
      setState = _ref8.setState,
      index = _ref8.index,
      onKeyDown = _ref8.onKeyDown,
      onMouseMove = _ref8.onMouseMove,
      onMouseLeave = _ref8.onMouseLeave,
      _ref = _ref8._ref,
      rest = _objectWithoutProperties(_ref8, ["onSelect", "onClick", "role", "state", "setState", "index", "onKeyDown", "onMouseMove", "onMouseLeave", "_ref"]);

  var isSelected = index === state.selectionIndex;
  var select = function select() {
    onSelect();
    setState(close);
  };
  return _react2.default.createElement("div", _extends({}, rest, {
    ref: function ref(node) {
      (0, _utils.assignRef)(_ref9, node);
      (0, _utils.assignRef)(_ref, node);
    },
    "data-reach-menu-item": role === "menuitem" ? true : undefined,
    role: role,
    tabIndex: "-1",
    "data-selected": role === "menuitem" && isSelected ? true : undefined,
    onClick: (0, _utils.wrapEvent)(onClick, function (event) {
      select();
    }),
    onKeyDown: (0, _utils.wrapEvent)(onKeyDown, function (event) {
      if (event.key === "Enter") {
        // prevent the button from being "clicked" by
        // this "Enter" keydown
        event.preventDefault();
        select();
      }
    }),
    onMouseMove: (0, _utils.wrapEvent)(onMouseMove, function (event) {
      if (!isSelected) {
        setState(selectItemAtIndex(index));
      }
    }),
    onMouseLeave: (0, _utils.wrapEvent)(onMouseLeave, function (event) {
      // clear out selection when mouse over a non-menu item child
      setState({ selectionIndex: -1 });
    })
  }));
});

process.env.NODE_ENV !== "production" ? MenuItem.propTypes = {
  onSelect: _propTypes.func.isRequired,
  onClick: _propTypes.func,
  role: _propTypes.string,
  state: _propTypes.object,
  setState: _propTypes.func,
  index: _propTypes.number,
  onKeyDown: _propTypes.func,
  onMouseMove: _propTypes.func,
  _ref: _propTypes.func
} : void 0;

var k = function k() {};

////////////////////////////////////////////////////////////////////////
var MenuLink = _react2.default.forwardRef(function (_ref10, _ref11) {
  var onKeyDown = _ref10.onKeyDown,
      onClick = _ref10.onClick,
      Comp = _ref10.component,
      _ref10$as = _ref10.as,
      AsComp = _ref10$as === undefined ? "a" : _ref10$as,
      style = _ref10.style,
      setState = _ref10.setState,
      state = _ref10.state,
      index = _ref10.index,
      _ref = _ref10._ref,
      props = _objectWithoutProperties(_ref10, ["onKeyDown", "onClick", "component", "as", "style", "setState", "state", "index", "_ref"]);

  var Link = Comp || AsComp;
  if (Comp) {
    console.warn("[@reach/menu-button]: Please use the `as` prop instead of `component`.");
  }
  return _react2.default.createElement(
    MenuItem,
    {
      role: "none",
      state: state,
      setState: setState,
      index: index,
      onSelect: k,
      _ref: k
    },
    _react2.default.createElement(Link, _extends({
      role: "menuitem",
      "data-reach-menu-item": true,
      tabIndex: "-1",
      "data-selected": index === state.selectionIndex ? true : undefined,
      onClick: (0, _utils.wrapEvent)(onClick, function (event) {
        setState(close);
      }),
      onKeyDown: (0, _utils.wrapEvent)(onKeyDown, function (event) {
        if (event.key === "Enter") {
          // prevent MenuItem's preventDefault from firing,
          // allowing this link to work w/ the keyboard
          event.stopPropagation();
        }
      }),
      ref: function ref(node) {
        (0, _utils.assignRef)(_ref, node);
        (0, _utils.assignRef)(_ref11, node);
      },
      style: _extends({}, style)
    }, props))
  );
});

process.env.NODE_ENV !== "production" ? MenuLink.propTypes = {
  onKeyDown: _propTypes.func,
  onClick: _propTypes.func,
  component: _propTypes.any,
  as: _propTypes.any,
  style: _propTypes.object,
  setState: _propTypes.func,
  state: _propTypes.object,
  index: _propTypes.number,
  _ref: _propTypes.func
} : void 0;
///////////////////////////////////////////////////////////////////

var MenuList = _react2.default.forwardRef(function (props, ref) {
  return _react2.default.createElement(
    Consumer,
    null,
    function (_ref12) {
      var refs = _ref12.refs,
          state = _ref12.state,
          setState = _ref12.setState;
      return state.isOpen && _react2.default.createElement(
        _portal2.default,
        null,
        _react2.default.createElement(
          _windowSize2.default,
          null,
          function () {
            return _react2.default.createElement(
              _rect2.default,
              null,
              function (_ref13) {
                var menuRect = _ref13.rect,
                    menuRef = _ref13.ref;
                return _react2.default.createElement(
                  "div",
                  {
                    "data-reach-menu": true,
                    ref: menuRef,
                    style: getStyles(state.buttonRect, menuRect)
                  },
                  _react2.default.createElement(MenuListImpl, _extends({}, props, {
                    setState: setState,
                    state: state,
                    refs: refs,
                    ref: ref
                  }))
                );
              }
            );
          }
        )
      );
    }
  );
});

MenuList.propTypes = {
  children: _propTypes.node
};

var focusableChildrenTypes = [MenuItem, MenuLink];

var isFocusableChildType = function isFocusableChildType(child) {
  return focusableChildrenTypes.includes(child.type);
};
var getFocusableMenuChildren = function getFocusableMenuChildren(children) {
  var focusable = [];
  _react.Children.forEach(children, function (child) {
    if (isFocusableChildType(child)) focusable.push(child);
  });
  return focusable;
};

var MenuListImpl = _react2.default.forwardRef(function (_ref14, _ref15) {
  var refs = _ref14.refs,
      state = _ref14.state,
      setState = _ref14.setState,
      children = _ref14.children,
      onKeyDown = _ref14.onKeyDown,
      onBlur = _ref14.onBlur,
      rest = _objectWithoutProperties(_ref14, ["refs", "state", "setState", "children", "onKeyDown", "onBlur"]);

  var focusableChildren = getFocusableMenuChildren(children);
  return _react2.default.createElement(
    "div",
    _extends({
      "data-reach-menu-list": true
    }, rest, {
      role: "menu",
      "aria-labelledby": state.buttonId,
      tabIndex: "-1",
      ref: function ref(node) {
        refs.menu = node;
        (0, _utils.assignRef)(_ref15, node);
      },
      onBlur: function onBlur(event) {
        var target = event.relatedTarget;
        if (target === null) {
          // relatedTarget isn't a standard secondary target, but IE 11 sets the next focused
          // element before the blur event is called
          target = document.activeElement;
        }
        if (!state.closingWithClick && !refs.menu.contains(target)) {
          setState(close);
        }
      },
      onKeyDown: (0, _utils.wrapEvent)(onKeyDown, function (event) {
        if (event.key === "Escape") {
          setState(close);
        } else if (event.key === "ArrowDown") {
          event.preventDefault(); // prevent window scroll
          var nextIndex = state.selectionIndex + 1;
          if (nextIndex !== focusableChildren.length) {
            setState({ selectionIndex: nextIndex });
          }
        } else if (event.key === "ArrowUp") {
          event.preventDefault(); // prevent window scroll
          var _nextIndex = state.selectionIndex - 1;
          if (_nextIndex !== -1) {
            setState({ selectionIndex: _nextIndex });
          }
        } else if (event.key === "Tab") {
          event.preventDefault(); // prevent leaving
        }
      })
    }),
    _react.Children.map(children, function (child, index) {
      if (isFocusableChildType(child)) {
        var focusIndex = focusableChildren.indexOf(child);

        return _react2.default.cloneElement(child, {
          setState: setState,
          state: state,
          index: focusIndex,
          _ref: function _ref(node) {
            return refs.items[focusIndex] = node;
          }
        });
      }

      return child;
    })
  );
});

process.env.NODE_ENV !== "production" ? MenuListImpl.propTypes = {
  refs: _propTypes.object,
  state: _propTypes.object,
  setState: _propTypes.func,
  children: _propTypes.node,
  onKeyDown: _propTypes.func,
  onBlur: _propTypes.func
} : void 0;

var getStyles = function getStyles(buttonRect, menuRect) {
  var haventMeasuredButtonYet = !buttonRect;
  if (haventMeasuredButtonYet) {
    return { opacity: 0 };
  }

  var haventMeasuredMenuYet = !menuRect;

  var styles = {
    left: buttonRect.left + window.pageXOffset + "px",
    top: buttonRect.top + buttonRect.height + window.pageYOffset + "px"
  };

  if (haventMeasuredMenuYet) {
    return _extends({}, styles, {
      opacity: 0
    });
  }

  if (buttonRect.width < 500) {
    styles.minWidth = buttonRect.width;
  }

  var collisions = {
    top: buttonRect.top - menuRect.height < 0,
    right: window.innerWidth < buttonRect.left + menuRect.width,
    bottom: window.innerHeight < buttonRect.top + menuRect.height,
    left: buttonRect.left - menuRect.width < 0
  };

  var directionRight = collisions.right && !collisions.left;
  var directionUp = collisions.bottom && !collisions.top;

  return _extends({}, styles, {
    left: directionRight ? buttonRect.right - menuRect.width + window.pageXOffset + "px" : buttonRect.left + window.pageXOffset + "px",
    top: directionUp ? buttonRect.top - menuRect.height + window.pageYOffset + "px" : buttonRect.top + buttonRect.height + window.pageYOffset + "px"
  });
};

exports.Menu = Menu;
exports.MenuList = MenuList;
exports.MenuButton = MenuButton;
exports.MenuLink = MenuLink;
exports.MenuItem = MenuItem;