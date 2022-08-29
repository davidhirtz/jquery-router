import gulp from 'gulp';
import ts from 'gulp-typescript';
import merge from 'merge2';

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function() {
    const tsResult = tsProject.src()
        .pipe(tsProject())
        .on("error",()=>{console.log(arguments);});

    return tsResult.js.pipe(gulp.dest('dist'));
});
