'use strict';

var activeFilters = null;

function philterContent(philtersContainer, resultsContainer, userOptions) {
  "use strict";

  /********************
   Set Options
  *********************/

  var optionDefaults = {
    viewFilters: 'View Filters', // Customize text for View Filters action
    hideFilters: 'Hide Filters', // Customize text for Hide Filters action
    clearTarget: '', // Clear Filters element id or class if desired. Leave as empty string to exclude from your filters.
    surpriseTarget: '', // Surprise element id or class if desired. Leave as empty string to exclude from your filters.
    warningMsg: 'Whoops! Looks like your search is too narrow. Try removing a selected filter or clear all filters to try again.' // Customize warning message
  };

  // combine default and user set options
  var options = extend(optionDefaults, userOptions);

  /***************************************************
    Insert Show/Hide Filters content into container
  ****************************************************/
  var elContainer = document.querySelector(philtersContainer);
  elContainer.classList.add('philters-parent');
  var el = document.createElement('h4');
  el.className = 'philters-trigger';
  el.innerHTML = '<span class="default-title">' + options.viewFilters + '</span><span class="alt-title">' + options.hideFilters + '</span>';

  elContainer.parentNode.insertBefore(el, elContainer);

  // Hide filters intially
  elContainer.classList.add('hide');

  /***************************************************
    Show/Hide Filters functionality
  ****************************************************/
  document.querySelector('.philters-trigger').addEventListener('click', function (e) {
    e.preventDefault();
    if (elContainer.classList.contains('hide')) {
      elContainer.classList.remove('hide');
      this.classList.add('philters-open');
    } else {
      elContainer.classList.add('hide');
      this.classList.remove('philters-open');
    }
  });

  /*************************
    Filter Functionality
  *************************/

  // set the initial state of all results to active (display all results by default)
  var resultsParent = document.querySelector(resultsContainer);
  var results = Array.prototype.slice.call(resultsParent.children);

  results.forEach(function (item) {
    item.classList.add('philter-active');
  });

  // set filter as active or inactive on click and update results with toggleVisible() function
  var philterLinks = void 0;

  if (options.surpriseTarget !== '') {
    // if user is including Surprise Me functionality, don't add the filter click function to it
    philterLinks = Array.prototype.slice.call(document.querySelectorAll(philtersContainer + ' a:not(' + options.surpriseTarget + ')'));
  } else {
    philterLinks = Array.prototype.slice.call(document.querySelectorAll(philtersContainer + ' a'));
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = philterLinks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var link = _step.value;

      link.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.classList.contains('activate-philter')) {
          this.classList.remove('activate-philter');
        } else {
          this.classList.add('activate-philter');
        }
        toggleVisible();
      });
    }

    // Clear Filters functionality. Show if option is true.
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

  if (options.clearTarget !== '') {
    document.querySelector(options.clearTarget).addEventListener('click', function (e) {
      e.preventDefault();
      // clear all activated filters and reset results upon click of Clear Filters link
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.prototype.slice.call(document.querySelectorAll('.activate-philter'))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var reset = _step2.value;

          reset.classList.remove('activate-philter');
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

      toggleVisible();
    });
  }

  // "Surprise me" functionality -- add in if user has set surpriseTarget
  if (options.surpriseTarget !== '') {
    document.querySelector(options.surpriseTarget).addEventListener('click', function (e) {
      e.preventDefault();

      var activeResults = document.querySelectorAll('.philter-active');
      var randomNum = Math.floor(Math.random() * activeResults.length);

      // get a random post of the current active results and trigger the click function on it
      activeResults[randomNum].classList.add('random');

      // hide all results except for randomly selected only
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Array.prototype.slice.call(document.querySelectorAll('.philter-active'))[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var hideEm = _step3.value;

          hideEm.classList.remove('philter-active');
        }

        // redirect to URL of randomly selected item
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

      window.location = document.querySelector('.random a').getAttribute('href');
    });
  }

  /*************************
    Append warning message
  *************************/
  var warningMsg = document.createElement('p');
  warningMsg.id = 'philter-warning';
  warningMsg.innerHTML = options.warningMsg;

  resultsParent.parentNode.insertBefore(warningMsg, resultsParent.nextSibling);

  function toggleVisible() {
    // create an empty array that we'll add any active filters to
    activeFilters = [];

    // add href target of activated filters to the activeFilters array
    var getActiveFilters = document.querySelectorAll(philtersContainer + ' a.activate-philter');

    for (var i = 0; i < getActiveFilters.length; i++) {
      var hrefTarget = getActiveFilters[i].getAttribute('href').substr(1);
      activeFilters.push(hrefTarget);
    }

    // loop through results to show only those with a class of the activated filter(s)
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = results[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var single = _step4.value;

        var showThis = true;

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = Array.prototype.slice.call(activeFilters)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var filter = _step5.value;

            if (single.classList.contains(filter)) {
              showThis;
            } else {
              showThis = false;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        if (showThis) {
          single.classList.add('philter-active');
        } else {
          single.classList.remove('philter-active');
        }
      }

      // if there are no results with the activated filter(s), show the warning / error message
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    var warningAlert = document.querySelector('#philter-warning');

    if (document.querySelectorAll('.result.philter-active').length === 0) {
      warningAlert.classList.add('msg-visible');
    } else {
      warningAlert.classList.remove('msg-visible');
    }
  }
}

/*************************************************
  Combine default and any user set parameters
*************************************************/
function extend() {
  // Variables
  var extended = {};

  // Merge the object into the extended object
  var merge = function merge(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        extended[prop] = obj[prop];
      }
    }
  };

  // Loop through each object and conduct a merge
  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};
