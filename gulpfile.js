const gulp = require('gulp');
const replace = require('gulp-replace');
const inject = require('gulp-inject-string');
const gulpIf = require('gulp-if');
const fs = require('fs');
const tap = require('gulp-tap');
const path = require('path');
// const sass = require('gulp-sass')(require('sass'));

let headerContent = `<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
          type="text/css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        <link href="../global.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
        <title>{{title}}</title>
      </head>
      <script id="full-template" type="text/x-handlebars-template">
        <body>
`;

let footerContent = `
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>`;
    
const handlebars = `</body>
  </script>
  <script src="../handlebars.js"></script>
`;

const endFile = `</html>`;

const slickCss = `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.css"
integrity="sha512-6lLUdeQ5uheMFbWm3CP271l14RsX1xtx+J5x2yeIDkkiBpeVTNhTqijME7GgRKKi6hCqovwCoBTlRBEC20M8Mg=="
crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />`;

const slickJs = `<script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"
integrity="sha512-XtmMtDEcNz2j7ekrtHvOVR4iwwaD6o/FUJe6+Zq+HgcCsk3kj4uSQQR8weQ2QVj1o0Pk6PwYLohm206ZzNfubg=="
crossorigin="anonymous" referrerpolicy="no-referrer"></script>`;

gulp.task('compile-me', function() {
    return gulp.src('global.scss') // Adjust the path to your SCSS file
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('global.css')); // Set the destination to the same folder as your SCSS file
});

function hasHeader(file) {
    return file.contents.toString('utf8').includes('<!DOCTYPE html>');
}

function hasFooter(file) {
    return file.contents.toString('utf8').includes('<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>');
}

function hasCustomScripts(file) {
    return file.contents.toString('utf8').includes('<!-- customScripts -->');
}
function hasEndoFile(file) { 
    return file.contents.toString('utf8').includes(`</body>`);
}
function hasEndofDoc(file) { 
    return file.contents.toString('utf8').includes(`</html>`)
}
function needsSlickCss(file) { 
    return file.contents.toString('utf-8').includes('<!-- slick css -->') && !file.contents.toString('utf-8').includes('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.css');
}
function needsSlickJs(file) { 
    return file.contents.toString('utf-8').includes('<!-- slick js -->') && !file.contents.toString('utf-8').includes('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js');
}

