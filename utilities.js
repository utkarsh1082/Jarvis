//********************* Number formatting Function****************************************//

//**** If money is needed in Lakh,Crore or Billion,Million Pass comma_format=0 in this function

var indian_currency_symbol = "₹";
var dollar_symbol = "$";
var conversionRate =1;

function numFormatter(number, currency, rounding, comma_format, numbertype) {

    if (!isNaN(number)) {

        //if number type is money
        if (numbertype == "money") {

            var neg_flag = 0;
            if (number < 0) {
                neg_flag = 1;
                number = Math.abs(number);
            }
            number = number / conversionRate;


            //*********if comma format is indian**********//
            if (comma_format == "2") {
                number = number.toFixed(rounding);
                number = number.toString();

                var parts = (number).split('.');

                var lastThree = parts[0].substring(parts[0].length - 3);
                var otherNumbers = parts[0].substring(0, parts[0].length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                parts[0] = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                var parts_joined = parts.join('.');


                if (neg_flag == 1) {
                    return "-" + currency + parts_joined;
                }
                return (currency + parts_joined);
            }
            //************if comma format is in $ *********//
            else if (comma_format == "3") {
                number = number.toFixed(rounding);
                number = number.toString();
                var parts = (number).split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                var parts_joined = parts.join('.');

                if (neg_flag == 1) {
                    return "-" + currency + parts_joined;
                }
                return (currency + parts_joined);

            }
            else if (comma_format == "0") {
                //************For $ Conversion of amount in Million(M),Billion(B) ************//
                if (currency == "$") {
                    var si = [
                        { value: 1, symbol: "" },
                        { value: 1E3, symbol: "k" },
                        { value: 1E6, symbol: "M" },
                        { value: 1E9, symbol: "B" },
                        { value: 1E12, symbol: "T" },
                        { value: 1E15, symbol: "P" },
                        { value: 1E18, symbol: "E" }
                    ];
                    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
                    var i;
                    for (i = si.length - 1; i > 0; i--) {
                        if (number >= si[i].value) {
                            break;
                        }
                    }
                    if (neg_flag == 1) {
                        return "-" + currency + (number / si[i].value).toFixed(rounding).replace(rx, "$1") + si[i].symbol;
                    }
                    return currency + (number / si[i].value).toFixed(rounding).replace(rx, "$1") + si[i].symbol;


                }
                //*********************For ₹ Conversion of amount in Crore(Cr),Lakh(L),Thousand(K) ******************//


                else if (currency == "₹") {
                    rounding = 0;
                    var suffix = "";
                    var nStr = number.toString();
                    if (!isNaN(nStr)) {
                        if (Math.abs(nStr) > 10000000) {
                            nStr = parseFloat(nStr) / 10000000;
                            suffix = "Cr"
                        } else if (Math.abs(nStr) > 100000) {
                            nStr = parseFloat(nStr) / 100000;
                            suffix = "L"
                        } else if (Math.abs(nStr) > 1000) {
                            nStr = parseFloat(nStr) / 1000;
                            suffix = "K"
                        }
                    }
                /*    var num = nStr;
                    var n1, n2;
                    num = num + '' || '';
                    n1 = num.split('.');
                    n2 = n1[1] || null;
                    n1 = n1[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                    num = n2 ? n1 + '.' + n2 : n1;
                    n1 = num.split('.');
                    n2 = (n1[1]) || null;
                    if (n2 !== null) {
                        if (n2.length <= 1) {
                            n2 = n2 + '0';
                        } else {
                            n2 = n2.substring(0, 2);
                        }
                    }
                    num = n2 ? n1[0] + '.' + n2 : n1[0];
                    if (neg_flag == 1) {
                        return "-" + currency + parseFloat(num).toFixed(rounding) + suffix;
                    }*/
                    return currency + parseFloat(nStr).toFixed(rounding) + suffix;
                }
            }


        }
        //if number type is quantity
        else if (numbertype == "quantity") {
            // *********if comma format is indian**********//
            if (comma_format == "2") {
                if (rounding != '') {
                    number = number.toFixed(rounding);

                }

                number = number.toString();

                var parts = (number).split('.');

                var lastThree = parts[0].substring(parts[0].length - 3);
                var otherNumbers = parts[0].substring(0, parts[0].length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                parts[0] = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                var parts_joined = parts.join('.');



                return (parts_joined);
            }
            //************if comma format is in $ *********//
            else if (comma_format == "3") {
                if (rounding != '') {
                    number = number.toFixed(rounding);

                }

                number = number.toString();
                var parts = (number).split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                var parts_joined = parts.join('.');

                return (parts_joined);

            }


        }
        //if number type is percent
        else if (numbertype == "percent") {
            var parts = number;
            if (!isNaN(parts)) {
                parts = number.toString().split(".");

                //if number is integer
                if (parts.length == 1) {
                    return (number + "%");
                }
                //if number is float
                else {
                    return (number.toFixed(rounding) + "%");
                }
            }
            else {
                return "-";
            }
        }
    }
    else {
        return "-";
    }

}

function getMonthName(month) {
    var day = "";
    switch (month) {
        case 0:
            day = "January";
            break;
        case 1:
            day = "February";
            break;
        case 2:
            day = "March";
            break;
        case 3:
            day = "April";
            break;
        case 4:
            day = "May";
            break;
        case 5:
            day = "June";
            break;
        case 6:
            day = "July";
            break;
        case 7:
            day = "August";
            break;
        case 8:
            day = "September";
            break;
        case 9:
            day = "October";
            break;
        case 10:
            day = "November";
            break;
        case 11:
            day = "December";
            break;
    }
    return day;
}