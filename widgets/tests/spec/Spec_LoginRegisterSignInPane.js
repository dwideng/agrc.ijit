require([
        'ijit/widgets/authentication/_LoginRegisterSignInPane',

        'dojo/dom-construct',
        'dojo/dom-attr',

        'dojo/_base/window'
    ],

    function(
        _LoginRegisterSignInPane,

        domConstruct,
        domAttr,

        win
    ) {
        describe('ijit/widgets/authentication/_LoginRegisterSignInPane', function() {
            var testWidget;
            var destroy = function(widget) {
                widget.destroyRecursive();
                widget = null;
            };
            beforeEach(function() {
                testWidget = new _LoginRegisterSignInPane({
                    parentWidget: {
                        requestPane: {},
                        hideDialog: jasmine.createSpy('hideDialog'),
                        forgotPane: {}
                    }
                }, domConstruct.create('div', {}, win.body()));
                testWidget.startup();
            });
            afterEach(function() {
                destroy(testWidget);
            });
            it('create a valid object', function() {
                expect(testWidget).toEqual(jasmine.any(_LoginRegisterSignInPane));
            });
            describe('getData', function() {
                it('return the correct data', function() {
                    var email = 'blah';
                    var pass = 'blah2';
                    testWidget.emailTxt.value = email;
                    testWidget.passwordTxt.value = pass;

                    expect(testWidget.getData()).toEqual({
                        email: email,
                        password: pass
                    });
                });
            });
            describe('onSubmitReturn', function() {
                var token = 'blah';
                var dateNum = 1381415260000;
                var user = 'blah3';
                beforeEach(function() {
                    testWidget.onSubmitReturn({
                        result: {
                            token: {
                                token: token,
                                expires: dateNum
                            },
                            user: user
                        }
                    });
                });
                it('hides the dialog', function() {
                    expect(testWidget.parentWidget.hideDialog).toHaveBeenCalled();
                });
                it('gets the returned token and expiration date', function() {
                    expect(testWidget.parentWidget.token).toBe(token);
                    expect(testWidget.parentWidget.tokenExpireDate.getTime()).toBe(dateNum);
                });
                it('stores the user object', function() {
                    expect(testWidget.parentWidget.user).toBe(user);
                });
            });
            describe('validate', function() {
                it('is valid when all fields have a value', function() {
                    testWidget.emailTxt.value = 'this@email.com';
                    testWidget.passwordTxt.value = 'super_secret';

                    expect(testWidget.validate({
                        charCode: 1
                    })).toBe(true);
                    expect(domAttr.has(testWidget.submitBtn, 'disabled')).toBeFalsy();
                });
                it('is not valid when all fields don\'t have a value', function() {
                    testWidget.emailTxt.value = 'this@email.com';
                    testWidget.passwordTxt.value = '';

                    expect(testWidget.validate({
                        charCode: 1
                    })).toBe(false);
                    expect(domAttr.has(testWidget.submitBtn, 'disabled')).toBeTruthy();
                });
                it('submits on enter', function () {
                    spyOn(testWidget, 'onSubmitClick');
                    testWidget.emailTxt.value = 'this@email.com';
                    testWidget.passwordTxt.value = 'super_secret';

                    testWidget.validate({
                        charCode: 13
                    });

                    expect(testWidget.onSubmitClick).toHaveBeenCalled();
                });
            });
            describe('onSubmitClick', function() {
                it('submit button is disabled', function() {
                    testWidget.onSubmitClick();

                    expect(domAttr.has(testWidget.submitBtn, 'disabled')).toBe(true);
                });
            });
        });
    });