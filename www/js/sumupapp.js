/**
 * @file Contains all the information to be used to communicate with the SumUp SDK.
 * @author Last2Ticket Interns <interns@last2ticket.com>
 */

/**
 * @namespace
 */
var SumUpApp = {
    user_logged: false,
    configuration_made: false,
    is_sumup_active: true,

    /**
     * An object representing an Bluetooth device.
     * 
     * @typedef {Object} CallbackObj
     * @property {boolean} success - true or false accordingly to the success of the request
     * @property {*} message - response sent from the plugin
     */

    /**
     * Performs the login in the SumUp SDK. To perform a valid login one must have valid credentials, the app bundle registered in the developer options
     * of the SumUp account and the Affiliate Key provided in the SumUp developer options in the Dashboard.
     *
     * @param {CallbackObj} cb - the callback Object of the result
     */
    login: function (cb) {
        if (!SumUpApp.user_logged) {
            sumUp.login().then(function (success) {
                (typeof success === 'object') ? console.log('LOGIN SUCESS: ' + JSON.stringify(success)): console.log('LOGIN SUCCESS: ' + success);

                SumUpApp.user_logged = true;
                
                cb({
                    success: true,
                    message: success
                });
            }).catch(function (error) {
                (typeof error === 'object') ? console.log('LOGIN ERROR: ' + JSON.stringify(error)): console.log('LOGIN ERROR: ' + error);
                cb({
                    success: false,
                    message: error
                });
            });
        } else {
            cb({
                success: false,
                message: 'User is already logged in'
            });
        }
    },

    /**
     * Performs the configuration of the SumUp terminal (connection / recognising), can only be performed once. multiple calls to this method may glitch the terminal.
     *
     * @param {CallbackObj} cb - the callback Object of the result
     */
    configure: function (cb) {
        if (!SumUpApp.configuration_made) {
            sumUp.settings().then(function (success) {
                    (typeof success === 'object') ? console.log('CONFIGURE SUCESS: ' + JSON.stringify(success)): console.log('CONFIGURE SUCCESS: ' + success);

                    //SumUp.configuration_made = true;

                    cb({
                        success: true,
                        message: success
                    });
                })
                .catch(function (error) {
                    (typeof error === 'object') ? console.log('CONFIGURE ERROR: ' + JSON.stringify(error)): console.log('CONFIGURE ERROR: ' + error);
                    cb({
                        success: false,
                        message: error
                    });
                });
        } else {
            cb({
                success: false,
                message: 'Printer already configured'
            });
        }
    },

    /**
     * Performs a payment request to the SumUp Terminal.
     *
     * @param {string} price - price to be paid 
     * @param {string} currency - currency of the payment ('EUR' | 'USD' | etc)
     * @param {string} message - message to be presented in the order in the SumUp dashboard
     * @param {CallbackObj} cb - the callback Object of the result
     */
    pay: function (price, currency, message, cb) {
        sumUp.pay(price, currency, message).then(function (success) {
                (typeof success === 'object') ? console.log('PAY SUCESS: ' + JSON.stringify(success)): console.log('PAY SUCCESS: ' + success);
                cb({
                    success: true,
                    message: success
                });
            })
            .catch(function (error) {
                (typeof error === 'object') ? console.log('PAY ERROR: ' + JSON.stringify(error)): console.log('PAY ERROR: ' + error);
                cb({
                    success: false,
                    message: error
                });
            });
    },

    /**
     * Performs the logout of the SumUp SDK. If this method isn't called the SumUp app will always save the credentials and automattically log in.
     *
     * @param {CallbackObj} cb - the callback Object of the result
     */
    logout: function (cb) {
        sumUp.logout().then(function (success) {
                (typeof success === 'object') ? console.log('LOGOUT SUCESS: ' + JSON.stringify(success)): console.log('LOGOUT SUCCESS: ' + success);
                SumUpApp.user_logged = false;
                cb({
                    success: true,
                    message: success
                });
            })
            .catch(function (error) {
                (typeof error === 'object') ? console.log('LOGOUT ERROR: ' + JSON.stringify(error)): console.log('LOGOUT ERROR: ' + error);
                cb({
                    success: false,
                    message: error
                });
            });
    },

    /**
     * Performs the prepare of the Terminal (wake up). This method should be called when a payment is about to be performed to 'wake up' the Terminal and make the payment process faster.
     *
     * @param {CallbackObj} cb - the callback Object of the result
     */
    prepare: function (cb) {
        sumUp.prepare().then(function (success) {
                (typeof success === 'object') ? console.log('PREPARE SUCESS: ' + JSON.stringify(success)): console.log('PREPARE SUCCESS: ' + success);
                cb({
                    success: true,
                    message: success
                });
            })
            .catch(function (error) {
                (typeof error === 'object') ? console.log('PREPARE ERROR: ' + JSON.stringify(error)): console.log('PREPARE ERROR: ' + error);
                cb({
                    success: false,
                    message: error
                });
            });
    }
};