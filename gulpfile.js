const fs = require('fs')
const gulp = require('gulp')
const jsdoc2md = require('jsdoc-to-markdown')

gulp.task('docs', function () {
  const output = jsdoc2md.renderSync({
    files: [
      './src/*.js',
      './src/**/*.js'
    ],
    template: fs.readFileSync('./README_tpl.hbs', 'utf8'),
    configure: 'jsdoc-conf.json',
  })
  fs.writeFileSync('./README.md', output)
})