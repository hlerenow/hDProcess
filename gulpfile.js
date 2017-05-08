var gulp=require("gulp"),
	uglify=require("gulp-uglify"),
	rename=require("gulp-rename");

gulp.task("ugliyjs",function(){
	gulp.src("hDProcess.js").
	pipe(uglify()).
	pipe(rename("hDProcess.min.js")).
	pipe(gulp.dest("dist"));
});