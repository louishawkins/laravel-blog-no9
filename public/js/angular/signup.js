var app = angular.module('signupApp', []);
var emailHolder = null;
// http://stackoverflow.com/questions/12864887/angularjs-integrating-with-server-side-validation

//parse query strings to select CRM and phone system if brought here by landing page

app.controller('SignupController', ['$scope', '$location', function ($scope, $location) {
    var params = $location.search();
    $scope.crmSet = false;
    $scope.signupInputs = {};


    /**
     * Pagination
     */
    $scope.page = 'page1';

    $scope.toggle = function (pageIndex) {
        var isValid = validateInput(pageIndex);

        if (pageIndex === 2) {
            var fields = ['name', 'username', 'email'];

            fields.forEach(function (field) {
                var variable = field + 'Error';
                $scope[variable] = false;
            });

            if(!isValid.name) {
                $scope.nameError = true;
                return $('#name-error').text('Please enter your full name.');
            }

            if(!isValid.username) {
                $scope.usernameError = true;
                return $('#username-error').text('Please enter your email.');
            }

            if(!isValid.password) {
                $scope.passwordError = true;
                return $('#password-error').text('Please enter a password.');
            }

            $scope.page = 'page2';
            setTimeout(function() {
                $('#company').val($scope.signupInputs.company);
                $('#phoneNumber').val($scope.signupInputs.phoneNumber);
                $('#crmProvider').val($scope.signupInputs.crmProvider);
            })
        }
        if (pageIndex === 1) {
            $scope.page = 'page1';
            setTimeout(function() {
                $('#name').val($scope.signupInputs.name);
                $('#username').val($scope.signupInputs.username);
                $('#password').val($scope.signupInputs.password);
            });
        }

        if (pageIndex === 3) {
            // submitting the form to dashboard
            $('#name_hidden').val($scope.signupInputs.name);
            $('#username_hidden').val($scope.signupInputs.username);
            $('#pass_hidden').val($scope.signupInputs.password);
        }
    };

    //$scope.phoneSet = false;
    displayError();

    /**
     * Parses params for crm and phone system.  This disables the need to use select dropdowns
     */
    if (params) {
        //set the selects and turn this off - check to make sure its in the selects
        if (params.crm) {
            console.log('crm set to ', params.crm);
            $scope.crmSet = true;
            var crm = params.crm.toLowerCase();
            $('#crmProvider').val(crm);
        }
        // if (params.phone) {
        //     console.log('phone set to ', params.phone);
        //     $scope.phoneSet = true;
        //     var phone = params.phone.toLowerCase();
        //     $('#phoneSystem').val(phone);
        // }
    }
    trackFormEntry();
    setupHestitationTimers();

    function validateInput(pageIndex) {
        if (pageIndex === 2) {
            var name = $('#name').val();
            var username = $('#username').val();
            var password = $('#password').val();

            $scope.signupInputs.name = name;
            $scope.signupInputs.username = username;
            $scope.signupInputs.password = password;

            return {
                    name: name.length > 2,
                    username: username.length > 4,
                    password: password.length > 4
                }
        } else if (pageIndex === 1) {
            $scope.signupInputs.company = $('#company').val();
            $scope.signupInputs.phoneNumber = $('#phoneNumber').val();
            $scope.signupInputs.crmProvider = $('#crmProvider').val();
        } else if (pageIndex === 3) {
            var company = $('#company').val();
            var phoneNumber = $('#phoneNumber').val();
            var crmProvider = $('#crmProvider').val();

            return {
                company: company.length > 0,
                phoneNumber: phoneNumber.length > 4,
                crmProvider: crmProvider.length > 0
            }
        }
    }
}]);



/**
 * Tracks form entry to enable chat help
 *
 */
function trackFormEntry() {
    var $signupFields = getSignupFields();
    $signupFields.on('keydown click', keydownClickHandler).on('focusout', focusoutHandler);
}

/**
 * Gets the signup fields as jquery object
 *
 * @returns {*|jQuery|HTMLElement}
 */
function getSignupFields() {
    return $('#name, #username, #password, #company, #phoneNumber, #crmProvider');
}

/**
 * Backend will send errors in format where the error text will be placed
 * in the url.  The Messenger library will parse the error and display to
 * the user
 *
 */
function displayError() {
    if (window.location.search.indexOf('error') !== -1) {
        var arr = window.location.search.split('=');
        if (arr.length) {
            var error = decodeURI(arr[1]);
            msg.update({
                message: error
            });
        }
    }
}

/**
 * Hestitation timers track how long someone has been on site
 * and then send this information to the live chat agents
 *
 */
function setupHestitationTimers() {
    if (!window.hesitationTimerNoEntry) {
        window.hesitationTimerNoEntry = setTimeout(function () {
            var message = 'hesitation-90-seconds';
            if (!!window.$zopim) {
                window.$zopim.livechat.addTags(message);
            }
        }, 90000);
    }

    if (!window.hesitationTimerEntry) {
        window.hesitationTimerEntry = setTimeout(function () {
            var message = 'hesitation-45-seconds';
            if (!!window.$zopim) {
                window.$zopim.livechat.addTags(message);
            }
        }, 45000);
    }
}

/**
 * Sends keydown events to segment
 */
function keydownClickHandler() {
    var event = $(this).attr('id') || $(this).attr('class');
    var value = $(this).val();

    if (event === 'login-submit') {
        event = 'submitButton';
    }
    event = 'callinizeSignup_' + event;
    //only track once
    if (!window[event] && !!window.analytics) {
        var opts = {};
        if (emailHolder) opts.email = emailHolder;
        window.analytics.track(event, opts);
        window[event] = true;
    }
    if (event === 'callinizeSignup_username') {
        window.analytics.identify(window.analytics.user().anonymousId(), {
            email: value
        });
    }
}

/**
 * Sends focusout events to segment
 *
 * Uses window variable to not duplicate events.  Also filters out password so this data
 * is never sent to third-party
 */
