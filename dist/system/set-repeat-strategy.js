'use strict';

System.register(['./repeat-utilities'], function (_export, _context) {
  "use strict";

  var createFullOverrideContext, updateOverrideContexts, SetRepeatStrategy;

  

  return {
    setters: [function (_repeatUtilities) {
      createFullOverrideContext = _repeatUtilities.createFullOverrideContext;
      updateOverrideContexts = _repeatUtilities.updateOverrideContexts;
    }],
    execute: function () {
      _export('SetRepeatStrategy', SetRepeatStrategy = function () {
        function SetRepeatStrategy() {
          
        }

        SetRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {
          return observerLocator.getSetObserver(items);
        };

        SetRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
          var _this = this;

          var removePromise = repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
          if (removePromise instanceof Promise) {
            removePromise.then(function () {
              return _this._standardProcessItems(repeat, items);
            });
            return;
          }
          this._standardProcessItems(repeat, items);
        };

        SetRepeatStrategy.prototype._standardProcessItems = function _standardProcessItems(repeat, items) {
          var index = 0;
          var overrideContext = void 0;

          items.forEach(function (value) {
            overrideContext = createFullOverrideContext(repeat, value, index, items.size);
            repeat.addView(overrideContext.bindingContext, overrideContext);
            ++index;
          });
        };

        SetRepeatStrategy.prototype.instanceMutated = function instanceMutated(repeat, set, records) {
          var value = void 0;
          var i = void 0;
          var ii = void 0;
          var overrideContext = void 0;
          var removeIndex = void 0;
          var record = void 0;
          var rmPromises = [];
          var viewOrPromise = void 0;

          for (i = 0, ii = records.length; i < ii; ++i) {
            record = records[i];
            value = record.value;
            switch (record.type) {
              case 'add':
                overrideContext = createFullOverrideContext(repeat, value, set.size - 1, set.size);
                repeat.insertView(set.size - 1, overrideContext.bindingContext, overrideContext);
                break;
              case 'delete':
                removeIndex = this._getViewIndexByValue(repeat, value);
                viewOrPromise = repeat.removeView(removeIndex, true, !repeat.viewsRequireLifecycle);
                if (viewOrPromise instanceof Promise) {
                  rmPromises.push(viewOrPromise);
                }
                break;
              case 'clear':
                repeat.removeAllViews(true, !repeat.viewsRequireLifecycle);
                break;
              default:
                continue;
            }
          }

          if (rmPromises.length > 0) {
            Promise.all(rmPromises).then(function () {
              updateOverrideContexts(repeat.views(), 0);
            });
          } else {
            updateOverrideContexts(repeat.views(), 0);
          }
        };

        SetRepeatStrategy.prototype._getViewIndexByValue = function _getViewIndexByValue(repeat, value) {
          var i = void 0;
          var ii = void 0;
          var child = void 0;

          for (i = 0, ii = repeat.viewCount(); i < ii; ++i) {
            child = repeat.view(i);
            if (child.bindingContext[repeat.local] === value) {
              return i;
            }
          }

          return undefined;
        };

        return SetRepeatStrategy;
      }());

      _export('SetRepeatStrategy', SetRepeatStrategy);
    }
  };
});