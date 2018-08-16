/**
 * @file This file contains all the methods to generate the label dynamicaly.
 * @author Last2Ticket Interns <interns@last2ticket.com>
 */
var ZPLabel = {
    totalLabelSize: 0,
    hasImage: null,
    hasQRCode: null,
    labelConfs: null,
    labelHeader: [],
    labelQR: [],
    labelBody: [],
    labelFooter: [],
    OFFSET: 10,
    IMAGE_SIZE: 180,
    QRCODE_SIZE: 180,
    QRCODE_INFO_SIZE: 50,
    TITLE_LINE_SIZE: 50,
    SUBTITLE_LINE_SIZE: 50,
    BODY_LINE_SIZE: 30,

    /**
     * Creates a Text field with ZPL code.
     * 
     * @param {number} fontName - position of the font to be selected
     * @param {number} fontSize - size of the font 
     * @param {number} positionX - starting vertical position of the text field
     * @param {number} positionY - starting horizontal position of the text field
     * @param {number} maxSize - max size of the writing space
     * @param {number} maxLines - max number of lines to be writen
     * @param {number} lineSpacing - spacing between lines
     * @param {string} alignment - alignment of the text
     * @param {number} hangingIndent - hanging indentation
     * @param {string} data - text to be writen
     * @returns the ZPL code with the text flied and the data
     */
    ZPLText: function (fontName, fontSize, positionX, positionY, maxSize, maxLines, lineSpacing, alignment, hangingIndent, data) {
        return ZPLPrintCommands['^CF'].fn(fontName, fontSize) +
            ZPLPrintCommands['^FO'].fn(positionX, positionY) +
            ZPLPrintCommands['^FB'].fn(maxSize, maxLines, lineSpacing, alignment, hangingIndent) +
            ZPLPrintCommands['^FD'].fn(data);
    },

    /**
     * Creates a graphic box in ZPL code.
     * 
     * @param {number} startPositionX - starting vertical position of the text field
     * @param {number} startPositionY - starting horizontal position 
     * @param {number} width - width of the div
     * @param {number} heigth - heigth of the div
     * @param {number} thickness - thickness of the div 
     * @returns the ZPL code of the grapic box
     */
    ZPLDiv: function (startPositionX, startPositionY, width, heigth, thickness) {
        return ZPLPrintCommands['^FO'].fn(startPositionX, startPositionY) +
            ZPLPrintCommands['^GB'].fn(width, heigth, thickness) +
            ZPLPrintCommands['^FS'].fn();
    },

    /**
     * Creates a QRCode in ZPL code.
     * 
     * @param {number} positionX - starting vertical position
     * @param {number} positionY - starting horizontal position
     * @param {number} code - data to be inserted in the QRCode
     * @returns the ZPL 
     */
    ZPLQR: function (positionX, positionY, code) {
        return ZPLPrintCommands['^FO'].fn(positionX, positionY) +
            ZPLPrintCommands['^BQ'].fn('N', 2, 7, 'H') +
            ZPLPrintCommands['^FD'].fnQR(code);
    },

    /**
     * Clear all the fileds of the label.
     * 
     */
    clearLabel: function () {
        ZPLabel.totalLabelSize = 0;
        ZPLabel.hasImage = null;
        ZPLabel.hasQRCode = null;
        ZPLabel.labelConfs = null;
        ZPLabel.labelHeader = [];
        ZPLabel.labelQR = [];
        ZPLabel.labelBody = [];
        ZPLabel.labelFooter = [];
    },

    /**
     * Generate the label including all the portions of the label.
     * 
     * @returns the ZPL code of the label
     */
    generateLabel: function () {
        var label = ZPLabel.labelConfs +
            ZPLabel.labelHeader.join('') +
            ZPLabel.labelQR.join('') +
            ZPLabel.labelBody.join('') +
            ZPLabel.labelFooter.join('');
        return label;
    },

    /**
     * Creates the configurations section of the label.
     * 
     */
    createConfs: function () {
        ZPLabel.labelConfs = ZPLPrintCommands['^XA'].fn() +
            ZPLPrintCommands['^PR'].fn(14, 14, 14) +
            ZPLPrintCommands['^PW'].fn(406) +
            ZPLPrintCommands['^LL'].fn(ZPLabel.totalLabelSize) +
            ZPLPrintCommands['^PO'].fn('N') +
            ZPLPrintCommands['^CI'].fn(28);
    },

    /**
     * Creates the Header section of the label.
     * 
     * @param {boolean} hasImage - if the label should have image
     * @param {string} eventName - the name of the event
     * @param {string} categoryName - the name of the category
     * @param {string} extraInfo - extra info of the ticket
     */
    createHeaderZone: function (hasImage, eventName, categoryName, extraInfo) {

        //Create a ticket separator
        ZPLabel.labelHeader.push(ZPLabel.ZPLDiv(0, 50, 400, 0, 1));

        //Define the image 'Last2Ticket'
        if (hasImage) {
            ZPLabel.totalLabelSize += ZPLabel.IMAGE_SIZE + ZPLabel.OFFSET;
            ZPLabel.labelHeader.push('^FO70,60^GFA,4142,4142,38, 000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000FC000000000000000001FFFFF000000000007FE0000000000FFF800007FFFFFFFFFFE000000000000000000000000003FFFFF80000000000FFF0000000007FFFF00007FFFFFFFFFFF000002000000000000000000003FFFFF80000000000FFF000000001FFFFFE0007FFFFFFFFFFF000004000100000000000000003FFFFF80000000001FFF000000007FFFFFF8007FFFFFFFFFFF000008000000000000000000003FFFFF80000000001FFF80000000FFFFFFFE007FFFFFFFFFFF000010000000000000000000003FFFFF80000000001FFF80000003FFFFFFFF007FFFFFFFFFFF000020000020000000000000003FFFFF00000000003FFF80000003FFFFFFFF807FFFFFFFFFFF000000000000000000000000000FFFFE00000000003FFFC0000007FFFFFFFFC07FFFFFFFFFFF0000000F00100000000000000000FFE000000000007FFFC000000FFFE03FFFC07FFFFFFFFFFF0000403040100000000000000000FFE000000000007FFFC000000FFF8003FFC07F801FFC01FF0000002020080000000000000000FFE000000000007FFFE000001FFE0000FFC07F801FFC01FF0000804000080000000000000000FFE00000000000FFFFE000001FFC0000FFC07F801FFC01FF0000800000080000000000000000FFE00000000000FFFFE000001FFC0000FFC07F801FFC01FF0000800000080000000000000000FFE00000000000FFFFF000001FFC00007FC07F801FFC01FF0000800000080000000000000000FFE00000000001FFBFF000001FF800007FC07F801FFC00FF0000800000080000000000000000FFE00000000001FF9FF000001FFC00007FC000001FFC00000000800000080000000000000000FFE00000000001FF9FF800001FFC00007FC000001FFC00000000800000000000000000000000FFE00000000003FF1FF800001FFC00003F8000001FFC00000000804020100000000000000000FFE00000000003FF0FFC00001FFE0000000000001FFC00000000004040100000000000000000FFE00000000003FF0FFC00001FFF8000000000001FFC00000000000000000000000000000000FFE00000000007FE0FFC00000FFFE000000000001FFC00000000038080200000000000000000FFE00000000007FE07FE000007FFFC00000000001FFC00000000380100000000000000000000FFE00000000007FE07FE000007FFFF00000000001FFC00000000000000000000000000000000FFE0000000000FFC07FE000003FFFFF0000000001FFC00000000000000800000000000000000FFE0000000000FFC07FF000001FFFFFC000000001FFC00000000000000800000000000000000FFE0000000001FFC03FF000000FFFFFF800000001FFC00000000000401000000000000000000FFE0000000001FF803FF0000003FFFFFC00000001FFC00000000000800000000000000000000FFE0000000001FF803FF8000000FFFFFF00000001FFC00000000000800000000000000000000FFE0000000003FF801FF80000003FFFFF80000001FFC000000000010041C0000000000000000FFE0000000003FF001FF80000000FFFFFC0000001FFC00000000000000010000000000000000FFE0000000003FF001FFC00000001FFFFE0000001FFC00000000002008010000000000000000FFE0000000007FFFFFFFC000000003FFFF0000001FFC00000000000000010000000000000000FFE0000000007FFFFFFFC0000000007FFF8000001FFC00000000004010000000000000000000FFE0000000007FFFFFFFE0000000000FFF8000001FFC00000000008020008000000000000000FFE000000000FFFFFFFFE00000000007FF8000001FFC00000000000020008000000000000000FFE000000000FFFFFFFFE0001FE00003FFC000001FFC00000000010040008000000000000000FFE000000000FFFFFFFFF0001FE00001FFC000001FFC00000000000001008000000000000000FFE000000001FFFFFFFFF0001FF00001FFC000001FFC00000000000088000000000000000000FFE0003FC001FFFFFFFFF8001FF00001FFC000001FFC00000000040000000000000000000000FFE0003FC001FF80003FF8001FF00000FFC000001FFC00000000000000000000000000000000FFE0003FC003FF80001FF8001FF00001FFC000001FFC00000000080000004000000000000000FFE0003FC003FF00001FFC001FF00001FFC000001FFC00000000000000004000000000000000FFE0003FC003FF00001FFC001FF00001FFC000001FFC00000000000000000000000000000000FFE0003FC007FF00000FFC001FF80003FFC000001FFC00000000080000000000000000000000FFE0003FC007FF00000FFE001FFE0007FF8000001FFC00000000080001000000000000000000FFFFFFFFC00FFE00000FFE001FFFE03FFF8000001FFC000000000800F000000000000000000FFFFFFFFFC03FFF80003FFF801FFFFFFFFF000003FFFFC0000000003E0000000000000000003FFFFFFFFFC0FFFFE0007FFFE00FFFFFFFFF000007FFFFE000000003000000000000000000003FFFFFFFFFC0FFFFE0007FFFE007FFFFFFFE000007FFFFE000000000000000000000000000003FFFFFFFFFC0FFFFE0007FFFE003FFFFFFFC000007FFFFE000000000000000000000000000003FFFFFFFFFC0FFFFE0007FFFE000FFFFFFF0000007FFFFE000000000000000000000000000003FFFFFFFFFC0FFFFE0007FFFE0003FFFFFE0000007FFFFE000000000000000000000000000003FFFFFFFFFC0FFFFE0007FFFE0000FFFFF80000007FFFFE00000000000000000000000000000000000000000000000000000000000FFF800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000FFFFFC0FF0001FE001FE01FE07FFFFC07FFFFF00000000000000000000000000000000000001FFFFFE1FF8007FF803FF01FF07FFFFE07FFFFF00000000000000000000000000000000000001FFFFFC0FF001F83E01FE007E03FFFFE07FFFFF00000000000000000000000000000000000001C0300C018003C00F0030007000E000E0601C0300000000000000000000000000000000000001C0300C0180078003803000E000E000E0601C0300000000000000000000000000000000000001C0300E0180070001803001E000E000E0601C030000000000000000000000000000000000000180300C01800E0001803003C000E000E0601C030000000000000000000000000000000000000000300001800C00018030038000E00000001C000000000000000000000000000000000000000000300001801C00018030070000E00000001C000000000000000000000000000000000000000000300001801C000180300E0000E00000001C0000000000000000000000000000000000000000003000018018000000301C0000E00000001C000000000000000000000000000000000000000000300001803800000030380000E00000001C000000000000000000000000000000000000000000300001803800000030780000E00000001C000000000000000000000000000000000000000000300001803800000038F00000FFFC00001C00000000000000000000000000000000000000000030000180380000003FE00000FFFE00001C00000000000000000000000000000000000000000030000180380000003FE00000E00000001C000000000000000000000000000000000000000000300001803800000030700000E00000001C000000000000000000000000000000000000000000300001803800000030780000E00000001C0000000000000000000000000000000000000000003000018038000000303C0000E00000001C0000000000000000000000000000000000000000003000018018000000301E0000E00000001C000000000000000000000000000000000000000000300001801C000180300F0000E00000001C000000000000000000000000000000000000000000300001801C00018030078000E00000001C000000000000000000000000000000000000000000300001800C00018030038000E00000001C000000000000000000000000000000000000000000300001800E0001803001C000E00060001C00000000000000000000000000000000000000000030000180070001803000E000E000E0001C000000000000000000000000000000000000000000300001800780038030007000E000E0001C0000000000000000000000000000000000000000003000018003C00F0030003800E000E0001C000000000000000000000000000000000000000000F80007C001F03E00F8003C01FFFFE0003E000000000000000000000000000000000000000003FF001FF8007FF803FF00FF07FFFFE000FF800000000000000000000000000000000000000001FE000FF0001FE001FE00FF07FFFFC000FF80000000000^FS');
        } else {
            ZPLabel.totalLabelSize += 60 + ZPLabel.OFFSET;
        }

        // Define the event name
        ZPLabel.labelHeader.push(ZPLabel.ZPLText(0, 50, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'C', 0, eventName));
        ZPLabel.totalLabelSize += (eventName.length < 20) ? ZPLabel.TITLE_LINE_SIZE : parseInt((eventName.length / 13) * ZPLabel.TITLE_LINE_SIZE);
        ZPLabel.totalLabelSize += ZPLabel.OFFSET;

        //Define the category name
        ZPLabel.labelHeader.push(ZPLabel.ZPLText(0, 40, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'C', 0, categoryName));
        ZPLabel.totalLabelSize += (categoryName.length < 23) ? ZPLabel.SUBTITLE_LINE_SIZE : parseInt((categoryName.length / 20) * ZPLabel.SUBTITLE_LINE_SIZE);
        ZPLabel.totalLabelSize += ZPLabel.OFFSET;

        //Define extra info
        if (extraInfo != ' ') {
            ZPLabel.labelHeader.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'C', 0, extraInfo));
            ZPLabel.totalLabelSize += (extraInfo.length < 23) ? ZPLabel.SUBTITLE_LINE_SIZE : parseInt((extraInfo.length / 20) * ZPLabel.SUBTITLE_LINE_SIZE);
            ZPLabel.totalLabelSize += ZPLabel.OFFSET;
        }

    },

    /**
     * Creates the QRCode section of the label
     * 
     * @param {string} code - code to be inserted in the QRCode
     */
    createQRZone: function (code) {

        ZPLabel.labelQR.push(ZPLabel.ZPLQR(120, ZPLabel.totalLabelSize, code));
        ZPLabel.totalLabelSize += ZPLabel.QRCODE_SIZE;

        ZPLabel.labelQR.push(ZPLabel.ZPLText(0, 20, 20, ZPLabel.totalLabelSize, 360, 4, 1, 'C', 0, code));
        ZPLabel.totalLabelSize += ZPLabel.QRCODE_INFO_SIZE + ZPLabel.OFFSET;
    },

    /**
     * Creates the body zone of the ZPL label.
     * 
     * @param {Object} data - n number of objects as arguments
     */
    createBodyZone: function (order, date, price, venue) {

        var ticOrder = order + '';
        var ticDate = date + '';
        var ticPrice = price + '';
        var ticVenue = venue + '';

        //Define Order ID
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'J', 0, lang[Ctrl.currentLang]['label-order'] + ':'));
        ZPLabel.totalLabelSize += 1;
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'J', 0, lang[Ctrl.currentLang]['label-order'] + ':'));
        ZPLabel.totalLabelSize += 3;
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 25, 170, ZPLabel.totalLabelSize, 250, 10, 1, 'J', 0, ticOrder));
        ZPLabel.totalLabelSize += (ticOrder.length < 25) ? ZPLabel.BODY_LINE_SIZE : parseInt((ticOrder.length / 18) * ZPLabel.BODY_LINE_SIZE);
        ZPLabel.totalLabelSize += ZPLabel.OFFSET;

        //Define Date
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'J', 0, lang[Ctrl.currentLang]['label-date'] + ':'));
        ZPLabel.totalLabelSize += 1;
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'J', 0, lang[Ctrl.currentLang]['label-date'] + ':'));
        ZPLabel.totalLabelSize += 3;
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 25, 90, ZPLabel.totalLabelSize, 310, 10, 1, 'J', 0, ticDate));
        ZPLabel.totalLabelSize += (ticDate.length < 25) ? ZPLabel.BODY_LINE_SIZE : parseInt((ticDate.length / 18) * ZPLabel.BODY_LINE_SIZE);
        ZPLabel.totalLabelSize += ZPLabel.OFFSET;

        //Define Price
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'J', 0, lang[Ctrl.currentLang]['label-price'] + ':'));
        ZPLabel.totalLabelSize += 1;
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'J', 0, lang[Ctrl.currentLang]['label-price'] + ':'));
        ZPLabel.totalLabelSize += 3;
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 25, 100, ZPLabel.totalLabelSize, 300, 10, 1, 'J', 0, ticPrice));
        ZPLabel.totalLabelSize += (ticPrice.length < 25) ? ZPLabel.BODY_LINE_SIZE : parseInt((ticPrice.length / 18) * ZPLabel.BODY_LINE_SIZE);
        ZPLabel.totalLabelSize += ZPLabel.OFFSET;

        //Define Venue
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'J', 0, lang[Ctrl.currentLang]['label-venue'] + ':'));
        ZPLabel.totalLabelSize += 1;
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 30, 20, ZPLabel.totalLabelSize, 360, 10, 1, 'J', 0, lang[Ctrl.currentLang]['label-venue'] + ':'));
        ZPLabel.totalLabelSize += 3;
        ZPLabel.labelBody.push(ZPLabel.ZPLText(0, 25, 110, ZPLabel.totalLabelSize, 260, 10, 1, 'J', 0, ticVenue));
        ZPLabel.totalLabelSize += (ticVenue.length < 25) ? ZPLabel.BODY_LINE_SIZE : parseInt((ticVenue.length / 18) * ZPLabel.BODY_LINE_SIZE);
        ZPLabel.totalLabelSize += ZPLabel.OFFSET;
    },

    /**
     * Creates the footer section of the label.
     * 
     */
    createFooterZone: function () {
        ZPLabel.labelFooter.push(ZPLabel.ZPLDiv(20, ZPLabel.totalLabelSize, 400, 0, 1));
        ZPLabel.totalLabelSize += ZPLabel.OFFSET;

        ZPLabel.labelFooter.push(ZPLabel.ZPLText(0, 20, 20, ZPLabel.totalLabelSize, 360, 4, 1, 'R', 0, 'Powered by POS.web'));
        ZPLabel.totalLabelSize += ZPLabel.OFFSET * 2;

        ZPLabel.labelFooter.push(ZPLPrintCommands['^PQ'].fn(1));
        ZPLabel.labelFooter.push(ZPLPrintCommands['^XZ'].fn());
    },

    /**
     * Generates a new label to be printed by passing the name of the event,the name of the category, the order ID,
     * the date, the price, and the venue.
     * 
     * @param {boolean} hasimage - if the label should have image or not
     * @param {boolean} hasQRCode - if the label should have QrCode or not
     * @param {string} qrCode - the code of the QR Graphics
     * @param {string} eventName - name of the event
     * @param {string} categoryName - name of the category
     * @param {string} extraInfo - extra info of the ticket
     * @param {string} orderId - Id of the order
     * @param {string} date - date of the session
     * @param {string} price - price of the item
     * @param {string} venue - venue of the event
     * @returns the new ZPL code of the label
     */
    generateL2Ticket: function (hasImage, hasQRCode, qrCode, eventName, categoryName, extraInfo, orderId, date, price, venue ) {
        ZPLabel.clearLabel();
        
        ZPLabel.createHeaderZone(hasImage, eventName, categoryName, extraInfo);

        if (hasQRCode) {
            ZPLabel.createQRZone(qrCode);
        }

        ZPLabel.createBodyZone(orderId, date, price, venue);

        ZPLabel.createFooterZone();
        ZPLabel.createConfs();

        return ZPLabel.generateLabel();
    }
};