function focusoutHandler() {
    try {
        jQuery("#sio").val(window.analytics.user().anonymousId());
    }catch(err) { console.error("window.analytics not ready", err); }
    var event = $(this).attr('id');
    var value = $(this).val();
    var $signupFields = getSignupFields();
    //track entry of password not value
    if (!!window.analytics && event !== 'password' && value) {
        var opts = {};
        opts[event] = value;
        if (emailHolder) opts.email = emailHolder;
        //track event with meta
        window.analytics.track(event, opts);
        //visitor details
        if (event === 'callinizeSignup_username') {
            window.analytics.identify(window.analytics.user().anonymousId(), {
                email: value
            });
            emailHolder = value;
        } else {
            console.log("FocusOut Callining identify with opts: " + opts);
            window.analytics.identify(window.analytics.user().anonymousId(), opts);
        }

        if (!!window.$zopim) {
            //constantly run
            window.$zopim.livechat.setName(getCallinizeChatName($signupFields));
            if (event === 'username') window.$zopim.livechat.setEmail(value);
            window.$zopim.livechat.addTags(event + ":" + value);
        }
    }
}

/**
 * Builds a contact name to update olark chat
 *
 * @param $signupFields
 */
function getCallinizeChatName($signupFields) {
    var name = '';
    $.each($signupFields, function (i, el) {
        if ($(el).length && $(el).attr('id') !== 'password') {
            var text = $(el).val();
            var ender = ' | ';
            if (i === 5) ender = '';
            if (text) {
                name += text + ender;
            }
        }
    });

    return name;
}

/**
 * Function emits segmentio event.  Implementation requires wrapping in a debounce
 * functions so we do not send this event too early
 * @param email
 */
function emitUsername(email) {
    if (!email) return;
    emailHolder = email; // update global
    var event = 'callinizeSignup_username';
    window.analytics.identify(window.analytics.user().anonymousId(), {
        email: email
    });
    if (!window[event] && !!window.analytics) {
        var opts = {};
        if (email) opts.email = email;
        window.analytics.track(event, opts);
        window[event] = true;
    }
}

app.directive('uniqueUsername', ['$http', function ($http) {
    return {
        require: 'ngModel',
        link:    function (scope, elem, attrs, ctrl) {
            scope.busy = false;
            scope.$watch(attrs.ngModel, function (value) {

                // hide old error messages
                ctrl.$setValidity('isTaken', true);

                if (!value || value.length < 3) {
                    return;
                }

                scope.busy = true;
                $http.post('https://api.callinize.com/v1.0/signup/check/username', {username: value}).success(function (data) {
                    // everything is fine -> do nothing
                    scope.busy = false;
                    //put delay in here, because when user is typing characters
                    //they wont be done with actual username
                    emitUsername(value);
                }).error(function (data) {
                    // display new error message
                    if (data.isTaken) {
                        ctrl.$setValidity('isTaken', false);
                    }

                    emitUsername(value);
                    scope.busy = false;
                });
            })
        }
    }
}]);

app.directive('uniqueCompany', ['$http', function ($http) {
    return {
        require: 'ngModel',
        link:    function (scope, elem, attrs, ctrl) {
            scope.busy = false;
            scope.$watch(attrs.ngModel, function (value) {

                // hide old error messages
                ctrl.$setValidity('isTaken', true);

                if (!value || value.length < 3) {
                    return;
                }

                scope.busy = true;
                console.log('company', value);
                $http.post('https://api.callinize.com/v1.0/signup/check/company', {company: value}).success(function (data) {
                    // everything is fine -> do nothing
                    scope.busy = false;
                }).error(function (data) {
                    // display new error message
                    if (data.isTaken) {
                        ctrl.$setValidity('isTaken', false);
                    }

                    scope.busy = false;
                });
            })
        }
    }
}]);

app.directive('noEmptyOption', [function () {
    return {
        require: 'ngModel',
        link:    function (scope, elem, attrs, ctrl) {

            scope.$watch('[' + attrs.ngModel + ', ' + attrs.match + ']', function (value) {
                ctrl.$setValidity('match', value[0] === value[1]);
            }, true);

        }
    }
}]);

