const gulp = require('gulp');
const replace = require('gulp-replace');
const inject = require('gulp-inject-string');
const gulpIf = require('gulp-if');
const fs = require('fs');

const headerContent = `<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
          type="text/css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        <link href="../global.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.css"
    integrity="sha512-6lLUdeQ5uheMFbWm3CP271l14RsX1xtx+J5x2yeIDkkiBpeVTNhTqijME7GgRKKi6hCqovwCoBTlRBEC20M8Mg=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />
        <title></title>
      </head>
<body>
`;

const footerContent = `
    <!-- Example: Loading jQuery -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"
    integrity="sha512-XtmMtDEcNz2j7ekrtHvOVR4iwwaD6o/FUJe6+Zq+HgcCsk3kj4uSQQR8weQ2QVj1o0Pk6PwYLohm206ZzNfubg=="
    crossorigin="anonymous" referrerpolicy="no-referrer"></script>`;
const endFile = `</body>
</html>`;

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

gulp.task('generate-links', function() {
    let navLinks = '';
    let heroLinks = '';
    let prdsLinks = '';
    let formLinks = '';
    let divsLinks = '';
    let footLinks = '';

    // Reading all files from the blocks directory
    fs.readdirSync('blocks/').forEach(filename => {
        if (filename.startsWith('nav_') && filename.endsWith('.html')) {
            navLinks += `<li><a href="blocks/${filename}">${filename}</a></li>\n`;
        } else if (filename.startsWith('hero_') && filename.endsWith('.html')) {
            heroLinks += `<li><a href="blocks/${filename}">${filename}</a></li>\n`;
        } else if (filename.startsWith('prd_') && filename.endsWith('.html')) {
            prdsLinks += `<li><a href="blocks/${filename}">${filename}</a></li>\n`;
        } else if (filename.startsWith('form_') && filename.endsWith('.html')) {
            formLinks += `<li><a href="blocks/${filename}">${filename}</a></li>\n`;
        } else if (filename.startsWith('div_') && filename.endsWith('.html')) {
            divsLinks += `<li><a href="blocks/${filename}">${filename}</a></li>\n`;
        } else if (filename.startsWith('foot_') && filename.endsWith('.html')) {
            footLinks += `<li><a href="blocks/${filename}">${filename}</a></li>\n`;
        }
    });

    // Finding the specific containers in blocks.html and replacing their content
    return gulp.src('blocks.html')
        .pipe(replace(/(<div id="nav">)[\s\S]*?(<\/div>)/, `$1\n<ul>\n${navLinks}</ul>\n$2`))
        .pipe(replace(/(<div id="hero">)[\s\S]*?(<\/div>)/, `$1\n<ul>\n${heroLinks}</ul>\n$2`))
        .pipe(replace(/(<div id="prds">)[\s\S]*?(<\/div>)/, `$1\n<ul>\n${prdsLinks}</ul>\n$2`))
        .pipe(replace(/(<div id="form">)[\s\S]*?(<\/div>)/, `$1\n<ul>\n${formLinks}</ul>\n$2`))
        .pipe(replace(/(<div id="divs">)[\s\S]*?(<\/div>)/, `$1\n<ul>\n${divsLinks}</ul>\n$2`))
        .pipe(replace(/(<div id="foot">)[\s\S]*?(<\/div>)/, `$1\n<ul>\n${footLinks}</ul>\n$2`))
        .pipe(gulp.dest('./')); 
});


gulp.task('add-headers-and-scripts', function() {
    return gulp.src('blocks/*.html')
        .pipe(gulpIf(file => !hasHeader(file), inject.prepend(headerContent)))
        .pipe(gulpIf(file => hasCustomScripts(file) && !hasFooter(file), replace('<!-- customScripts -->', footerContent + '<!-- customScripts -->')))
        .pipe(gulpIf(file => !hasFooter(file) && !hasCustomScripts(file), inject.append(footerContent)))
        .pipe(gulpIf(file => !hasEndoFile(file), inject.append(endFile)))
        .pipe(gulp.dest('blocks/'));
});

gulp.task('default', gulp.series('generate-links', 'add-headers-and-scripts'));

