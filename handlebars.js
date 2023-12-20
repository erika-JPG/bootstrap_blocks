// DATA
var data = {
    corpName: "Murzap Quan Direct LLC",
    corpAddress: "5319 HWY 90 W STE 102 #272 Mobile, AL, 36619 USA",
    returnAddress: "Fulfill Brokerage Inc. 1025 Industry Rd Harrodsburg, KY 40330",
    csHours: "Monday - Friday from 8am to 5:30pm PST",
    csEmail: "help@murzap-direct.com",
    siteUrl: "VitalityZenith.club",
    billingDescriptor: "Billing 123Co",
    brandName: "FS Funnels",
    csPhone: "+1 844-203-8553",
    "campaign-id": "375",
    themeCards: "visa mc disco amex ppal gpay apay",
    settings: "digitalProduct digitalProducts supportSection dynamicTerms ingredients appTerms textBrand ",
    style: "stickyNav pillBtn roundBtn sharpBtn",
    heroType: "a",
    ftpType: "a",
    asideType: "a",
    dvdrType: "a",
    prdsType: "a",
    footerType: "a",
    themeNiche: "diet",
    title01: "Enhancing Your Body’s Transformation",
    title02: "Uplifting Transformations",
    title03: "The Rewards of Achieving Your Desired Shape",
    content01: "Diet supplements may offer a helping hand in achieving your desired body goals.",
    content02: "Achieving a slim and toned body can be a rewarding personal achievement, boosting confidence.",
    content03: "Feeling at ease in your own body may contribute to a sense of self-assurance and well-being.",
    image01: "00015",
    image02: "00122",
    image03: "00014",
    themeColor: "#426a07",
    accentColor: "#1081a6",
    themeColorLt: "#c3f973",
    accentColorLt: "#7ed8f6",
    "sf-products": "p_1,p_2,p_3,p_4,p_5,p_7,p_8",
    "sf-featured-product": "p_8",
    "sf-support-products": "p_1,p_2,p_3,p_4,p_5,p_7,p_8",
    "sf-global-products": "p_1,p_2,p_3,p_4,p_5,p_7,p_8",
        cart: {
            items: [
                {
                    name: "Product A",
                    quantity: 2,
                    price: 100,
                    product: "productID_A"
                },
                {
                    name: "Product B",
                    quantity: 1,
                    price: 50,
                    product: "productID_B"
                },
                // ... additional products
            ]
        },
        'sf-error-message': 'This is an error message'
    };

    // INITAL COMPUTATIONS
    const computeCartTotal = (items) => {
        return items.reduce((acc, curr) => {
            return acc + (curr.price * curr.quantity);
        }, 0);
    };

    data.cart.total = computeCartTotal(data.cart.items);


    // HELPERS
    Handlebars.registerHelper('contains', function (value, searchTerm, options) {
        if (value && value.indexOf(searchTerm) > -1) {
            return options.fn(this); // Matches found, render the block inside the #contains block
        } else {
            return options.inverse(this); // Matches not found, render the block inside the #else block
        }
    });

    Handlebars.registerHelper('toFixed', function (value, decimalPlaces) {
        if (typeof value !== 'number' || typeof decimalPlaces !== 'number') {
            return value; // or return some default/fallback value
        }
        return value.toFixed(decimalPlaces);
    });

    Handlebars.registerHelper('moment', function (input, format) {
        switch (input) {
            case 'current':
                return moment().format(format);
            case 'next year':
                return moment().add(1, 'years').format(format);
            case 'two years':
                return moment().add(2, 'years').format(format);
            default:
                return moment(input).format(format);
        }
    });

    // Assuming you have fetched your JSON data and parsed it into a variable called 'data'
    var source = document.getElementById('full-template').innerHTML;
    var template = Handlebars.compile(source);
    var renderedHTML = template(data);

    // Replace entire body or a specific container's content
    document.body.innerHTML = renderedHTML;