gulp.task('generate-links', function() {
    let navTraditional = '', navModern = '', navDefault = '', navOther = '';
    let heroTraditional = '', heroModern = '', heroDefault = '', heroOther = '';
    let prdTraditional = '', prdModern = '', prdDefault = '', prdOther = '';
    let formTraditional = '', formModern = '', formDefault = '', formOther = '';
    let dividerTraditional = '', dividerModern = '', dividerDefault = '', dividerOther = '';
    let footerTraditional = '', footerModern = '', footerDefault = '', footerOther = '';
    

   
    fs.readdirSync('blocks/').forEach(filename => {
        let link = `<a class="list-group-item" target="_blank" href="blocks/${filename}">${filename}</a>\n`;

        if (filename.startsWith('nav_') && filename.endsWith('.html')) {
            if (filename.includes('trad')) navTraditional += link;
            else if (filename.includes('modern')) navModern += link;
            else if (filename.includes('default')) navDefault += link;
            else navOther += link; 
        } else if (filename.startsWith('hero_') && filename.endsWith('.html')) {
            if (filename.includes('trad')) heroTraditional += link;
            else if (filename.includes('modern')) heroModern += link;
            else if (filename.includes('default')) heroDefault += link;
            else heroOther += link; 
        } else if (filename.startsWith('prd_') && filename.endsWith('.html')) {
            if (filename.includes('trad')) prdTraditional += link;
            else if (filename.includes('modern')) prdModern += link;
            else if (filename.includes('default')) prdDefault += link;
            else prdOther += link; 
        } else if (filename.startsWith('form_') && filename.endsWith('.html')) {
            if (filename.includes('trad')) formTraditional += link;
            else if (filename.includes('modern')) formModern += link;
            else if (filename.includes('default')) formDefault += link;
            else formOther += link; 
        } else if (filename.startsWith('div_') && filename.endsWith('.html')) {
            if (filename.includes('trad')) dividerTraditional += link;
            else if (filename.includes('modern')) dividerModern += link;
            else if (filename.includes('default')) dividerDefault += link;
            else dividerOther += link; 
        } else if (filename.startsWith('foot_') && filename.endsWith('.html')) {
            if (filename.includes('trad')) footerTraditional += link;
            else if (filename.includes('modern')) footerModern += link;
            else if (filename.includes('default')) footerDefault += link;
            else footerOther += link; 
        }
    });

    // Generate HTML for each section
    function generateSectionHtml(sectionName, links) {
        return links ? `<div class="text-center col-md-3 mb-5"><h4>${sectionName}</h4><div class="${sectionName.toLowerCase()}">${links}</div></div>` : '';
    }

    // Replace the entire content of each section
    return gulp.src('blocks.html')
    .pipe(replace(/<!-- Start Navbar Section -->[\s\S]*?<!-- End Navbar Section -->/, 
    `<!-- Start Navbar Section -->\n<div id="Navbar" class="row">` +
    generateSectionHtml('Traditional', navTraditional) +
    generateSectionHtml('Modern', navModern) +
    generateSectionHtml('Default', navDefault) +
    generateSectionHtml('Other', navOther) +
    `</div>\n<!-- End Navbar Section -->`))
        .pipe(replace(/<!-- Start Hero Section -->[\s\S]*?<!-- End Hero Section -->/, 
            `<!-- Start Hero Section -->\n<div id="hero" class="row">` +
            generateSectionHtml('Traditional', heroTraditional) +
            generateSectionHtml('Modern', heroModern) +
            generateSectionHtml('Default', heroDefault) +
            generateSectionHtml('Other', heroOther) +
            `</div>\n<!-- End Hero Section -->`))
            .pipe(replace(/<!-- Start Product Section -->[\s\S]*?<!-- End Product Section -->/, 
            `<!-- Start Product Section -->\n<div id="prd" class="row">` +
            generateSectionHtml('Traditional', prdTraditional) +
            generateSectionHtml('Modern', prdModern) +
            generateSectionHtml('Default', prdDefault) +
            generateSectionHtml('Other', prdOther) +
                `</div>\n<!-- End Product Section -->`))
                .pipe(replace(/<!-- Start Forms Section -->[\s\S]*?<!-- End Forms Section -->/, 
                `<!-- Start Forms Section -->\n<div id="form" class="row">` +
                generateSectionHtml('Traditional', formTraditional) +
                generateSectionHtml('Modern', formModern) +
                generateSectionHtml('Default', formDefault) +
                generateSectionHtml('Other', formOther) +
                    `</div>\n<!-- End Forms Section -->`))
                    .pipe(replace(/<!-- Start Dividers Section -->[\s\S]*?<!-- End Dividers Section -->/, 
                    `<!-- Start Dividers Section -->\n<div id="div" class="row">` +
                    generateSectionHtml('Traditional', dividerTraditional) +
                    generateSectionHtml('Modern', dividerModern) +
                    generateSectionHtml('Default', dividerDefault) +
                    generateSectionHtml('Other', dividerOther) +
                        `</div>\n<!-- End Dividers Section -->`))
                        .pipe(replace(/<!-- Start Dividers Section -->[\s\S]*?<!-- End Dividers Section -->/, 
                        `<!-- Start Dividers Section -->\n<div id="div" class="row">` +
                        generateSectionHtml('Traditional', dividerTraditional) +
                        generateSectionHtml('Modern', dividerModern) +
                        generateSectionHtml('Default', dividerDefault) +
                        generateSectionHtml('Other', dividerOther) +
                            `</div>\n<!-- End Dividers Section -->`))
                            .pipe(replace(/<!-- Start Footer Section -->[\s\S]*?<!-- End Footer Section -->/, 
                            `<!-- Start Footer Section -->\n<div id="foot" class="row">` +
                            generateSectionHtml('Traditional', footerTraditional) +
                            generateSectionHtml('Modern', footerModern) +
                            generateSectionHtml('Default', footerDefault) +
                            generateSectionHtml('Other', footerOther) +
                            `</div>\n<!-- End Footer Section -->`))
        
        .pipe(gulp.dest('./'));

});




gulp.task('add-headers-and-scripts', function() {
    return gulp.src('blocks/*.html')
        .pipe(tap(function (file) {
        if (!hasHeader(file)) {
            const filename = path.basename(file.path, '.html');
            file.contents = Buffer.from(headerContent.replace('{{title}}', filename) + file.contents.toString());
        }
    }))
        .pipe(gulpIf(file => needsSlickCss(file), replace('<!-- slick css -->', '<!-- slick css -->' + slickCss)))
        .pipe(gulpIf(file => !hasEndoFile(file), inject.append(handlebars)))
        .pipe(gulpIf(file => needsSlickJs(file), replace('<!-- slick js -->', '<!-- slick js -->' + slickJs )))
        .pipe(gulpIf(file => hasCustomScripts(file) && !hasFooter(file), replace('<!-- customScripts -->', footerContent + '<!-- customScripts -->')))
        .pipe(gulpIf(file => !hasFooter(file) && !hasCustomScripts(file), inject.append(footerContent)))
        .pipe(gulpIf(file => !hasEndofDoc(file), inject.append(endFile)))
        .pipe(gulp.dest('blocks/'));
});

gulp.task('default', gulp.series('generate-links', 'add-headers-and-scripts'));