/*! messenger 1.3.6 */
(function () {
    var e, t = window.Messenger;
    e = window.Messenger = function () {
        return e._call.apply(this, arguments)
    }, window.Messenger.noConflict = function () {
        return window.Messenger = t, e
    }
})(), window.Messenger._ = function () {
    if (window._)return window._;
    var e = Array.prototype, t = Object.prototype, n = Function.prototype, s = (e.push, e.slice), r = (e.concat, t.toString);
    t.hasOwnProperty;
    var i = e.forEach, o = (e.map, e.reduce, e.reduceRight, e.filter), a = (e.every, e.some, e.indexOf, e.lastIndexOf, Array.isArray, Object.keys), l = n.bind, u = {}, c = {}, h = u.each =
                                                                                                                                                                                    u.forEach =
                                                                                                                                                                                    function (e, t, n) {
                                                                                                                                                                                        if (null !=
                                                                                                                                                                                            e) {
                                                                                                                                                                                            if (i &&
                                                                                                                                                                                                e.forEach ===
                                                                                                                                                                                                i) {
                                                                                                                                                                                                e.forEach(t, n);
                                                                                                                                                                                            } else if (e.length ===
                                                                                                                                                                                                       +e.length) {
                                                                                                                                                                                                for (var s = 0, r = e.length;
                                                                                                                                                                                                     r >
                                                                                                                                                                                                     s;
                                                                                                                                                                                                     s++
                                                                                                                                                                                                ) {
                                                                                                                                                                                                    if (t.call(n, e[s], s, e) ===
                                                                                                                                                                                                        c)return
                                                                                                                                                                                                }
                                                                                                                                                                                            } else {
                                                                                                                                                                                                for (var o in
                                                                                                                                                                                                    e) {
                                                                                                                                                                                                    if (u.has(e, o) &&
                                                                                                                                                                                                        t.call(n, e[o], o, e) ===
                                                                                                                                                                                                        c)return
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    };
    u.result = function (e, t) {
        if (null == e)return null;
        var n = e[t];
        return u.isFunction(n) ? n.call(e) : n
    }, u.once = function (e) {
        var t, n = !1;
        return function () {
            return n ? t : (n = !0, t = e.apply(this, arguments), e = null, t)
        }
    };
    var p = 0;
    return u.uniqueId = function (e) {
        var t = ++p + "";
        return e ? e + t : t
    }, u.filter = u.select = function (e, t, n) {
        var s = [];
        return null == e ? s : o && e.filter === o ? e.filter(t, n) : (h(e, function (e, r, i) {
            t.call(n, e, r, i) && (s[s.length] = e)
        }), s)
    }, h(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (e) {
        u["is" + e] = function (t) {
            return r.call(t) == "[object " + e + "]"
        }
    }), u.defaults = function (e) {
        return h(s.call(arguments, 1), function (t) {
            if (t) {
                for (var n in t) {
                    null == e[n] && (e[n] = t[n])
                }
            }
        }), e
    }, u.extend = function (e) {
        return h(s.call(arguments, 1), function (t) {
            if (t) {
                for (var n in t) {
                    e[n] = t[n]
                }
            }
        }), e
    }, u.keys = a || function (e) {
        if (e !== Object(e))throw new TypeError("Invalid object");
        var t = [];
        for (var n in e) {
            u.has(e, n) && (t[t.length] = n);
        }
        return t
    }, u.bind = function (e, t) {
        if (e.bind === l && l)return l.apply(e, s.call(arguments, 1));
        var n = s.call(arguments, 2);
        return function () {
            return e.apply(t, n.concat(s.call(arguments)))
        }
    }, u.isObject = function (e) {
        return e === Object(e)
    }, u
}(), window.Messenger.Events = function () {
    if (window.Backbone && Backbone.Events)return Backbone.Events;
    var e = function () {
        var e = /\s+/, t = function (t, n, s, r) {
            if (!s)return !0;
            if ("object" == typeof s) {
                for (var i in s) {
                    t[n].apply(t, [i, s[i]].concat(r));
                }
            } else {
                if (!e.test(s))return !0;
                for (var o = s.split(e), a = 0, l = o.length; l > a; a++) {
                    t[n].apply(t, [o[a]].concat(r))
                }
            }
        }, n = function (e, t) {
            var n, s = -1, r = e.length;
            switch (t.length) {
                case 0:
                    for (; r > ++s;) {
                        (n = e[s]).callback.call(n.ctx);
                    }
                    return;
                case 1:
                    for (; r > ++s;) {
                        (n = e[s]).callback.call(n.ctx, t[0]);
                    }
                    return;
                case 2:
                    for (; r > ++s;) {
                        (n = e[s]).callback.call(n.ctx, t[0], t[1]);
                    }
                    return;
                case 3:
                    for (; r > ++s;) {
                        (n = e[s]).callback.call(n.ctx, t[0], t[1], t[2]);
                    }
                    return;
                default:
                    for (; r > ++s;) {
                        (n = e[s]).callback.apply(n.ctx, t)
                    }
            }
        }, s = {
            on:            function (e, n, s) {
                if (!t(this, "on", e, [n, s]) || !n)return this;
                this._events || (this._events = {});
                var r = this._events[e] || (this._events[e] = []);
                return r.push({
                    callback: n,
                    context:  s,
                    ctx:      s || this
                }), this
            },
            once:          function (e, n, s) {
                if (!t(this, "once", e, [n, s]) || !n)return this;
                var r = this, i = _.once(function () {
                    r.off(e, i), n.apply(this, arguments)
                });
                return i._callback = n, this.on(e, i, s), this
            },
            off:           function (e, n, s) {
                var r, i, o, a, l, u, c, h;
                if (!this._events || !t(this, "off", e, [n, s]))return this;
                if (!e && !n && !s)return this._events = {}, this;
                for (a = e ? [e] : _.keys(this._events), l = 0, u = a.length; u > l; l++) {
                    if (e = a[l], r = this._events[e]) {
                        if (o = [], n || s) {
                            for (c = 0, h = r.length; h > c; c++) {
                                i = r[c], (n && n !== i.callback && n !== i.callback._callback ||
                                           s && s !== i.context) && o.push(i);
                            }
                        }
                        this._events[e] = o
                    }
                }
                return this
            },
            trigger:       function (e) {
                if (!this._events)return this;
                var s = Array.prototype.slice.call(arguments, 1);
                if (!t(this, "trigger", e, s))return this;
                var r = this._events[e], i = this._events.all;
                return r && n(r, s), i && n(i, arguments), this
            },
            listenTo:      function (e, t, n) {
                var s = this._listeners || (this._listeners = {}), r = e._listenerId ||
                                                                       (e._listenerId =
                                                                        _.uniqueId("l"));
                return s[r] = e, e.on(t, "object" == typeof t ? this : n, this), this
            },
            stopListening: function (e, t, n) {
                var s = this._listeners;
                if (s) {
                    if (e) {
                        e.off(t, "object" == typeof t ? this : n, this), t || n ||
                                                                         delete s[e._listenerId];
                    } else {
                        "object" == typeof t && (n = this);
                        for (var r in s) {
                            s[r].off(t, n, this);
                        }
                        this._listeners = {}
                    }
                    return this
                }
            }
        };
        return s.bind = s.on, s.unbind = s.off, s
    };
    return e()
}(), function () {
    var e, t, n, s, r, i, o, a, l, u, c, h = {}.hasOwnProperty, p = function (e, t) {
        function n() {
            this.constructor = e
        }

        for (var s in t) {
            h.call(t, s) && (e[s] = t[s]);
        }
        return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
    }, d = [].slice, f = [].indexOf || function (e) {
            for (var t = 0, n = this.length; n > t; t++) {
                if (t in this && this[t] === e)return t;
            }
            return -1
        };
    e = jQuery, i = null != (l = window._) ? l : window.Messenger._, s = null != (u = "undefined" !=
                                                                                      typeof Backbone &&
                                                                                      null !==
                                                                                      Backbone
        ? Backbone.Events : void 0) ? u : window.Messenger.Events, n = function () {
        function t(t) {
            e.extend(this, s), i.isObject(t) && (t.el && this.setElement(t.el), this.model =
                                                                                t.model), this.initialize.apply(this, arguments)
        }

        return t.prototype.setElement = function (t) {
            return this.$el = e(t), this.el = this.$el[0]
        }, t.prototype.delegateEvents = function (e) {
            var t, n, s, r, o, a, l;
            if (e || (e = i.result(this, "events"))) {
                t = /^(\S+)\s*(.*)$/, this.undelegateEvents(), l = [];
                for (s in e) {
                    if (o = e[s], i.isFunction(o) || (o = this[e[s]]), !o) {
                        throw Error("Method " + e[s] + " does not exist");
                    }
                    r = s.match(t), n = r[1], a = r[2], o = i.bind(o, this), n +=
                                                                             ".delegateEvents" +
                                                                             this.cid, "" === a
                        ? l.push(this.jqon(n, o)) : l.push(this.jqon(n, a, o))
                }
                return l
            }
        }, t.prototype.jqon = function (e, t, n) {
            var s;
            return null != this.$el.on ? (s = this.$el).on.apply(s, arguments) : (null == n &&
                                                                                  (n = t, t =
                                                                                          void 0), null !=
                                                                                                   t
                ? this.$el.delegate(t, e, n) : this.$el.bind(e, n))
        }, t.prototype.jqoff = function (e) {
            var t;
            return null != this.$el.off ? (t = this.$el).off.apply(t, arguments)
                : (this.$el.undelegate(), this.$el.unbind(e))
        }, t.prototype.undelegateEvents = function () {
            return this.jqoff(".delegateEvents" + this.cid)
        }, t.prototype.remove = function () {
            return this.undelegateEvents(), this.$el.remove()
        }, t
    }(), o = function (t) {
        function n() {
            return n.__super__.constructor.apply(this, arguments)
        }

        return p(n, t), n.prototype.defaults = {
            hideAfter: 10,
            scroll:    !0
        }, n.prototype.initialize = function (t) {
            return null == t && (t = {}), this.shown = !1, this.rendered = !1, this.messenger =
                                                                               t.messenger, this.options =
                                                                                            e.extend({}, this.options, t, this.defaults)
        }, n.prototype.show = function () {
            var e;
            return this.rendered ||
                   this.render(), this.$message.removeClass("messenger-hidden"), e =
                                                                                 this.shown, this.shown =
                                                                                             !0, e
                ? void 0 : this.trigger("show")
        }, n.prototype.hide = function () {
            var e;
            if (this.rendered) {
                return this.$message.addClass("messenger-hidden"), e = this.shown, this.shown =
                                                                                   !1, e
                    ? this.trigger("hide") : void 0
            }
        }, n.prototype.cancel = function () {
            return this.hide()
        }, n.prototype.update = function (t) {
            var n, s = this;
            return i.isString(t) && (t = {message: t}), e.extend(this.options, t), this.lastUpdate =
                                                                                   new Date, this.rendered =
                                                                                             !1, this.events =
                                                                                                 null !=
                                                                                                 (n =
                                                                                                  this.options.events)
                                                                                                     ? n
                                                                                                     : {}, this.render(), this.actionsToEvents(), this.delegateEvents(), this.checkClickable(), this.options.hideAfter
                ? (this.$message.addClass("messenger-will-hide-after"), null != this._hideTimeout &&
                                                                        clearTimeout(this._hideTimeout), this._hideTimeout =
                                                                                                         setTimeout(function () {
                                                                                                             return s.hide()
                                                                                                         }, 1e3 *
                                                                                                            this.options.hideAfter))
                : this.$message.removeClass("messenger-will-hide-after"), this.options.hideOnNavigate
                ? (this.$message.addClass("messenger-will-hide-on-navigate"), null !=
                                                                              ("undefined" !=
                                                                               typeof Backbone &&
                                                                               null !== Backbone
                                                                                  ? Backbone.history
                                                                                  : void 0) &&
                                                                              Backbone.history.on("route", function () {
                                                                                  return s.hide()
                                                                              }))
                : this.$message.removeClass("messenger-will-hide-on-navigate"), this.trigger("update", this)
        }, n.prototype.scrollTo = function () {
            return this.options.scroll ? e.scrollTo(this.$el, {
                duration: 400,
                offset:   {
                    left: 0,
                    top:  -20
                }
            }) : void 0
        }, n.prototype.timeSinceUpdate = function () {
            return this.lastUpdate ? new Date - this.lastUpdate : null
        }, n.prototype.actionsToEvents = function () {
            var e, t, n, s, r = this;
            n = this.options.actions, s = [];
            for (t in n) {
                e = n[t], s.push(this.events['click [data-action="' + t + '"] a'] = function (e) {
                    return function (n) {
                        return n.preventDefault(), n.stopPropagation(), r.trigger("action:" +
                                                                                  t, e, n), e.action.call(r, n, r)
                    }
                }(e));
            }
            return s
        }, n.prototype.checkClickable = function () {
            var e, t, n, s;
            n = this.events, s = [];
            for (t in n) {
                e = n[t], "click" === t ? s.push(this.$message.addClass("messenger-clickable"))
                    : s.push(void 0);
            }
            return s
        }, n.prototype.undelegateEvents = function () {
            var e;
            return n.__super__.undelegateEvents.apply(this, arguments), null != (e = this.$message)
                ? e.removeClass("messenger-clickable") : void 0
        }, n.prototype.parseActions = function () {
            var t, n, s, r, i, o;
            n = [], i = this.options.actions;
            for (r in i) {
                t = i[r], s = e.extend({}, t), s.name = r, null == (o = s.label) &&
                                                           (s.label = r), n.push(s);
            }
            return n
        }, n.prototype.template = function (t) {
            var n, s, r, i, o, a, l, u, c, h, p = this;
            for (o =
                 e("<div class='messenger-message message alert " + t.type + " message-" + t.type +
                   " alert-" + t.type + "'>"), t.showCloseButton && (r =
                                                                     e('<button type="button" class="messenger-close" data-dismiss="alert">&times;</button>'), r.click(function () {
                return p.cancel(), !0
            }), o.append(r)), a = e('<div class="messenger-message-inner">' + t.message +
                                    "</div>"), o.append(a), t.actions.length && (s =
                                                                                 e('<div class="messenger-actions">')), h =
                                                                                                                        t.actions, u =
                                                                                                                                   0, c =
                                                                                                                                      h.length;
                 c > u; u++
            ) {
                l = h[u], n = e("<span>"), n.attr("data-action", "" + l.name), i =
                                                                               e("<a>"), i.html(l.label), n.append(e('<span class="messenger-phrase">')), n.append(i), s.append(n);
            }
            return o.append(s), o
        }, n.prototype.render = function () {
            var t;
            if (!this.rendered) {
                return this._hasSlot ||
                       (this.setElement(this.messenger._reserveMessageSlot(this)), this._hasSlot =
                                                                                   !0), t =
                                                                                        e.extend({}, this.options, {actions: this.parseActions()}), this.$message =
                                                                                                                                                    e(this.template(t)), this.$el.html(this.$message), this.shown =
                                                                                                                                                                                                       !0, this.rendered =
                                                                                                                                                                                                           !0, this.trigger("render")
            }
        }, n
    }(n), r = function (e) {
        function t() {
            return t.__super__.constructor.apply(this, arguments)
        }

        return p(t, e), t.prototype.initialize = function () {
            return t.__super__.initialize.apply(this, arguments), this._timers = {}
        }, t.prototype.cancel = function () {
            return this.clearTimers(), this.hide(), null != this._actionInstance &&
                                                    null != this._actionInstance.abort
                ? this._actionInstance.abort() : void 0
        }, t.prototype.clearTimers = function () {
            var e, t, n, s;
            n = this._timers;
            for (e in n) {
                t = n[e], clearTimeout(t);
            }
            return this._timers = {}, null != (s = this.$message)
                ? s.removeClass("messenger-retry-soon messenger-retry-later") : void 0
        }, t.prototype.render = function () {
            var e, n, s, r;
            t.__super__.render.apply(this, arguments), this.clearTimers(), s =
                                                                           this.options.actions, r =
                                                                                                 [];
            for (n in s) {
                e = s[n], e.auto ? r.push(this.startCountdown(n, e)) : r.push(void 0);
            }
            return r
        }, t.prototype.renderPhrase = function (e, t) {
            var n;
            return n = e.phrase.replace("TIME", this.formatTime(t))
        }, t.prototype.formatTime = function (e) {
            var t;
            return t = function (e, t) {
                return e = Math.floor(e), 1 !== e && (t += "s"), "in " + e + " " + t
            }, 0 === Math.floor(e) ? "now..." : 60 > e ? t(e, "second") : (e /= 60, 60 > e
                ? t(e, "minute") : (e /= 60, t(e, "hour")))
        }, t.prototype.startCountdown = function (e, t) {
            var n, s, r, i, o = this;
            if (null == this._timers[e]) {
                return n = this.$message.find("[data-action='" + e + "'] .messenger-phrase"), s =
                                                                                              null !=
                                                                                              (i =
                                                                                               t.delay)
                                                                                                  ? i
                                                                                                  : 3, 10 >=
                                                                                                       s
                    ? (this.$message.removeClass("messenger-retry-later"), this.$message.addClass("messenger-retry-soon"))
                    : (this.$message.removeClass("messenger-retry-soon"), this.$message.addClass("messenger-retry-later")), r =
                                                                                                                            function () {
                                                                                                                                var i;
                                                                                                                                return n.text(o.renderPhrase(t, s)), s >
                                                                                                                                                                     0
                                                                                                                                    ? (i =
                                                                                                                                       Math.min(s, 1), s -=
                                                                                                                                                       i, o._timers[e] =
                                                                                                                                                          setTimeout(r, 1e3 *
                                                                                                                                                                        i))
                                                                                                                                    : (o.$message.removeClass("messenger-retry-soon messenger-retry-later"), delete o._timers[e], t.action())
                                                                                                                            }, r()
            }
        }, t
    }(o), a = function (t) {
        function n() {
            return n.__super__.constructor.apply(this, arguments)
        }

        return p(n, t), n.prototype.tagName = "ul", n.prototype.className =
                                                    "messenger", n.prototype.messageDefaults =
                                                                 {type: "info"}, n.prototype.initialize =
                                                                                 function (t) {
                                                                                     return this.options =
                                                                                            null !=
                                                                                            t ? t
                                                                                                : {}, this.history =
                                                                                                      [], this.messageDefaults =
                                                                                                          e.extend({}, this.messageDefaults, this.options.messageDefaults)
                                                                                 }, n.prototype.render =
                                                                                    function () {
                                                                                        return this.updateMessageSlotClasses()
                                                                                    }, n.prototype.findById =
                                                                                       function (e) {
                                                                                           return i.filter(this.history, function (t) {
                                                                                               return t.msg.options.id ===
                                                                                                      e
                                                                                           })
                                                                                       }, n.prototype._reserveMessageSlot =
                                                                                          function (t) {
                                                                                              var n, s, r = this;
                                                                                              for (n =
                                                                                                   e("<li>"), n.addClass("messenger-message-slot"), this.$el.prepend(n), this.history.push({
                                                                                                  msg:   t,
                                                                                                  $slot: n
                                                                                              }), this._enforceIdConstraint(t), t.on("update", function () {
                                                                                                  return r._enforceIdConstraint(t)
                                                                                              });
                                                                                                   this.options.maxMessages &&
                                                                                                   this.history.length >
                                                                                                   this.options.maxMessages;
                                                                                              ) {
                                                                                                  s =
                                                                                                  this.history.shift(), s.msg.remove(), s.$slot.remove();
                                                                                              }
                                                                                              return n
                                                                                          }, n.prototype._enforceIdConstraint =
                                                                                             function (e) {
                                                                                                 var t, n, s, r, i;
                                                                                                 if (null !=
                                                                                                     e.options.id) {
                                                                                                     for (i =
                                                                                                          this.history, n =
                                                                                                                        0, s =
                                                                                                                           i.length;
                                                                                                          s >
                                                                                                          n;
                                                                                                          n++
                                                                                                     ) {
                                                                                                         if (t =
                                                                                                             i[n], r =
                                                                                                                   t.msg, null !=
                                                                                                                          r.options.id &&
                                                                                                                          r.options.id ===
                                                                                                                          e.options.id &&
                                                                                                                          e !==
                                                                                                                          r) {
                                                                                                             if (e.options.singleton)return e.hide(), void 0;
                                                                                                             r.hide()
                                                                                                         }
                                                                                                     }
                                                                                                 }
                                                                                             }, n.prototype.newMessage =
                                                                                                function (e) {
                                                                                                    var t, n, s, i, a = this;
                                                                                                    return null ==
                                                                                                           e &&
                                                                                                           (e =
                                                                                                            {}), e.messenger =
                                                                                                                 this, o =
                                                                                                                       null !=
                                                                                                                       (n =
                                                                                                                        null !=
                                                                                                                        (s =
                                                                                                                         Messenger.themes[null !=
                                                                                                                                          (i =
                                                                                                                                           e.theme)
                                                                                                                             ? i
                                                                                                                             : this.options.theme])
                                                                                                                            ? s.Message
                                                                                                                            : void 0)
                                                                                                                           ? n
                                                                                                                           : r, t =
                                                                                                                                new o(e), t.on("show", function () {
                                                                                                        return e.scrollTo &&
                                                                                                               "fixed" !==
                                                                                                               a.$el.css("position")
                                                                                                            ? t.scrollTo()
                                                                                                            : void 0
                                                                                                    }), t.on("hide show render", this.updateMessageSlotClasses, this), t
                                                                                                }, n.prototype.updateMessageSlotClasses =
                                                                                                   function () {
                                                                                                       var e, t, n, s, r, i, o;
                                                                                                       for (s =
                                                                                                            !0, t =
                                                                                                                null, e =
                                                                                                                      !1, o =
                                                                                                                          this.history, r =
                                                                                                                                        0, i =
                                                                                                                                           o.length;
                                                                                                            i >
                                                                                                            r;
                                                                                                            r++
                                                                                                       ) {
                                                                                                           n =
                                                                                                           o[r], n.$slot.removeClass("messenger-first messenger-last messenger-shown"), n.msg.shown &&
                                                                                                                                                                                        n.msg.rendered &&
                                                                                                                                                                                        (n.$slot.addClass("messenger-shown"), e =
                                                                                                                                                                                                                              !0, t =
                                                                                                                                                                                                                                  n, s &&
                                                                                                                                                                                                                                     (s =
                                                                                                                                                                                                                                      !1, n.$slot.addClass("messenger-first")));
                                                                                                       }
                                                                                                       return null !=
                                                                                                              t &&
                                                                                                              t.$slot.addClass("messenger-last"), this.$el["" +
                                                                                                                                                           (e
                                                                                                                                                               ? "remove"
                                                                                                                                                               : "add") +
                                                                                                                                                           "Class"]("messenger-empty")
                                                                                                   }, n.prototype.hideAll =
                                                                                                      function () {
                                                                                                          var e, t, n, s, r;
                                                                                                          for (s =
                                                                                                               this.history, r =
                                                                                                                             [], t =
                                                                                                                                 0, n =
                                                                                                                                    s.length;
                                                                                                               n >
                                                                                                               t;
                                                                                                               t++
                                                                                                          ) {
                                                                                                              e =
                                                                                                              s[t], r.push(e.msg.hide());
                                                                                                          }
                                                                                                          return r
                                                                                                      }, n.prototype.post =
                                                                                                         function (t) {
                                                                                                             var n;
                                                                                                             return i.isString(t) &&
                                                                                                                    (t =
                                                                                                                     {message: t}), t =
                                                                                                                                    e.extend(!0, {}, this.messageDefaults, t), n =
                                                                                                                                                                               this.newMessage(t), n.update(t), n
                                                                                                         }, n
    }(n), t = function (t) {
        function n() {
            return n.__super__.constructor.apply(this, arguments)
        }

        return p(n, t), n.prototype.doDefaults = {
            progressMessage:         null,
            successMessage:          null,
            errorMessage:            "Error connecting to the server.",
            showSuccessWithoutError: !0,
            retry:                   {
                auto:  !0,
                allow: !0
            },
            action:                  e.ajax
        }, n.prototype.hookBackboneAjax = function (t) {
            var n, s = this;
            if (null == t && (t = {}), null == window.Backbone) {
                throw"Expected Backbone to be defined";
            }
            return t = i.defaults(t, {
                id:                      "BACKBONE_ACTION",
                errorMessage:            !1,
                successMessage:          "Request completed successfully.",
                showSuccessWithoutError: !1
            }), n = function (e) {
                var n;
                return n = i.extend({}, t, e.messenger), s["do"](n, e)
            }, null != Backbone.ajax ? (Backbone.ajax._withoutMessenger &&
                                        (Backbone.ajax = Backbone.ajax._withoutMessenger), (null ==
                                                                                            t.action ||
                                                                                            t.action ===
                                                                                            this.doDefaults.action) &&
                                                                                           (t.action =
                                                                                            Backbone.ajax), n._withoutMessenger =
                                                                                                            Backbone.ajax, Backbone.ajax =
                                                                                                                           n)
                : Backbone.sync = i.wrap(Backbone.sync, function () {
                var t, s, r;
                return r = arguments[0], t = arguments.length >= 2 ? d.call(arguments, 1) : [], s =
                                                                                                e.ajax, e.ajax =
                                                                                                        n, r.call.apply(r, [this].concat(d.call(t))), e.ajax =
                                                                                                                                                      s
            })
        }, n.prototype._getHandlerResponse = function (e) {
            return e === !1 ? !1 : e === !0 || null == e ? !0 : e
        }, n.prototype._parseEvents = function (e) {
            var t, n, s, r, i, o, a;
            null == e && (e = {}), i = {};
            for (r in e) {
                s = e[r], n = r.indexOf(" "), o = r.substring(0, n), t = r.substring(n + 1), null ==
                                                                                             (a =
                                                                                              i[o]) &&
                                                                                             (i[o] =
                                                                                              {}), i[o][t] =
                                                                                                   s;
            }
            return i
        }, n.prototype._normalizeResponse = function () {
            var e, t, n, s, r, o, a;
            for (n = arguments.length >= 1 ? d.call(arguments, 0) : [], s = null, r = null, e =
                                                                                            null, o =
                                                                                                  0, a =
                                                                                                     n.length;
                 a > o; o++
            ) {
                t = n[o], "success" === t || "timeout" === t || "abort" === t ? s = t : null !=
                                                                                        (null != t
                                                                                            ? t.readyState
                                                                                            : void 0) &&
                                                                                        null !=
                                                                                        (null != t
                                                                                            ? t.responseText
                                                                                            : void 0)
                    ? r = t : i.isObject(t) && (e = t);
            }
            return [s, e, r]
        }, n.prototype.run = function () {
            var t, n, s, r, o, a, l, u, c, h, p, g, m, v, y, _, w = this;
            if (l = arguments[0], h = arguments[1], t = arguments.length >= 3 ? d.call(arguments, 2)
                    : [], null == h && (h = {}), l =
                                                 e.extend(!0, {}, this.messageDefaults, this.doDefaults, null !=
                                                                                                         l
                                                     ? l : {}), s = this._parseEvents(l.events), r =
                                                                                                 function (e, t) {
                                                                                                     var n;
                                                                                                     return n =
                                                                                                            l[e +
                                                                                                              "Message"], i.isFunction(n)
                                                                                                         ? n.call(w, e, t)
                                                                                                         : n
                                                                                                 }, u =
                                                                                                    null !=
                                                                                                    (y =
                                                                                                     l.messageInstance)
                                                                                                        ? y
                                                                                                        : this.newMessage(l), null !=
                                                                                                                              l.id &&
                                                                                                                              (u.options.id =
                                                                                                                               l.id), null !=
                                                                                                                                      l.progressMessage &&
                                                                                                                                      u.update(e.extend({}, l, {
                                                                                                                                          message: r("progress", null),
                                                                                                                                          type:    "info"
                                                                                                                                      })), a =
                                                                                                                                           {}, i.each(["error",
                                                                                                                                                       "success"], function (n) {
                    var o;
                    return o = h[n], a[n] = function () {
                        var a, c, p, g, m, v, y, _, b, x, M, C, k, $, E;
                        return v = arguments.length >= 1 ? d.call(arguments, 0) : [], b =
                                                                                      w._normalizeResponse.apply(w, v), m =
                                                                                                                        b[0], a =
                                                                                                                              b[1], _ =
                                                                                                                                    b[2], "success" ===
                                                                                                                                          n &&
                                                                                                                                          null ==
                                                                                                                                          u.errorCount &&
                                                                                                                                          l.showSuccessWithoutError ===
                                                                                                                                          !1 &&
                                                                                                                                          (l.successMessage =
                                                                                                                                           null), "error" ===
                                                                                                                                                  n &&
                                                                                                                                                  (null ==
                                                                                                                                                   (x =
                                                                                                                                                    l.errorCount) &&
                                                                                                                                                   (l.errorCount =
                                                                                                                                                    0), l.errorCount +=
                                                                                                                                                        1), p =
                                                                                                                                                            l.returnsPromise
                                                                                                                                                                ? v[0]
                                                                                                                                                                : "function" ==
                                                                                                                                                                  typeof o
                                                                                                                                                                ? o.apply(null, v)
                                                                                                                                                                : void 0, y =
                                                                                                                                                                          w._getHandlerResponse(p), i.isString(y) &&
                                                                                                                                                                                                    (y =
                                                                                                                                                                                                     {message: y}), "error" !==
                                                                                                                                                                                                                    n ||
                                                                                                                                                                                                                    0 !==
                                                                                                                                                                                                                    (null !=
                                                                                                                                                                                                                     _
                                                                                                                                                                                                                        ? _.status
                                                                                                                                                                                                                        : void 0) &&
                                                                                                                                                                                                                    "abort" !==
                                                                                                                                                                                                                    m
                            ? "error" === n && null != l.ignoredErrorCodes &&
                              (M = null != _ ? _.status : void 0, f.call(l.ignoredErrorCodes, M) >=
                                                                  0) ? (u.hide(), void 0) : (c = {
                            message:        r(n, _),
                            type:           n,
                            events: null != (C = s[n]) ? C : {},
                            hideOnNavigate: "success" === n
                        }, g = e.extend({}, l, c, y), "number" ==
                                                      typeof(null != (k = g.retry) ? k.allow
                                                          : void 0) && g.retry.allow--, "error" ===
                                                                                        n &&
                                                                                        (null != _
                                                                                            ? _.status
                                                                                            : void 0) >=
                                                                                        500 &&
                                                                                        (null !=
                                                                                         ($ =
                                                                                          g.retry)
                                                                                            ? $.allow
                                                                                            : void 0)
                            ? (null == g.retry.delay &&
                               (g.retry.delay = 4 > g.errorCount ? 10 : 300), g.hideAfter &&
                                                                              (null ==
                                                                               (E = g._hideAfter) &&
                                                                               (g._hideAfter =
                                                                                g.hideAfter), g.hideAfter =
                                                                                              g._hideAfter +
                                                                                              g.retry.delay), g._retryActions =
                                                                                                              !0, g.actions =
                                                                                                                  {
                                                                                                                      retry:  {
                                                                                                                          label:  "retry now",
                                                                                                                          phrase: "Retrying TIME",
                                                                                                                          auto:   g.retry.auto,
                                                                                                                          delay:  g.retry.delay,
                                                                                                                          action: function () {
                                                                                                                              return g.messageInstance =
                                                                                                                                     u, setTimeout(function () {
                                                                                                                                  return w["do"].apply(w, [g,
                                                                                                                                                           h].concat(d.call(t)))
                                                                                                                              }, 0)
                                                                                                                          }
                                                                                                                      },
                                                                                                                      cancel: {
                                                                                                                          action: function () {
                                                                                                                              return u.cancel()
                                                                                                                          }
                                                                                                                      }
                                                                                                                  })
                            : g._retryActions &&
                              (delete g.actions.retry, delete g.actions.cancel, delete l._retryActions), u.update(g), y &&
                                                                                                                      g.message
                            ? (Messenger(), u.show()) : u.hide()) : (u.hide(), void 0)
                    }
                }), !l.returnsPromise) {
                for (g in a) {
                    o = a[g], c = h[g], h[g] = o;
                }
            }
            for (u._actionInstance = l.action.apply(l, [h].concat(d.call(t))), l.returnsPromise &&
                                                                               u._actionInstance.then(a.success, a.error), p =
                                                                                                                           ["done",
                                                                                                                            "progress",
                                                                                                                            "fail",
                                                                                                                            "state",
                                                                                                                            "then"], m =
                                                                                                                                     0, v =
                                                                                                                                        p.length;
                 v > m; m++
            ) {
                n = p[m], null != u[n] && delete u[n], u[n] = null != (_ = u._actionInstance) ? _[n]
                    : void 0;
            }
            return u
        }, n.prototype["do"] = n.prototype.run, n.prototype.ajax = function () {
            var t, n;
            return n = arguments[0], t =
                                     arguments.length >= 2 ? d.call(arguments, 1) : [], n.action =
                                                                                        e.ajax, this.run.apply(this, [n].concat(d.call(t)))
        }, n.prototype.expectPromise = function (e, t) {
            return t = i.extend({}, t, {
                action:         e,
                returnsPromise: !0
            }), this.run(t)
        }, n
    }(a), e.fn.messenger = function () {
        var n, s, r, o, l, u, c, h;
        return r = arguments[0], s = arguments.length >= 2 ? d.call(arguments, 1) : [], null == r &&
                                                                                        (r =
                                                                                         {}), n =
                                                                                              this, null !=
                                                                                                    r &&
                                                                                                    i.isString(r)
            ? (h = n.data("messenger"))[r].apply(h, s) : (l = r, null == n.data("messenger") && (a =
                                                                                                 null !=
                                                                                                 (u =
                                                                                                  null !=
                                                                                                  (c =
                                                                                                   Messenger.themes[l.theme])
                                                                                                      ? c.Messenger
                                                                                                      : void 0)
                                                                                                     ? u
                                                                                                     : t, n.data("messenger", o =
                                                                                                                              new a(e.extend({el: n}, l))), o.render()), n.data("messenger"))
    }, window.Messenger._call = function (t) {
        var n, s, r, i, o, a, l, u, c, h, p;
        if (a = {
                extraClasses:    "messenger-fixed messenger-on-bottom messenger-on-right",
                theme:           "future",
                maxMessages:     9,
                parentLocations: ["body"]
            }, t = e.extend(a, e._messengerDefaults, Messenger.options, t), null != t.theme &&
                                                                            (t.extraClasses +=
                                                                             " messenger-theme-" +
                                                                             t.theme), l =
                                                                                       t.instance ||
                                                                                       Messenger.instance, null ==
                                                                                                           t.instance) {
            for (c = t.parentLocations, s = null, r = null, h = 0, p = c.length; p > h; h++) {
                if (u = c[h], s = e(u), s.length) {
                    i = u;
                    break
                }
            }
            l ? e(l._location) !== e(i) && (l.$el.detach(), s.prepend(l.$el)) : (n =
                                                                                 e("<ul>"), s.prepend(n), l =
                                                                                                          n.messenger(t), l._location =
                                                                                                                          i, Messenger.instance =
                                                                                                                             l)
        }
        return null != l._addedClasses && l.$el.removeClass(l._addedClasses), l.$el.addClass(o =
                                                                                             "" +
                                                                                             l.className +
                                                                                             " " +
                                                                                             t.extraClasses), l._addedClasses =
                                                                                                              o, l
    }, e.extend(Messenger, {
        Message:   r,
        Messenger: t,
        themes: null != (c = Messenger.themes) ? c : {}
    }), e.globalMessenger = window.Messenger = Messenger
}.call(this);

(function () {
    var $, FutureMessage, spinner_template, __hasProp = {}.hasOwnProperty, __extends = function (child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

    $ = jQuery;

    spinner_template =
    '<div class="messenger-spinner">\n    <span class="messenger-spinner-side messenger-spinner-side-left">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n    <span class="messenger-spinner-side messenger-spinner-side-right">\n        <span class="messenger-spinner-fill"></span>\n    </span>\n</div>';

    FutureMessage = (function (_super) {

        __extends(FutureMessage, _super);

        function FutureMessage() {
            return FutureMessage.__super__.constructor.apply(this, arguments);
        }

        FutureMessage.prototype.template = function (opts) {
            var $message;
            $message = FutureMessage.__super__.template.apply(this, arguments);
            $message.append($(spinner_template));
            return $message;
        };

        return FutureMessage;

    })(window.Messenger.Message);

    window.Messenger.themes.future = {
        Message: FutureMessage
    };

}).call(this);

//setup standard message across all
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-top',
    theme:        'future'
};
window.revealDefaults = {
    animation:              'fadeAndPop',                   //fade, fadeAndPop, none
    animationspeed:         300,                       //how fast animations are
    closeonbackgroundclick: true,              //if you click background will modal close?
    dismissmodalclass:      'close-reveal-modal'    //the class of a button or element that will close an open modal
};

window.msg = Messenger().post({
    message:   '',
    hideAfter: 4,
    type:      'success'
}).hide();

/**
 * Autofill event polyfill ##version:1.0.0##
 * (c) 2014 Google, Inc.
 * License: MIT
 */
(function (window) {
    var $ = window.jQuery || window.angular.element;
    var rootElement = window.document.documentElement, $rootElement = $(rootElement);

    addGlobalEventListener('change', markValue);
    addValueChangeByJsListener(markValue);

    $.prototype.checkAndTriggerAutoFillEvent = jqCheckAndTriggerAutoFillEvent;

    // Need to use blur and not change event
    // as Chrome does not fire change events in all cases an input is changed
    // (e.g. when starting to type and then finish the input by auto filling a username)
    addGlobalEventListener('blur', function (target) {
        // setTimeout needed for Chrome as it fills other
        // form fields a little later...
        window.setTimeout(function () {
            findParentForm(target).find('input').checkAndTriggerAutoFillEvent();
        }, 20);
    });

    window.document.addEventListener('DOMContentLoaded', function () {
        // The timeout is needed for Chrome as it auto fills
        // login forms some time after DOMContentLoaded!
        window.setTimeout(function () {
            $rootElement.find('input').checkAndTriggerAutoFillEvent();
        }, 200);
    }, false);

    return;

    // ----------

    function jqCheckAndTriggerAutoFillEvent() {
        var i, el;
        for (i = 0; i < this.length; i++) {
            el = this[i];
            if (!valueMarked(el)) {
                markValue(el);
                triggerChangeEvent(el);
            }
        }
    }

    function valueMarked(el) {
        var val = el.value, $$currentValue = el.$$currentValue;
        if (!val && !$$currentValue) {
            return true;
        }
        return val === $$currentValue;
    }

    function markValue(el) {
        el.$$currentValue = el.value;
    }

    function addValueChangeByJsListener(listener) {
        var jq = window.jQuery || window.angular.element, jqProto = jq.prototype;
        var _val = jqProto.val;
        jqProto.val = function (newValue) {
            var res = _val.apply(this, arguments);
            if (arguments.length > 0) {
                forEach(this, function (el) {
                    listener(el, newValue);
                });
            }
            return res;
        }
    }

    function addGlobalEventListener(eventName, listener) {
        // Use a capturing event listener so that
        // we also get the event when it's stopped!
        // Also, the blur event does not bubble.
        rootElement.addEventListener(eventName, onEvent, true);

        function onEvent(event) {
            var target = event.target;
            listener(target);
        }
    }

    function findParentForm(el) {
        while (el) {
            if (el.nodeName === 'FORM') {
                return $(el);
            }
            el = el.parentNode;
        }
        return $();
    }

    function forEach(arr, listener) {
        if (arr.forEach) {
            return arr.forEach(listener);
        }
        var i;
        for (i = 0; i < arr.length; i++) {
            listener(arr[i]);
        }
    }

    function triggerChangeEvent(element) {
        var doc = window.document;
        var event = doc.createEvent("HTMLEvents");
        event.initEvent("change", true, true);
        element.dispatchEvent(event);
    }

})(window);



