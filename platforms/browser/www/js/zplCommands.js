/**
 * @file This file contains all the commands used to generate the label for printing the tickets in ZPL, for the Zebra
 * printers.
 * @author Last2Ticket Interns <interns@last2ticket.com>
 */

/* jshint -W119 */
var ZPLPrintCommands = {

    '^XA': {
        title: 'Start Format',
        description: 'Used to start the ZPL label',
        parameters: '',
        fn: function () {
            return '^XA';
        }
    },

    '^PR': {
        title: 'Print rate',
        description: 'Determines the media and slew speed during printing',
        parameters: 'printSpeed[2-14], slewSpeed[2-14], backfeedSpeed[2-14]',
        fn: function (printSpeed, slewSpeed, backfeedSpeed) {
            return '^PR' + printSpeed + ',' + slewSpeed + ',' + backfeedSpeed;
        }
    },

    '^PW': {
        title: 'Print Width',
        description: 'Allows to determine the print width',
        parameters: 'labelWidth[number]',
        fn: function (labelWidth) {
            return '^PW' + labelWidth;
        }
    },

    '^LL': {
        title: 'Label Length',
        description: 'Defines the length of the label',
        parameters: 'labelLength',
        fn: function (labelLength) {
            return '^LL' + labelLength;
        }
    },

    '^PO': {
        title: 'Print Orientation',
        description: 'Inverts the label format 180 degrees',
        parameters: 'orientation[N|I]',
        fn: function (orientation) {
            return '^PO' + orientation;
        }
    },

    '^CI': {
        title: 'Change International Font/Encoding',
        description: 'Change international font (charsets 0-13, 27, 28, 31, 33-36 only)',
        parameters: 'charset[1-13], src1[0-255], dest1[0-255], src2[0-255], dest2[0-255], ...',
        fn: function (charset) {
            return '^CI' + charset;
        }
    },

    '^FX': {
        title: 'Comment',
        description: 'Add non-printing informational comments or statements within a label format',
        parameters: 'comment',
        fn: function (comment) {
            return '^FX' + comment;
        }
    },

    '^LH': {
        title: 'Label Home',
        description: 'Sets the label home position',
        parameters: 'x[0-32000], y[0-32000]',
        fn: function (x, y) {
            return '^LH' + x + ',' + y;
        }
    },

    '^FO': {
        title: 'Field Origin',
        description: 'Sets a field origin',
        parameters: 'x[0-32000], y[0-32000],z[1|2|3]',
        fn: function (x, y) {
            return '^FO' + x + ',' + y;
        }
    },

    '^CF': {
        title: 'Change Alphanumeric Default Font',
        description: 'Sets the default font used in your printer',
        parameters: 'fontName[A-Z&&0-9], height[0-32000], width[0-32000]',
        fn: function (fontName, height) {
            return '^CF' + fontName + ',' + height;
        }
    },

    '^GF': {
        title: 'Graphic Field',
        description: 'Allows you to download graphic field data directly into the printer’s bitmap storage area',
        parameters: 'format[A|B|C], dataBytes[1-99999], totalBytes[1-99999], rowBytes[1-99999], data',
        fn: function (format, dataBytes, totalBytes, rowBytes, data) {
            return '^GF' + format + ',' + dataBytes + ',' + totalBytes + ',' + rowBytes + ',' + data;
        }
    },

    '^GB': {
        title: 'Graphic Box',
        description: 'Used to draw boxes and lines as part of a label format',
        parameters: 'width[t-32000], height[t-32000], thickness[1-32000], color[B|W], rounding[0-8]',
        fn: function (width, height, thickness) {
            return '^GB' + width + ',' + height + ',' + thickness;
        }
    },

    '^FS': {
        title: 'Field Separator',
        description: 'Denotes the end of the field definition',
        parameters: '',
        fn: function () {
            return '^FS';
        }
    },

    '^FB': {
        title: 'Field Block',
        description: 'Allows you to print text into a defined block type format',
        parameters: 'maxWidth[0-width of the label], maxLines[1-9999], lineSpacing[-9999-9999], alignment[L|C|R|J], hangingIndent[0-9999]',
        fn: function (maxWidth, maxLines, lineSpacing, alignment, hangingIndent) {
            return '^FB' + maxWidth + ',' + maxLines + ',' + lineSpacing + ',' + alignment + ',' + hangingIndent;
        }
    },

    '^FD': {
        title: 'Field Data',
        description: 'Defines the data string for a field',
        parameters: 'data',
        fn: function (data) {
            return '^FD' + data + '^FS';
        },
        fnQR: function (QRData) {
            return '^FDHA,' + QRData + '^FS';
        }
    },

    '^BQ': {
        title: 'QR Code Bar Code',
        description: 'QR code bar code',
        parameters: 'position, model[1|2], magnification[1-10], hqml[H|Q|M|L], nabk[0-7]',
        fn: function (position, model, magnification, hqml) {
            return '^BQ' + position + ',' + model + ',' + magnification + ',' + hqml;
        }
    },

    '^PQ': {
        title: 'Print Quantity',
        description: 'Controls the number of labels to print',
        parameters: 'nLabels[1-99,999,999], labelsBetweenPauses[1-99,999,999], replicates[0-99,999,999], noPause[N|Y], cutOnError[N|Y]',
        fn: function (nLabels) {
            return '^PQ' + nLabels;
        }
    },

    '^XZ': {
        title: 'End Format',
        description: 'Indicates the end of a label format',
        parameters: '',
        fn: function () {
            return '^XZ';
        }
    }
};

var ZPLBTCommands = {

    '~HS': {
        title: 'Host Status Return',
        description: '',
        parameters: '',
        return: '',
        fn: function () {
            return '~HS';
        }
    }
};