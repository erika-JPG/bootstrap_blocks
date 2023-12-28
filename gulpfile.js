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
    const sections = [
        { type: 'nav', name:'Navbar', traditional: '', modern: '', default: '', other: '' },
        { type: 'hero', name:'Hero', traditional: '', modern: '', default: '', other: '' },
        { type: 'prd', name: 'Product', traditional: '', modern: '', default: '', other: '' },
        { type: 'form', name: 'Forms', traditional: '', modern: '', default: '', other: '' },
        { type: 'div', name: 'Dividers', traditional: '', modern: '', default: '', other: '' },
        { type: 'foot', name: 'Footer', traditional: '', modern: '', default: '', other: '' },
        { type: 'carousel', name: 'Carousels', traditional: '', modern: '', default: '', other: '' },
        { type: 'pannel', name:'Pannels', traditional: '', modern: '', default: '', other: '' },
        // ... add other sections here
    ];

    fs.readdirSync('blocks/').forEach(filename => {
        let link = `<a class="list-group-item" target="_blank" href="blocks/${filename}">${filename}</a>\n`;
        sections.forEach(section => {
            if (filename.startsWith(`${section.type}_`) && filename.endsWith('.html')) {
                if (filename.includes('trad')) section.traditional += link;
                else if (filename.includes('modern')) section.modern += link;
                else if (filename.includes('default')) section.default += link;
                else section.other += link;
            }
        });
    });

    function generateSectionHtml(style, links) {
        return links ? `<div class="text-center col-md-3 mb-5"><h4>${style}</h4><div class="${style.toLowerCase()}">${links}</div></div>` : '';
    }

    let stream = gulp.src('blocks.html');
    sections.forEach(section => {
        const sectionHtml = `<!-- Start ${section.name} Section -->\n<div id="${section.type}" class="row">` +
            generateSectionHtml('Traditional', section.traditional) +
            generateSectionHtml('Modern', section.modern) +
            generateSectionHtml('Default', section.default) +
            generateSectionHtml('Other', section.other) +
            `</div>\n<!-- End ${section.name} Section -->`;
        const regex = new RegExp(`<!-- Start ${section.name} Section -->[\\s\\S]*?<!-- End ${section.name} Section -->`, 'g');
        stream = stream.pipe(replace(regex, sectionHtml));
    });

    return stream.pipe(gulp.dest('./'));
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


