function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("color");
var editable_text_base_1 = require("ui/editable-text-base/editable-text-base");
var font_1 = require("ui/styling/font");
var text_base_1 = require("ui/text-base");
var types = require("utils/types");
var utils = require("utils/utils");
var drop_down_common_1 = require("./drop-down-common");
__export(require("./drop-down-common"));
var TOOLBAR_HEIGHT = 44;
var HINT_COLOR = new color_1.Color("#3904041E");
var DropDown = (function (_super) {
    __extends(DropDown, _super);
    function DropDown() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropDown.prototype.createNativeView = function () {
        var dropDown = TNSDropDownLabel.initWithOwner(new WeakRef(this));
        dropDown.userInteractionEnabled = true;
        return dropDown;
    };
    DropDown.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        var applicationFrame = utils.ios.getter(UIScreen, UIScreen.mainScreen).applicationFrame;
        this._listPicker = UIPickerView.alloc().init();
        this._dropDownDelegate = DropDownListPickerDelegateImpl.initWithOwner(new WeakRef(this));
        this._dropDownDataSource = DropDownListDataSource.initWithOwner(new WeakRef(this));
        this._flexToolbarSpace = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(5, null, null);
        this._doneTapDelegate = TapHandler.initWithOwner(new WeakRef(this));
        this._doneButton = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(0, this._doneTapDelegate, "tap");
        this._accessoryViewVisible = true;
        this._toolbar = UIToolbar.alloc().initWithFrame(CGRectMake(0, 0, applicationFrame.size.width, TOOLBAR_HEIGHT));
        this._toolbar.autoresizingMask = 2;
        var nsArray = NSMutableArray.alloc().init();
        nsArray.addObject(this._flexToolbarSpace);
        nsArray.addObject(this._doneButton);
        this._toolbar.setItemsAnimated(nsArray, false);
        nativeView.inputView = this._listPicker;
        this._accessoryViewVisible = true;
        this._showHideAccessoryView();
        nativeView.itemsTextAlignment = drop_down_common_1.itemsTextAlignmentProperty.defaultValue;
        nativeView.itemsPadding = drop_down_common_1.itemsPaddingProperty.defaultValue;
    };
    DropDown.prototype.disposeNativeView = function () {
        this._doneTapDelegate = null;
        this._dropDownDelegate = null;
        this._dropDownDataSource = null;
        this.ios.inputView = null;
        this.ios.inputAccessoryView = null;
        this._listPicker = null;
        this._toolbar = null;
        this._doneButton = null;
        _super.prototype.disposeNativeView.call(this);
    };
    Object.defineProperty(DropDown.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDown.prototype, "accessoryViewVisible", {
        get: function () {
            return this._accessoryViewVisible;
        },
        set: function (value) {
            this._accessoryViewVisible = value;
            this._showHideAccessoryView();
        },
        enumerable: true,
        configurable: true
    });
    DropDown.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._listPicker.delegate = this._dropDownDelegate;
        this._listPicker.dataSource = this._dropDownDataSource;
    };
    DropDown.prototype.onUnloaded = function () {
        this._listPicker.delegate = null;
        this._listPicker.dataSource = null;
        _super.prototype.onUnloaded.call(this);
    };
    DropDown.prototype.open = function () {
        if (this.isEnabled) {
            this.ios.becomeFirstResponder();
        }
    };
    DropDown.prototype.close = function () {
        this.ios.resignFirstResponder();
    };
    DropDown.prototype.refresh = function () {
        if (!this._listPicker) {
            return;
        }
        this._listPicker.reloadAllComponents();
        drop_down_common_1.selectedIndexProperty.coerce(this);
    };
    DropDown.prototype[drop_down_common_1.selectedIndexProperty.getDefault] = function () {
        return null;
    };
    DropDown.prototype[drop_down_common_1.selectedIndexProperty.setNative] = function (value) {
        var _this = this;
        if (value >= 0) {
            setTimeout(function () {
                _this._listPicker.selectRowInComponentAnimated(value, 0, true);
            }, 1);
        }
        this.ios.setText(this._getItemAsString(value));
    };
    DropDown.prototype[drop_down_common_1.itemsProperty.getDefault] = function () {
        return null;
    };
    DropDown.prototype[drop_down_common_1.itemsProperty.setNative] = function (value) {
        this.refresh();
    };
    DropDown.prototype[drop_down_common_1.hintProperty.getDefault] = function () {
        return "";
    };
    DropDown.prototype[drop_down_common_1.hintProperty.setNative] = function (value) {
        this.ios.hint = value;
    };
    DropDown.prototype[drop_down_common_1.itemsTextAlignmentProperty.getDefault] = function () {
        return "initial";
    };
    DropDown.prototype[drop_down_common_1.itemsTextAlignmentProperty.setNative] = function (value) {
        this.nativeView.itemsTextAlignment = value;
    };
    DropDown.prototype[drop_down_common_1.itemsPaddingProperty.getDefault] = function () {
        return "";
    };
    DropDown.prototype[drop_down_common_1.itemsPaddingProperty.setNative] = function (value) {
        this.nativeView.itemsPadding = value;
    };
    DropDown.prototype[drop_down_common_1.colorProperty.getDefault] = function () {
        return this.nativeView.color;
    };
    DropDown.prototype[drop_down_common_1.colorProperty.setNative] = function (value) {
        var color = value instanceof color_1.Color ? value.ios : value;
        this.nativeView.color = color;
        this._listPicker.tintColor = color;
        this._listPicker.reloadAllComponents();
    };
    DropDown.prototype[editable_text_base_1.placeholderColorProperty.getDefault] = function () {
        return this.nativeView.placeholderColor;
    };
    DropDown.prototype[editable_text_base_1.placeholderColorProperty.setNative] = function (value) {
        var color = value instanceof color_1.Color ? value.ios : value;
        this.nativeView.placeholderColor = color;
    };
    DropDown.prototype[drop_down_common_1.backgroundColorProperty.getDefault] = function () {
        return this.nativeView.backgroundColor;
    };
    DropDown.prototype[drop_down_common_1.backgroundColorProperty.setNative] = function (value) {
        if (!value) {
            return;
        }
        var color = value instanceof color_1.Color ? value.ios : value;
        this.nativeView.backgroundColor = color;
        this._listPicker.backgroundColor = color;
        this._listPicker.reloadAllComponents();
    };
    DropDown.prototype[drop_down_common_1.fontInternalProperty.getDefault] = function () {
        return this.nativeView.font;
    };
    DropDown.prototype[drop_down_common_1.fontInternalProperty.setNative] = function (value) {
        var font = value instanceof font_1.Font ? value.getUIFont(this.nativeView.font) : value;
        this.nativeView.font = font;
    };
    DropDown.prototype[text_base_1.textAlignmentProperty.setNative] = function (value) {
        switch (value) {
            case "initial":
            case "left":
                this.nativeView.textAlignment = 0;
                break;
            case "center":
                this.nativeView.textAlignment = 1;
                break;
            case "right":
                this.nativeView.textAlignment = 2;
                break;
        }
    };
    DropDown.prototype[text_base_1.textDecorationProperty.setNative] = function (value) {
        _setTextAttributes(this.nativeView, this.style);
    };
    DropDown.prototype[text_base_1.textTransformProperty.setNative] = function (value) {
        _setTextAttributes(this.nativeView, this.style);
    };
    DropDown.prototype[text_base_1.letterSpacingProperty.setNative] = function (value) {
        _setTextAttributes(this.nativeView, this.style);
    };
    DropDown.prototype[drop_down_common_1.paddingTopProperty.setNative] = function (value) {
        this._setPadding({ top: drop_down_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingTop) });
    };
    DropDown.prototype[drop_down_common_1.paddingRightProperty.setNative] = function (value) {
        this._setPadding({ right: drop_down_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingRight) });
    };
    DropDown.prototype[drop_down_common_1.paddingBottomProperty.setNative] = function (value) {
        this._setPadding({ bottom: drop_down_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingBottom) });
    };
    DropDown.prototype[drop_down_common_1.paddingLeftProperty.setNative] = function (value) {
        this._setPadding({ left: drop_down_common_1.layout.toDeviceIndependentPixels(this.effectivePaddingLeft) });
    };
    DropDown.prototype._setPadding = function (newPadding) {
        var nativeView = this.nativeView;
        var padding = nativeView.padding;
        nativeView.padding = Object.assign(padding, newPadding);
    };
    DropDown.prototype._showHideAccessoryView = function () {
        this.ios.inputAccessoryView = (this._accessoryViewVisible ? this._toolbar : null);
    };
    return DropDown;
}(drop_down_common_1.DropDownBase));
exports.DropDown = DropDown;
var TapHandler = (function (_super) {
    __extends(TapHandler, _super);
    function TapHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TapHandler_1 = TapHandler;
    TapHandler.initWithOwner = function (owner) {
        var tapHandler = TapHandler_1.new();
        tapHandler._owner = owner;
        return tapHandler;
    };
    TapHandler.prototype.tap = function () {
        this._owner.get().close();
    };
    __decorate([
        ObjCMethod()
    ], TapHandler.prototype, "tap", null);
    TapHandler = TapHandler_1 = __decorate([
        ObjCClass()
    ], TapHandler);
    return TapHandler;
    var TapHandler_1;
}(NSObject));
var DropDownListDataSource = (function (_super) {
    __extends(DropDownListDataSource, _super);
    function DropDownListDataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropDownListDataSource_1 = DropDownListDataSource;
    DropDownListDataSource.initWithOwner = function (owner) {
        var dataSource = DropDownListDataSource_1.new();
        dataSource._owner = owner;
        return dataSource;
    };
    DropDownListDataSource.prototype.numberOfComponentsInPickerView = function (pickerView) {
        return 1;
    };
    DropDownListDataSource.prototype.pickerViewNumberOfRowsInComponent = function (pickerView, component) {
        var owner = this._owner.get();
        return (owner && owner.items) ? owner.items.length : 0;
    };
    DropDownListDataSource = DropDownListDataSource_1 = __decorate([
        ObjCClass(UIPickerViewDataSource)
    ], DropDownListDataSource);
    return DropDownListDataSource;
    var DropDownListDataSource_1;
}(NSObject));
var DropDownListPickerDelegateImpl = (function (_super) {
    __extends(DropDownListPickerDelegateImpl, _super);
    function DropDownListPickerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DropDownListPickerDelegateImpl_1 = DropDownListPickerDelegateImpl;
    DropDownListPickerDelegateImpl.initWithOwner = function (owner) {
        var delegate = DropDownListPickerDelegateImpl_1.new();
        delegate._owner = owner;
        return delegate;
    };
    DropDownListPickerDelegateImpl.prototype.pickerViewViewForRowForComponentReusingView = function (pickerView, row, component, view) {
        var owner = this._owner.get();
        var style = owner.style;
        var label = TNSLabel.alloc().init();
        label.text = owner._getItemAsString(row);
        if (style.color) {
            label.textColor = style.color.ios;
        }
        var itemsPaddingTop;
        var itemsPaddingRight;
        var itemsPaddingBottom;
        var itemsPaddingLeft;
        if (owner.nativeView.itemsPadding !== drop_down_common_1.itemsPaddingProperty.defaultValue) {
            var itemsPadding = owner.nativeView.itemsPadding.split(/[ ,]+/).map(function (s) { return drop_down_common_1.Length.parse(s); });
            if (itemsPadding.length === 1) {
                itemsPaddingTop = itemsPadding[0];
                itemsPaddingRight = itemsPadding[0];
                itemsPaddingBottom = itemsPadding[0];
                itemsPaddingLeft = itemsPadding[0];
            }
            else if (itemsPadding.length === 2) {
                itemsPaddingTop = itemsPadding[0];
                itemsPaddingRight = itemsPadding[1];
                itemsPaddingBottom = itemsPadding[0];
                itemsPaddingLeft = itemsPadding[1];
            }
            else if (itemsPadding.length === 3) {
                itemsPaddingTop = itemsPadding[0];
                itemsPaddingRight = itemsPadding[1];
                itemsPaddingBottom = itemsPadding[2];
                itemsPaddingLeft = itemsPadding[1];
            }
            else if (itemsPadding.length === 4) {
                itemsPaddingTop = itemsPadding[0];
                itemsPaddingRight = itemsPadding[1];
                itemsPaddingBottom = itemsPadding[2];
                itemsPaddingLeft = itemsPadding[3];
            }
        }
        else {
            itemsPaddingTop = owner.effectivePaddingTop;
            itemsPaddingRight = owner.effectivePaddingRight;
            itemsPaddingBottom = owner.effectivePaddingBottom;
            itemsPaddingLeft = owner.effectivePaddingLeft;
        }
        label.padding = {
            top: drop_down_common_1.Length.toDevicePixels(itemsPaddingTop, 0),
            right: drop_down_common_1.Length.toDevicePixels(itemsPaddingRight, 0),
            bottom: drop_down_common_1.Length.toDevicePixels(itemsPaddingBottom, 0),
            left: drop_down_common_1.Length.toDevicePixels(itemsPaddingLeft, 0)
        };
        label.font = style.fontInternal.getUIFont(label.font);
        var itemsTextAlignment = (owner.nativeView.itemsTextAlignment === drop_down_common_1.itemsTextAlignmentProperty.defaultValue)
            ? style.textAlignment : owner.nativeView.itemsTextAlignment;
        switch (itemsTextAlignment) {
            case "initial":
            case "left":
                label.textAlignment = 0;
                break;
            case "center":
                label.textAlignment = 1;
                break;
            case "right":
                label.textAlignment = 2;
                break;
        }
        _setTextAttributes(label, style);
        return label;
    };
    DropDownListPickerDelegateImpl.prototype.pickerViewDidSelectRowInComponent = function (pickerView, row, component) {
        var owner = this._owner.get();
        if (owner) {
            var oldIndex = owner.selectedIndex;
            owner.selectedIndex = row;
            if (row !== oldIndex) {
                owner.notify({
                    eventName: drop_down_common_1.DropDownBase.selectedIndexChangedEvent,
                    object: owner,
                    oldIndex: oldIndex,
                    newIndex: row
                });
            }
        }
    };
    DropDownListPickerDelegateImpl = DropDownListPickerDelegateImpl_1 = __decorate([
        ObjCClass(UIPickerViewDelegate)
    ], DropDownListPickerDelegateImpl);
    return DropDownListPickerDelegateImpl;
    var DropDownListPickerDelegateImpl_1;
}(NSObject));
var TNSDropDownLabel = (function (_super) {
    __extends(TNSDropDownLabel, _super);
    function TNSDropDownLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TNSDropDownLabel_1 = TNSDropDownLabel;
    TNSDropDownLabel.initWithOwner = function (owner) {
        var label = TNSDropDownLabel_1.new();
        label._owner = owner;
        label._isInputViewOpened = false;
        label.color = utils.ios.getter(UIColor, UIColor.blackColor);
        label.placeholderColor = HINT_COLOR.ios;
        label.text = " ";
        label.addGestureRecognizer(UITapGestureRecognizer.alloc().initWithTargetAction(label, "tap"));
        return label;
    };
    Object.defineProperty(TNSDropDownLabel.prototype, "inputView", {
        get: function () {
            return this._inputView;
        },
        set: function (value) {
            this._inputView = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSDropDownLabel.prototype, "inputAccessoryView", {
        get: function () {
            return this._inputAccessoryView;
        },
        set: function (value) {
            this._inputAccessoryView = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSDropDownLabel.prototype, "canBecomeFirstResponder", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSDropDownLabel.prototype, "canResignFirstResponder", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSDropDownLabel.prototype, "hint", {
        get: function () {
            return this._hint;
        },
        set: function (value) {
            var owner = this._owner.get();
            this._hint = value;
            if (!this._hasText) {
                this.text = value;
                _setTextAttributes(owner.nativeView, owner.style);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSDropDownLabel.prototype, "color", {
        get: function () {
            return this._internalColor;
        },
        set: function (value) {
            this._internalColor = value;
            this._refreshColor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSDropDownLabel.prototype, "placeholderColor", {
        get: function () {
            return this._internalPlaceholderColor;
        },
        set: function (value) {
            this._internalPlaceholderColor = value;
            this._refreshColor();
        },
        enumerable: true,
        configurable: true
    });
    TNSDropDownLabel.prototype.setText = function (value) {
        var actualText = value || this._hint || "";
        var owner = this._owner.get();
        this._hasText = !types.isNullOrUndefined(value) && value !== "";
        this.text = (actualText === "" ? " " : actualText);
        this._refreshColor();
        _setTextAttributes(owner.nativeView, owner.style);
    };
    Object.defineProperty(TNSDropDownLabel.prototype, "itemsTextAlignment", {
        get: function () {
            return this._itemsTextAlignment;
        },
        set: function (value) {
            this._itemsTextAlignment = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TNSDropDownLabel.prototype, "itemsPadding", {
        get: function () {
            return this._itemsPadding;
        },
        set: function (value) {
            this._itemsPadding = value;
        },
        enumerable: true,
        configurable: true
    });
    TNSDropDownLabel.prototype.becomeFirstResponder = function () {
        var result = _super.prototype.becomeFirstResponder.call(this);
        if (result) {
            if (!this._isInputViewOpened) {
                var owner = this._owner.get();
                owner.notify({
                    eventName: drop_down_common_1.DropDownBase.openedEvent,
                    object: owner
                });
            }
            this._isInputViewOpened = true;
        }
        return result;
    };
    TNSDropDownLabel.prototype.resignFirstResponder = function () {
        var result = _super.prototype.resignFirstResponder.call(this);
        var owner = this._owner.get();
        if (result) {
            this._isInputViewOpened = false;
            owner.notify({
                eventName: drop_down_common_1.DropDownBase.closedEvent,
                object: owner
            });
        }
        return result;
    };
    TNSDropDownLabel.prototype.tap = function (sender) {
        if (sender.state === 3) {
            var owner = this._owner.get();
            if (owner.isEnabled) {
                this.becomeFirstResponder();
            }
        }
    };
    TNSDropDownLabel.prototype._refreshColor = function () {
        this.textColor = (this._hasText ? this._internalColor : this._internalPlaceholderColor);
    };
    __decorate([
        ObjCMethod(),
        __param(0, ObjCParam(UITapGestureRecognizer))
    ], TNSDropDownLabel.prototype, "tap", null);
    TNSDropDownLabel = TNSDropDownLabel_1 = __decorate([
        ObjCClass()
    ], TNSDropDownLabel);
    return TNSDropDownLabel;
    var TNSDropDownLabel_1;
}(TNSLabel));
function _setTextAttributes(nativeView, style) {
    var attributes = new Map();
    switch (style.textDecoration) {
        case "none":
            break;
        case "underline":
            attributes.set(NSUnderlineStyleAttributeName, 1);
            break;
        case "line-through":
            attributes.set(NSStrikethroughStyleAttributeName, 1);
            break;
        case "underline line-through":
            attributes.set(NSUnderlineStyleAttributeName, 1);
            attributes.set(NSStrikethroughStyleAttributeName, 1);
            break;
    }
    if (style.letterSpacing !== 0) {
        attributes.set(NSKernAttributeName, style.letterSpacing * nativeView.font.pointSize);
    }
    if (nativeView.textColor && attributes.size > 0) {
        attributes.set(NSForegroundColorAttributeName, nativeView.textColor);
    }
    var text = types.isNullOrUndefined(nativeView.text) ? "" : nativeView.text.toString();
    var sourceString;
    switch (style.textTransform) {
        case "uppercase":
            sourceString = NSString.stringWithString(text).uppercaseString;
            break;
        case "lowercase":
            sourceString = NSString.stringWithString(text).lowercaseString;
            break;
        case "capitalize":
            sourceString = NSString.stringWithString(text).capitalizedString;
            break;
        default:
            sourceString = text;
    }
    if (attributes.size > 0) {
        var result = NSMutableAttributedString.alloc().initWithString(sourceString);
        result.setAttributesRange(attributes, { location: 0, length: sourceString.length });
        nativeView.attributedText = result;
    }
    else {
        nativeView.attributedText = undefined;
        nativeView.text = sourceString;
    }
}
